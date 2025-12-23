import express from "express";
import Stripe from "stripe";
import Order from '../models/order.model.js';
import { emitNewOrder } from '../socket.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Initialize Stripe lazily to ensure env vars are loaded
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post("/prepare", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    
    // Get authenticated user data from middleware
    const userId = req.user._id;
    const userEmail = req.user.email;
    
    let { items, totalWithTax } = req.body; // Get items and totalWithTax from frontend
    
    // Parse items if it's a string
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid items format"
        });
      }
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "No items provided"
      });
    }

    // Frontend already applied 23% tax, so use items as-is
    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Extract numeric price from string (e.g., "$300" -> 300)
      // Note: Frontend should send tax-included price already
      let price = item.price;
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[$,]/g, ''));
      }
      
      if (isNaN(price) || price <= 0) {
        console.error(`Invalid price for item: ${item.title}`, item);
        continue;
      }

      const itemSubtotal = price * (item.quantity || 1);
      subtotal += itemSubtotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title || 'Product',
            description: item.useCase || item.description || undefined
          },
          unit_amount: Math.round(price * 100) // Convert to cents
        },
        quantity: item.quantity || 1
      });
    }

    if (!lineItems.length) {
      return res.status(400).json({
        success: false,
        message: "No valid items found"
      });
    }

    // Calculate totals (frontend already calculated tax)
    const total = totalWithTax || lineItems.reduce((sum, item) => 
      sum + (item.price_data.unit_amount / 100) * item.quantity, 0
    );
    
    // Calculate tax from frontend total or estimate
    const tax = totalWithTax ? totalWithTax - subtotal : subtotal * 0.23;

    // Prepare items array for database
    const orderItems = items.map(item => {
      const itemPrice = typeof item.price === 'string' ? 
        parseFloat(item.price.replace(/[$,]/g, '')) : 
        Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      const itemSubtotal = itemPrice * itemQuantity;
      const itemTax = itemSubtotal * 0.23; // Assuming 23% tax per item
      const itemTotal = itemSubtotal + itemTax;

      return {
        id: String(item.id),
        type: String(item.type || 'product'),
        title: String(item.title || 'Unknown'),
        useCase: item.useCase || '',
        price: itemPrice,
        quantity: itemQuantity,
        subtotal: itemSubtotal,
        tax: itemTax,
        total: itemTotal
      };
    });

    // ✅ Create order FIRST in database with user reference
    const newOrder = await Order.create({
      user: userId,           // From authenticated user
      email: userEmail,       // From user account (verified email)
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      total: total,
      currency: 'USD',
      stripe: {
        sessionId: null,      // Will be set after Stripe session creation
        paymentIntentId: null,
        customerId: null
      },
      status: 'pending',
      testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'),
      createdAt: new Date()
    });

    console.log('📝 Created order in database:', {
      orderId: newOrder._id,
      userId: userId,
      email: userEmail,
      itemCount: items.length,
      subtotal: subtotal,
      tax: tax,
      total: total
    });

    // ✅ Create Stripe session with minimal metadata (orderId only)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: userEmail,  // Use authenticated user's email
      metadata: {
        orderId: newOrder._id.toString(),  // ONLY store order ID (not items!)
        userId: userId.toString()           // For verification
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // Session expires in 30 minutes
    });

    // ✅ Update order with Stripe session ID
    newOrder.stripe.sessionId = session.id;
    await newOrder.save();

    // Emit WebSocket event for new pending order
    emitNewOrder(newOrder.toObject());

    console.log(`✅ Created Stripe session: ${session.id} for order: ${newOrder._id}`);

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Checkout preparation failed",
      error: error.message
    });
  }
});

// Verify payment endpoint - use this in dev when webhooks can't reach localhost
router.get("/verify/:sessionId", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId } = req.params;
    const userId = req.user._id; // Get authenticated user ID

    // Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(`🔍 Verifying session ${sessionId}, payment_status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      // Find order by session ID and user ID
      const existingOrder = await Order.findOne({ 
        "stripe.sessionId": sessionId,
        user: userId // Ensure order belongs to this user
      });
      
      if (!existingOrder) {
        console.log(`⚠️ No order found for session: ${sessionId} and user: ${userId}`);
        return res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }

      if (existingOrder.status === "paid") {
        console.log(`✅ Order already marked as paid: ${existingOrder._id}`);
        return res.json({ 
          success: true, 
          message: "Payment already verified", 
          order: existingOrder 
        });
      }

      // Verify metadata matches
      if (session.metadata.orderId !== existingOrder._id.toString()) {
        console.error(`❌ Order ID mismatch: metadata ${session.metadata.orderId} vs db ${existingOrder._id}`);
        return res.status(400).json({
          success: false,
          message: "Order verification failed"
        });
      }

      // Update the order to paid
      const order = await Order.findOneAndUpdate(
        { 
          _id: existingOrder._id,
          user: userId // Additional security check
        },
        { 
          status: "paid",
          "stripe.paymentIntentId": session.payment_intent,
          "stripe.customerId": session.customer,
          paidAt: new Date()
        },
        { new: true }
      );

      if (order) {
        // Emit WebSocket event for order status change
        const { emitOrderStatusChange } = await import('../socket.js');
        emitOrderStatusChange(order.toObject());
        
        console.log(`✅ Payment verified and order updated: ${order._id}`);
        return res.json({ 
          success: true, 
          message: "Payment verified", 
          order 
        });
      }
    }

    res.json({ 
      success: false, 
      message: "Payment not completed",
      paymentStatus: session.payment_status 
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;