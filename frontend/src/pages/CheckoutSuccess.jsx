import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // You can fetch order details using sessionId if needed
    // For now, we'll just show a success message
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-2">
          Thank you for your purchase!
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          You will receive a confirmation email shortly.
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Order Reference</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {sessionId}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition font-medium"
          >
            Continue Shopping
          </Link>
          
          <Link
            to="/bundles"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition font-medium"
          >
            View Bundles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
