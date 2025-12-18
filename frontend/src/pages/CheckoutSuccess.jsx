import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../utils/axiosInstance';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState(null);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/checkout/verify/${sessionId}`);
        if (response.data.success) {
          setVerified(true);
          setOrderDetails(response.data.order);
          console.log('✅ Payment verified:', response.data);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {verifying ? (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
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
              {verified 
                ? "Your order has been confirmed." 
                : "You will receive a confirmation email shortly."}
            </p>

            {orderDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-green-600 font-medium mb-1">Order Confirmed</p>
                <p className="text-sm text-green-800">
                  Status: <span className="font-semibold uppercase">{orderDetails.status}</span>
                </p>
                <p className="text-sm text-green-800">
                  Amount: <span className="font-semibold">${orderDetails.amountPaid?.toFixed(2)} {orderDetails.currency}</span>
                </p>
              </div>
            )}

            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">Order Reference</p>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {sessionId}
                </p>
              </div>
            )}
          </>
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
