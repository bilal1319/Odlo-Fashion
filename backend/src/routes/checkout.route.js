import express from "express";
import Stripe from "stripe";
import Order from '../models/order.model.js';
import { emitNewOrder } from '../socket.js';

const router = express.Router();

// Initialize Stripe lazily to ensure env vars are loaded
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};


router.post("/prepare", async (req, res) => {
  try {
    const stripe = getStripe();
    let { items, email } = req.body;

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

    if(!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }

    const lineItems = [];

    for (const item of items) {
      // Extract numeric price from string (e.g., "$300" -> 300)
      let price = item.price;
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[$,]/g, ''));
      }
      
      if (isNaN(price) || price <= 0) {
        console.error(`Invalid price for item: ${item.title}`, item);
        continue;
      }

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        items: JSON.stringify(items)
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`
    });

    // Create pending order in database
    try {
      const totalAmount = lineItems.reduce((sum, item) => 
        sum + (item.price_data.unit_amount / 100) * item.quantity, 0
      );

      console.log('📝 Creating order with data:', {
        email,
        sessionId: session.id,
        totalAmount,
        itemsCount: items.length,
        itemsType: typeof items,
        firstItem: items[0]
      });

      // Prepare items array for database
      const orderItems = items.map(item => ({
        id: String(item.id),
        type: String(item.type || 'product'),
        title: String(item.title || 'Unknown'),
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));

      console.log('📦 Prepared order items:', orderItems);

      const newOrder = await Order.create({
        email,
        items: orderItems,
        amountPaid: totalAmount,
        currency: 'USD',
        stripe: {
          sessionId: session.id,
          paymentIntentId: null,
          customerId: null
        },
        status: 'pending',
        testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
      });

      // Emit WebSocket event for new pending order
      emitNewOrder(newOrder.toObject());

      console.log(`✅ Created pending order for session: ${session.id}, Order ID: ${newOrder._id}`);
    } catch (orderError) {
      console.error('❌ Error creating pending order:', orderError.message);
      console.error('Full error:', orderError);
      // Don't fail the checkout if order creation fails
    }

    res.json({
      success: true,
      checkoutUrl: session.url
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
router.get("/verify/:sessionId", async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId } = req.params;

    // Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(`🔍 Verifying session ${sessionId}, payment_status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      // Check if order is already paid to avoid duplicate updates
      const existingOrder = await Order.findOne({ "stripe.sessionId": sessionId });
      
      if (existingOrder && existingOrder.status === "paid") {
        console.log(`✅ Order already marked as paid: ${existingOrder._id}`);
        return res.json({ 
          success: true, 
          message: "Payment already verified", 
          order: existingOrder 
        });
      }

      // Update the order to paid
      const order = await Order.findOneAndUpdate(
        { "stripe.sessionId": sessionId },
        { 
          status: "paid",
          "stripe.paymentIntentId": session.payment_intent,
          "stripe.customerId": session.customer
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
      } else {
        console.log(`⚠️ No order found for session: ${sessionId}`);
        return res.status(404).json({ 
          success: false, 
          message: "Order not found" 
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
