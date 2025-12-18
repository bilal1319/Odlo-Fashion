import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join admin room for order updates
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log('👤 Admin joined room:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper function to emit order updates to admin dashboard
export const emitOrderUpdate = (order, eventType = 'order-updated') => {
  if (io) {
    io.to('admin-room').emit(eventType, order);
    console.log(`📡 Emitted ${eventType} to admin-room`);
  }
};

// Emit new order event
export const emitNewOrder = (order) => {
  emitOrderUpdate(order, 'new-order');
};

// Emit order status change
export const emitOrderStatusChange = (order) => {
  emitOrderUpdate(order, 'order-status-changed');
};
