import express from "express";
import Stripe from "stripe";
import Order from '../models/order.model.js';

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

export default router;
