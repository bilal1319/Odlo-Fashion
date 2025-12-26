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

// Define tax rate (23%)
const TAX_RATE = 0.23;

router.post("/prepare", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    
    // Get authenticated user data from middleware
    const userId = req.user._id;
    const userEmail = req.user.email;
    
    let { items, subtotal: frontendSubtotal, taxRate = TAX_RATE } = req.body;
    
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

    // Calculate backend subtotal to verify with frontend
    let backendSubtotal = 0;
    for (const item of items) {
      let price = item.price;
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[$,]/g, ''));
      }
      
      if (isNaN(price) || price <= 0) {
        console.error(`Invalid price for item: ${item.title}`, item);
        continue;
      }
      backendSubtotal += price * (item.quantity || 1);
    }

    // Verify subtotal matches (allow small rounding differences)
    if (frontendSubtotal && Math.abs(frontendSubtotal - backendSubtotal) > 0.01) {
      console.warn(`Subtotal mismatch: frontend=${frontendSubtotal}, backend=${backendSubtotal}`);
      // Use backend calculation for consistency
    }

    // Use backend subtotal
    const subtotal = backendSubtotal;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Create line items for Stripe with base prices
    const lineItems = [];
    
    for (const item of items) {
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
            description: item.useCase || item.description || undefined,
            metadata: {
              type: item.type || 'product',
              id: String(item.id)
            }
          },
          unit_amount: Math.round(price * 100) // Base price in cents
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

    // Prepare items array for database
    const orderItems = items.map(item => {
      const itemPrice = typeof item.price === 'string' ? 
        parseFloat(item.price.replace(/[$,]/g, '')) : 
        Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      const itemSubtotal = itemPrice * itemQuantity;
      
      // Calculate tax proportionally for each item
      const itemTax = itemSubtotal * taxRate;
      const itemTotal = itemSubtotal + itemTax;

      return {
        id: String(item.id),
        type: String(item.type || 'product'),
        title: String(item.title || 'Unknown'),
        useCase: item.useCase || '',
        price: itemPrice, // Store base price
        quantity: itemQuantity,
        subtotal: itemSubtotal,
        tax: itemTax,
        total: itemTotal
      };
    });

    // ✅ Create order in database with user reference
    const newOrder = await Order.create({
      user: userId,           // From authenticated user
      email: userEmail,       // From user account (verified email)
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      total: total,
      currency: 'USD',
      taxRate: taxRate,
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

    // Create a tax rate in Stripe (optional, for automatic tax calculation)
    let stripeTaxRate;
    try {
      stripeTaxRate = await stripe.taxRates.create({
        display_name: 'Sales Tax',
        inclusive: false, // Tax is added on top of price
        percentage: taxRate * 100, // 23%
        country: 'PK', // Pakistan
        description: '23% Sales Tax'
      });
      console.log('✅ Created Stripe tax rate:', stripeTaxRate.id);
    } catch (taxError) {
      console.warn('Could not create Stripe tax rate, using automatic tax:', taxError.message);
    }

    // ✅ Create Stripe session
    const sessionConfig = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: userEmail,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
        taxRate: taxRate.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
    };

    // Add tax calculation to Stripe session
    if (stripeTaxRate) {
      // Apply the tax rate to all line items
      sessionConfig.line_items = lineItems.map(item => ({
        ...item,
        tax_rates: [stripeTaxRate.id]
      }));
    } else {
      // Use Stripe's automatic tax calculation
      sessionConfig.automatic_tax = { enabled: true };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // ✅ Update order with Stripe session ID
    newOrder.stripe.sessionId = session.id;
    if (stripeTaxRate) {
      newOrder.stripe.taxRateId = stripeTaxRate.id;
    }
    await newOrder.save();

    // Emit WebSocket event for new pending order
    emitNewOrder(newOrder.toObject());

    console.log(`✅ Created Stripe session: ${session.id} for order: ${newOrder._id}`);

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: newOrder._id,
      calculatedTotals: {
        subtotal: subtotal,
        tax: tax,
        total: total
      }
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

// Verify payment endpoint
router.get("/verify/:sessionId", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId } = req.params;
    const userId = req.user._id;

    // Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });

    console.log(`🔍 Verifying session ${sessionId}, payment_status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      // Find order by session ID and user ID
      const existingOrder = await Order.findOne({ 
        "stripe.sessionId": sessionId,
        user: userId
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

      // Get final totals from Stripe
      const stripeTotal = session.amount_total / 100; // Convert from cents
      const stripeSubtotal = session.amount_subtotal / 100;
      const stripeTax = stripeTotal - stripeSubtotal;

      // Update the order with Stripe's final calculations
      const order = await Order.findOneAndUpdate(
        { 
          _id: existingOrder._id,
          user: userId
        },
        { 
          status: "paid",
          subtotal: stripeSubtotal,
          tax: stripeTax,
          total: stripeTotal,
          "stripe.paymentIntentId": session.payment_intent,
          "stripe.customerId": session.customer,
          paidAt: new Date(),
          finalStripeData: {
            amount_total: session.amount_total,
            amount_subtotal: session.amount_subtotal,
            amount_tax: session.total_details?.amount_tax || 0,
            currency: session.currency
          }
        },
        { new: true }
      );

      if (order) {
        // Emit WebSocket event for order status change
        const { emitOrderStatusChange } = await import('../socket.js');
        emitOrderStatusChange(order.toObject());
        
        console.log(`✅ Payment verified and order updated: ${order._id}`);
        console.log(`💰 Stripe totals - Subtotal: $${stripeSubtotal}, Tax: $${stripeTax}, Total: $${stripeTotal}`);
        
        return res.json({ 
          success: true, 
          message: "Payment verified", 
          order,
          stripeTotals: {
            subtotal: stripeSubtotal,
            tax: stripeTax,
            total: stripeTotal
          }
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