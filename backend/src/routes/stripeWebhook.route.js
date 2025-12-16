import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).send("DB not connected");
    }

    // ✅ We only create orders for successful checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

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
        } catch (_) {
          items = [];
        }
      }

      // ✅ Idempotency: don’t insert duplicate orders
      const existing = await db.collection("orders").findOne({
        "stripe.sessionId": session.id
      });

      if (!existing) {
        const orderDoc = {
          email,
          items, // you can also enrich this later with titles/prices
          amountPaid: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency ? session.currency.toUpperCase() : null,
          stripe: {
            sessionId: session.id,
            paymentIntentId: session.payment_intent || null
          },
          status: "paid",
          createdAt: new Date()
        };

        await db.collection("orders").insertOne(orderDoc);
      }
    }

    // Stripe expects a 2xx quickly
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
    res.status(500).send("Webhook handler failed");
  }
});

export default router;
