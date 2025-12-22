// pages/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from '../utils/axiosInstance.js'; 

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const { verifyEmailCode, signupComplete, isLoading, error, clearError } = useAuthStore();

  // Check token on load (keep this axios call as it's just fetching status)
  useEffect(() => {
    if (!token) {
      navigate('/signup');
      return;
    }
    
    checkTokenStatus();
  }, [token]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const checkTokenStatus = async () => {
    try {
      const response = await axios.get(`/auth/signup/status/${token}`);
      if (response.data.success) {
        setMaskedEmail(response.data.maskedEmail);
        
        if (response.data.status === 'verified') {
          setStep(2);
        }
      }
    } catch (err) {
      navigate('/signup');
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
    
    if (newCode.every(digit => digit) && newCode.length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleVerifyCode = async (fullCode = null) => {
    const verificationCode = fullCode || code.join('');
    
    if (verificationCode.length !== 6) {
      clearError();
      return;
    }
    
    clearError();
    
    try {
      const response = await verifyEmailCode(token, verificationCode);
      
      if (response.success) {
        setMaskedEmail(response.maskedEmail);
        setStep(2);
      }
    } catch (err) {
      setCode(['', '', '', '', '', '']);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    clearError();
    
    try {
      await axios.post('/auth/signup/resend', { token });
      setResendTimer(60);
    } catch (err) {
      // Handle error
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      clearError();
      return;
    }
    
    if (password.length < 8) {
      clearError();
      return;
    }
    
    clearError();
    
    try {
      const response = await signupComplete(token, password);
      
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      // Error is already handled in store
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Step 1: Enter Code */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Verify Email</h2>
            <p className="text-gray-600 mb-6">
              Enter code sent to {maskedEmail || 'your email'}
            </p>
            
            <div className="flex justify-between mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={code[index]}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {error && (
              <div className={`p-3 rounded mb-4 ${error.includes('sent') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}
            
            <button
              onClick={() => handleVerifyCode()}
              disabled={isLoading || code.some(digit => !digit)}
              className="w-full bg-black text-white p-3 rounded-lg mb-4 hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive code?{' '}
                <button
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                </button>
              </p>
            </div>
          </div>
        )}
        
        {/* Step 2: Set Password */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-gray-600">
                Set password for {maskedEmail}
              </p>
            </div>
            
            <form onSubmit={handleSetPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-gray-600 hover:text-black"
          >
            ← Use different email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;