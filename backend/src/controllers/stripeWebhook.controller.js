import express from "express";
import Stripe from "stripe";
import Order from '../models/order.model.js';
import { emitNewOrder, emitOrderStatusChange } from '../socket.js';

const router = express.Router();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post("/", async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const userId = session.metadata.userId;

      if (!orderId) {
        console.error("❌ No orderId in Stripe session metadata");
        return res.json({ received: true });
      }

      // Find order by ID (from metadata)
      const order = await Order.findById(orderId);
      
      if (!order) {
        console.error(`❌ Order not found: ${orderId}`);
        return res.json({ received: true });
      }

      // Verify user matches
      if (userId && order.user.toString() !== userId) {
        console.error(`❌ User mismatch: order user ${order.user} vs metadata user ${userId}`);
        // Still update payment status but log warning
      }

      // Verify amount matches
      const expectedAmount = Math.round(order.total * 100); // in cents
      if (session.amount_total !== expectedAmount) {
        console.error(`❌ Amount mismatch: order ${expectedAmount} vs session ${session.amount_total}`);
        // Log alert but still update status
      }

      // Update order status
      if (order.status !== 'paid') {
        order.status = 'paid';
        order.stripe.paymentIntentId = session.payment_intent;
        order.stripe.customerId = session.customer;
        order.paidAt = new Date();
        await order.save();

        console.log(`✅ Webhook: Order ${orderId} marked as paid`);
        
        // Emit WebSocket event
        emitOrderStatusChange(order.toObject());
      } else {
        console.log(`ℹ️ Order ${orderId} already paid, skipping update`);
      }
    }

    // Handle expired sessions
    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: 'expired',
          updatedAt: new Date()
        });
        console.log(`🕒 Order ${orderId} expired`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
    res.status(500).send("Webhook handler failed");
  }
});

export default router;