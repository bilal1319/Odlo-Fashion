import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


router.post("/prepare", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { items, email } = req.body;

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
      if (item.type === "product") {
        const product = await db.collection("products").findOne({
          _id: item.id,
          isActive: true
        });

        if (!product) continue;

        lineItems.push({
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.title
            },
            unit_amount: product.price * 100
          },
          quantity: 1
        });
      }

      if (item.type === "bundle") {
        const bundle = await db.collection("bundles").findOne({
          _id: item.id,
          isActive: true
        });

        if (!bundle) continue;

        lineItems.push({
          price_data: {
            currency: bundle.currency.toLowerCase(),
            product_data: {
              name: bundle.title
            },
            unit_amount: bundle.price * 100
          },
          quantity: 1
        });
      }

      if (item.type === "master_bundle") {
        const master = await db.collection("master_bundles").findOne({
          _id: item.id,
          isActive: true
        });

        if (!master) continue;

        lineItems.push({
          price_data: {
            currency: master.currency.toLowerCase(),
            product_data: {
              name: master.title
            },
            unit_amount: master.price * 100
          },
          quantity: 1
        });
      }
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

    res.json({
      success: true,
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Checkout preparation failed"
    });
  }
});

export default router;
