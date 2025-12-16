import React, { useState } from "react";
import { LockClosedIcon, CreditCardIcon, UserIcon } from "@heroicons/react/24/solid";
import { useCart } from "../context/Cartcontext";
import { Link } from "react-router-dom";
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

const Checkout = () => {
  const { cart, getTotalPrice } = useCart();
  const [step, setStep] = useState('shipping');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    country: 'Pakistan'
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const pakistanCities = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", 
    "Multan", "Gujranwala", "Peshawar", "Quetta", "Sialkot",
    "Bahawalpur", "Sargodha", "Sukkur", "Larkana", "Sheikhupura",
    "Rahim Yar Khan", "Jhang", "Mardan", "Gujrat", "Kasur",
    "Mingora", "Nawabshah", "Sahiwal", "Okara", "Mirpur Khas",
    "Chiniot", "Kamoke", "Hyderabad", "Abbottabad", "Wah Cantonment",
    "Khanewal", "Dera Ghazi Khan", "Jacobabad", "Muzaffargarh",
    "Khanpur", "Gojra", "Bahawalnagar", "Muridke", "Pakpattan",
    "Jhelum", "Chakwal"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validate shipping form
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Scroll to top before changing step
    window.scrollTo({
      top: 0,
      behavior: 'instant' 
    });
    
    // Set step to payment after scroll
    setStep('payment');
  };

  // Add scroll to top for back button as well
  const handleBackToShipping = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    setStep('shipping');
  };

  // Add scroll to top for success screen initialization
  React.useEffect(() => {
    if (step === 'success') {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, [step]);

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: '',
    });
    const [errors, setErrors] = useState({});

    const handlePaymentChange = (e) => {
      const { name, value } = e.target;
      
      // Format card number with spaces
      if (name === 'cardNumber') {
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setPaymentDetails({
          ...paymentDetails,
          [name]: formatted
        });
        
        // Validate card number (basic Luhn algorithm)
        if (value.replace(/\s/g, '').length >= 16) {
          const cardNumber = value.replace(/\s/g, '');
          if (!isValidCardNumber(cardNumber)) {
            setErrors({ ...errors, cardNumber: 'Invalid card number' });
          } else {
            const { cardNumber: _, ...newErrors } = errors;
            setErrors(newErrors);
          }
        }
      } 
      // Format expiry date (MM/YY)
      else if (name === 'expiryDate') {
        let formatted = value.replace(/\D/g, '');
        if (formatted.length >= 2) {
          formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
        }
        setPaymentDetails({
          ...paymentDetails,
          [name]: formatted
        });
        
        // Validate expiry date
        if (formatted.length === 5) {
          const [month, year] = formatted.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          
          if (month < 1 || month > 12) {
            setErrors({ ...errors, expiryDate: 'Invalid month' });
          } else if (year < currentYear || (year == currentYear && month < currentMonth)) {
            setErrors({ ...errors, expiryDate: 'Card expired' });
          } else {
            const { expiryDate: _, ...newErrors } = errors;
            setErrors(newErrors);
          }
        }
      }
      else if (name === 'cvv') {
        const formatted = value.replace(/\D/g, '').substring(0, 4);
        setPaymentDetails({
          ...paymentDetails,
          [name]: formatted
        });
        
        if (formatted.length < 3) {
          setErrors({ ...errors, cvv: 'Invalid CVV' });
        } else {
          const { cvv: _, ...newErrors } = errors;
          setErrors(newErrors);
        }
      }
      else {
        setPaymentDetails({
          ...paymentDetails,
          [name]: value
        });
      }
    };

    const isValidCardNumber = (number) => {
      // Basic Luhn algorithm implementation
      let sum = 0;
      let shouldDouble = false;
      
      for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return (sum % 10) === 0;
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!paymentDetails.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      } else if (!isValidCardNumber(paymentDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!paymentDetails.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (paymentDetails.expiryDate.length !== 5) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      }
      
      if (!paymentDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (paymentDetails.cvv.length < 3) {
        newErrors.cvv = 'CVV must be at least 3 digits';
      }
      
      if (!paymentDetails.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Card holder name is required';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      if (!stripe) {
        setPaymentError('Payment system not available');
        return;
      }

      setProcessing(true);
      setPaymentError('');

      // Convert our custom form data to Stripe CardElement format
      const cardDetails = {
        number: paymentDetails.cardNumber.replace(/\s/g, ''),
        exp_month: paymentDetails.expiryDate.split('/')[0],
        exp_year: '20' + paymentDetails.expiryDate.split('/')[1],
        cvc: paymentDetails.cvv
      };

      // Create a Stripe card element manually
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method with card details
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: cardDetails.number,
          exp_month: cardDetails.exp_month,
          exp_year: cardDetails.exp_year,
          cvc: cardDetails.cvc,
        },
        billing_details: {
          name: paymentDetails.cardHolderName || `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: 'PK'
          }
        }
      });

      if (error) {
        setPaymentError(error.message);
        setProcessing(false);
        return;
      }

      // Simulate successful payment
      setTimeout(() => {
        const randomOrderNumber = 'ORD' + Math.floor(Math.random() * 1000000);
        setOrderNumber(randomOrderNumber);
        setPaymentSuccess(true);
        setStep('success');
        setProcessing(false);
      }, 2000);
    };

    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-6">Payment Details</h3>
        <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-lg">
          {/* Card Holder Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <UserIcon className="h-5 w-5 inline mr-2 text-gray-600" />
              Card Holder Name *
            </label>
            <input
              type="text"
              name="cardHolderName"
              value={paymentDetails.cardHolderName}
              onChange={handlePaymentChange}
              placeholder="Name on card"
              className={`w-full border ${errors.cardHolderName ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.cardHolderName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <CreditCardIcon className="h-5 w-5 inline mr-2 text-gray-600" />
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
                maxLength="5"
                className={`w-full border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                CVV *
              </label>
              <input
                type="password"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handlePaymentChange}
                placeholder="123"
                maxLength="4"
                className={`w-full border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Accepted Cards */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">We accept</p>
            <div className="flex space-x-2">
              <div className="w-10 h-6 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800">VISA</span>
              </div>
              <div className="w-10 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-800">MC</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {paymentError}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBackToShipping}
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              ← Back to Information
            </button>
            <button
              type="submit"
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
                  Processing Payment...
                </>
              ) : `Pay $${getTotalPrice().toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const SuccessScreen = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content with top padding for fixed navbar */}
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
          <div className="lg:w-2/3  p-6">
            {step === 'shipping' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Information</h3>
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
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address" 
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
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
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option>Pakistan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State/Province</label>
                      <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State/Province" 
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <select 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">--Select City--</option>
                        {pakistanCities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
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
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            )}

            {step === 'success' && <SuccessScreen />}
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:w-1/3">
            <div className=" border-3 rounded-lg  p-6 sticky top-24">
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
                
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
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