import Order from "../models/order.model.js";
import { generateOrderReceipt } from "../utils/pdfgenerator.js";

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email") // Populate user details
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get orders by user ID (for logged-in users)
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get order by session ID (with user verification)
export const getOrderBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const order = await Order.findOne({
      "stripe.sessionId": sessionId,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    const orderUserId = order.user?._id?.toString();
    const requestingUserId = userId.toString();

    if (userRole !== "admin" && orderUserId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Get order by ID (with user verification)
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    const orderUserId = order.user?._id?.toString();
    const requestingUserId = userId.toString();

    if (userRole !== "admin" && orderUserId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Get orders by email (admin only - legacy/deprecated)
export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate("user", "name email") // Still populate for admin view
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      note: "This endpoint is deprecated. Please use user-based endpoints for new implementations.",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


export const downloadReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    
    // Get order with populated data
    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId 
    }).populate('user', 'username email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
    
    // Get shipping address if available
    let shippingAddress = null;
    if (order.shippingAddress) {
      shippingAddress = order.shippingAddress;
    } else {
      // Try to get from checkout data
      shippingAddress = {
        address: order.address || '',
        city: order.city || '',
        state: order.state || '',
        zipCode: order.zipCode || '',
        country: order.country || 'Pakistan'
      };
    }
    
    // Generate PDF
    const pdfBuffer = await generateOrderReceipt(
      order, 
      order.user, 
      shippingAddress
    );
    
    // Set response headers
    const fileName = `invoice-${order._id.toString().slice(-6)}.pdf`;
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("Download receipt error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate receipt" 
    });
  }
};