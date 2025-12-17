import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, email } = req.body;

    console.log("Received cart:", JSON.stringify(cart, null, 2)); // Debug line

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate each item has a valid price
    const line_items = cart.map(item => {
      // Debug each item
      console.log("Processing item:", {
        title: item.title,
        price: item.price,
        type: typeof item.price,
        quantity: item.quantity
      });

      // Convert price to number and validate
      const price = parseFloat(item.price);
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.title}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        items: JSON.stringify(cart),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    console.error("Full error:", err); // More detailed error
    res.status(500).json({ 
      error: "Stripe session failed",
      details: err.message 
    });
  }
});

export default router;
