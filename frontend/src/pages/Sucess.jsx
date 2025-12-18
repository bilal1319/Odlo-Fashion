import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const orderNumber = sessionId ? sessionId.substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase();

  // Clear cart from localStorage when success page loads
  useEffect(() => {
    // Clear the cart from localStorage
    localStorage.removeItem('odlo-cart');
    
    // Also clear from sessionStorage if you use it
    sessionStorage.removeItem('odlo-cart');
    
    // You could also dispatch an event to notify other components
    window.dispatchEvent(new Event('cart-cleared'));
    
    console.log('Cart cleared after successful payment');
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Thank you for your order</p>
          <p className="text-sm text-gray-500 mb-6">Order #{orderNumber}</p>
          <div className="space-y-4 max-w-md mx-auto">
            <Link
              to="/"
              className="block bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 text-sm font-medium"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="block w-full border border-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;