// utils/socketClient.js - Simple Vite version
import { io } from 'socket.io-client';

// Use Vite environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
                   import.meta.env.VITE_API_URL?.replace('/api', '') || "https://odlo-fashion.onrender.com" ||
                   'http://localhost:8000';

let socket = null;

export const getIO = () => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected to:', SOCKET_URL);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};