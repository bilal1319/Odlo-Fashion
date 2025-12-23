import React, { useState } from "react";
import { LockClosedIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Checkout = () => {
  const { cart, getTotalPrice, getTotalWithTax, clearCart, calculateItemWithTax } = useCart();
  const taxData = getTotalWithTax();
  
  const [step, setStep] = useState('shipping');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    country: 'Pakistan'
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || 
        !formData.address || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep('payment');
  };

  const handleBackToShipping = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep('shipping');
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Prepare cart items with tax-included prices for Stripe
      const items = cart.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        price: calculateItemWithTax(item.price),
        quantity: item.quantity || 1
      }));

      // Call backend to create Stripe checkout session
      const response = await axiosInstance.post('/checkout/prepare', {
        items,
        totalWithTax: taxData.totalWithTax
      });

      if (response.data.success && response.data.checkoutUrl) {
        // Clear cart before redirecting to Stripe
        clearCart();
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to initialize payment. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment initialization failed. Please try again.');
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (step === 'payment') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-16 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex space-x-2 mb-8">
          <LockClosedIcon className="h-6 w-6 text-green-600" />
          <h1 className="text-xl font-semibold">Secure Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-6xl">
            <div className={`flex items-center ${step === 'shipping' || step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' || step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Information</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${step === 'payment' ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          {/* Left Column - Main Form */}
          <div className="lg:w-2/3 p-6">
            {step === 'shipping' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Shipping Information</h3>
                <form onSubmit={handleShippingSubmit} className="space-y-4 max-w-2xl">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name" 
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name" 
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street Address" 
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Zip/Postal Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="Zip/Postal Code"
                          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-black text-white font-medium py-3 px-8 rounded-md hover:bg-gray-700 transition text-sm"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

            {step === 'payment' && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6">Payment</h3>
                <div className="max-w-lg">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <CreditCardIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Secure Payment with Stripe</h4>
                        <p className="text-sm text-blue-800">
                          You'll be redirected to Stripe's secure checkout page to complete your payment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>Total (including tax)</span>
                      <span>${taxData.totalWithTax.toFixed(2)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleBackToShipping}
                      className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                      disabled={processing}
                    >
                      ← Back to Information
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={processing}
                      className={`flex-1 py-3 px-6 rounded-md text-sm font-medium ${
                        processing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-black hover:bg-gray-800'
                      } text-white`}
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="h-5 w-5 inline mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:w-1/3">
            <div className="border-3 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="pb-4 border-b">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{item.useCase}</p>
                            <div className="text-sm mt-1">
                              <span className="font-semibold">${item.price}</span>
                              <span className="text-gray-600 ml-2">+ tax</span>
                            </div>
                          </div>
                          {item.quantity > 1 && (
                            <div className="flex-shrink-0">
                              <span className="w-6 h-6 flex items-center justify-center bg-gray-900 text-white text-xs font-bold rounded-full">
                                {item.quantity}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${taxData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${taxData.totalWithTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/cart"
                  className="text-center block text-sm text-black hover:text-gray-800 hover:underline"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;