import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaKey, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('code'); // 'code' or 'password'
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  // Check if token is valid on load
  useEffect(() => {
    const storedToken = localStorage.getItem('resetToken');
    if (!token && storedToken) {
      navigate(`/reset-password/${storedToken}`);
    }
  }, [token, navigate]);

  // Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(
        `/auth/verify-reset-code/${token}`,
        { code }
      );

      if (response.data.success) {
        setEmail(response.data.email);
        setVerified(true);
        setStep('password');
        // Remove stored token since we're using URL token now
        localStorage.removeItem('resetToken');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      if (response.data.success) {
        // Show success state
        setStep('success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignin = () => {
    navigate('/signin', {
      state: { message: 'Password reset successful! Please sign in.' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <Link to="/signin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Sign In
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'success' ? 'Password Reset!' : 'Reset Password'}
          </h1>
          
          <p className="text-gray-600">
            {step === 'code' && 'Enter the 6-digit code sent to your email'}
            {step === 'password' && `Enter new password for ${email}`}
            {step === 'success' && 'Your password has been reset successfully'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Set!</h3>
            <p className="text-gray-600 mb-6">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={handleBackToSignin}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        ) : step === 'code' ? (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the code sent to your email address
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step !== 'success' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Didn't receive a code?{' '}
              <button
                onClick={() => navigate('/forgot-password')}
                className="font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Request a new one
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;