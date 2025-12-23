import express from 'express';
import { 
    getAllOrders, 
    getOrderBySession, 
    getOrdersByEmail,
    getOrdersByUser,
    getOrderById
} from '../controllers/order.controller.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin only - get all orders
router.get('/all', protect, authorizeRoles('admin'), getAllOrders);

// User gets their own orders
router.get('/my-orders', protect, getOrdersByUser);

// Get order by session ID (protected - user must own order or be admin)
router.get('/session/:sessionId', protect, getOrderBySession);

// Get order by ID (protected - user must own order or be admin)
router.get('/:orderId', protect, getOrderById);

// Get orders by email (admin only - legacy/deprecated)
router.get('/email/:email', protect, authorizeRoles('admin'), getOrdersByEmail);

export default router;