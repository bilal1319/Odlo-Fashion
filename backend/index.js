// server.js
// In your app.js (main server file)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { connectDB } from "./src/db.js";

// routes
import productRoutes from "./src/routes/products.routes.js";
import categoryRoutes from "./src/routes/categories.routes.js";
import collectionRoutes from "./src/routes/collections.route.js";
import checkoutRoutes from "./src/routes/checkout.route.js";
import bundleRoutes from "./src/routes/bundles.routes.js";
import masterBundleRoutes from "./src/routes/masterBundle.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import stripeWebhookRoutes from "./src/routes/stripeWebhook.route.js";
import stripeRoutes from './src/routes/Stripe.route.js'
import orderRoutes from "./src/routes/order.routes.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./src/socket.js";

import adminRoutes from "./src/routes/admin/index.js"

dotenv.config();

const app = express();

// Stripe webhook raw body
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

// Normal JSON
const server = createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// IMPORTANT: Apply raw body parser BEFORE json() for webhook routes
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

// Regular middleware for other routes
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

// Cookie parser - ADD THIS
app.use(cookieParser());

// Body parsers - ADD THIS TOO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/webhooks/stripe", stripeWebhookRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/master-bundles", masterBundleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes)

// Webhook route - must be mounted AFTER the raw body middleware

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Stripe key loaded:", !!process.env.STRIPE_SECRET_KEY);
    console.log("WebSocket server ready");
  });
});
export default app