import React, { useRef, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Signup = () => {
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const termsRef = useRef(null);
  
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();
  
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const termsAccepted = termsRef.current.checked;

    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords don't match!");
      return;
    }

    if (!termsAccepted) {
      setLocalError("Please accept the terms and conditions");
      return;
    }

    try {
await signup({ username: fullName, email, password });
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Signup</h2>
                <p className="text-gray-600">Create your account to access our services</p>
              </div>
              {(error || localError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error || localError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        ref={fullNameRef}
                        type="text"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 focus:bg-white transition-all duration-200 disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

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
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Password
                    </label>
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
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        ref={confirmPasswordRef}
                        type="password"
                        required
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 focus:bg-white transition-all duration-200 disabled:opacity-50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      ref={termsRef}
                      id="terms"
                      type="checkbox"
                      required
                      disabled={isLoading}
                      className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 rounded-xl font-semibold hover:from-black hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <a href="/signin" className="font-semibold text-gray-900 hover:text-black underline">
                    Sign in
                  </a>
                </p>
              </div>
            </div>

            <div className="md:w-1/3 bg-gradient-to-b from-gray-900 to-black p-8 flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaLock className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-4">Secure & Private</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Your data is protected with enterprise-grade security
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>GDPR compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>24/7 Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;