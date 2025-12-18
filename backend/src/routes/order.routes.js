import express from 'express';
import { getAllOrders, getOrderBySession, getOrdersByEmail } from '../controllers/order.controller.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin only - get all orders
router.get('/all', protect, authorizeRoles('admin'), getAllOrders);

// Get order by session ID
router.get('/session/:sessionId', getOrderBySession);

// Get orders by email
router.get('/email/:email', getOrdersByEmail);

export default router;
