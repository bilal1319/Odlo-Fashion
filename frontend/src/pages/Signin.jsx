import React, { useRef, useState } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Signin = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  const navigate = useNavigate();
  const { signin, isLoading, error, clearError } = useAuthStore();
  
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    const email = emailRef.current.value;
    const password = passwordRef.current.value;


    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await signin(email, password);
      navigate('/'); 
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="md:flex">
            <div className="md:w-2/5 bg-gradient-to-b from-gray-900 to-black p-8 flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FaShieldAlt className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
                <p className="text-gray-300 mb-8">
                  Manage your services and orders
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                    <span>24/7 Support available</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                    <span>Zero-knowledge encryption</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-3/5 p-10">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Enter your credentials to access our services</p>
              </div>
              
              {/* Error Display */}
              {(error || localError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error || localError}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 focus:bg-white transition-all duration-200 disabled:opacity-50"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-800">
                      Password
                    </label>
                    <a href="#" className="text-sm text-gray-800 hover:text-black font-medium underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      ref={passwordRef}
                      type="password"
                      required
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 focus:bg-white transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 rounded-xl font-semibold hover:from-black hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />}
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-semibold text-gray-900 hover:text-black underline">
                    Create account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;