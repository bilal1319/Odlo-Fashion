import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";

const router = express.Router();


// Check if we're in test mode
const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');

router.post("/", async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  if (isTestMode) {
    console.log(`🔵 [TEST MODE] Webhook received. Headers:`, {
      signature: sig ? 'present' : 'missing',
      contentType: req.headers['content-type'],
      eventId: req.headers['stripe-event-id'] || 'none'
    });
  }

  let event;

  try {
    // req.body should be a raw Buffer due to express.raw() middleware
    event = stripe.webhooks.constructEvent(
      req.body, // This is raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (isTestMode) {
      console.log(`✅ [TEST] Webhook signature verified: ${event.type} (${event.id})`);
    }
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    if (isTestMode) {
      console.error("❌ [TEST] Debug info:", {
        bodyType: typeof req.body,
        bodyLength: req.body?.length,
        signature: sig,
        webhookSecretPresent: !!process.env.STRIPE_WEBHOOK_SECRET
      });
    }
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const db = mongoose.connection.db;

    if (!db) {
      console.error("❌ Database not connected");
      return res.status(500).send("DB not connected");
    }

    // ✅ We only create orders for successful checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (isTestMode) {
        console.log(`🛒 [TEST] Processing checkout.session.completed:`, {
          sessionId: session.id,
          paymentStatus: session.payment_status,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          customerEmail: session.customer_details?.email || session.customer_email
        });
      }

      // Email from Stripe (trusted)
      const email =
        session.customer_details?.email ||
        session.customer_email ||
        null;

      // Items from metadata (what was bought)
      let items = [];
      if (session.metadata?.items) {
        try {
          items = JSON.parse(session.metadata.items);
          if (isTestMode) {
            console.log(`📦 [TEST] Parsed items from metadata:`, items);
          }
        } catch (parseErr) {
          console.error("Failed to parse items metadata:", parseErr.message);
          items = [];
        }
      }

      // ✅ Idempotency: don't insert duplicate orders
      const existing = await db.collection("orders").findOne({
        "stripe.sessionId": session.id
      });

      if (!existing) {
        const orderDoc = {
          email,
          items,
          amountPaid: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency ? session.currency.toUpperCase() : null,
          stripe: {
            sessionId: session.id,
            paymentIntentId: session.payment_intent || null,
            customerId: session.customer || null
          },
          status: "paid",
          createdAt: new Date(),
          testMode: isTestMode
        };

        await db.collection("orders").insertOne(orderDoc);
        
        if (isTestMode) {
          console.log(`✅ [TEST] Order created successfully:`, {
            orderId: orderDoc._id,
            sessionId: session.id,
            email: email,
            amount: orderDoc.amountPaid
          });
        }
      } else {
        if (isTestMode) {
          console.log(`⚠️ [TEST] Order already exists for session: ${session.id}`);
        }
      }
    } else {
      // Log other webhook events in test mode
      if (isTestMode) {
        console.log(`ℹ️ [TEST] Unhandled webhook event type: ${event.type}`, {
          eventId: event.id,
          objectId: event.data.object.id
        });
      }
    }

    // Handle other important webhook events
    switch (event.type) {
      case 'checkout.session.async_payment_succeeded':
        if (isTestMode) {
          console.log(`💰 [TEST] Async payment succeeded: ${event.data.object.id}`);
        }
        break;
        
      case 'checkout.session.expired':
        if (isTestMode) {
          console.log(`⏰ [TEST] Checkout session expired: ${event.data.object.id}`);
        }
        break;
        
      case 'payment_intent.succeeded':
        if (isTestMode) {
          console.log(`💳 [TEST] Payment intent succeeded: ${event.data.object.id}`);
        }
        break;
    }

    // Stripe expects a 2xx response quickly
    res.json({ 
      received: true,
      eventType: event.type,
      eventId: event.id,
      testMode: isTestMode
    });
  } catch (err) {
    console.error("❌ Webhook handling failed:", err);
    if (isTestMode) {
      console.error("❌ [TEST] Error details:", {
        error: err.message,
        stack: err.stack,
        eventType: event?.type,
        eventId: event?.id
      });
    }
    res.status(500).json({ 
      error: "Webhook handler failed",
      testMode: isTestMode
    });
  }
});

export default router;