'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // CHANGE: Use useParams
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLock, FaCheckCircle, FaExclamationCircle, FaSpinner, FaEye, FaEyeSlash 
} from 'react-icons/fa';

export default function ResetPassword() {
  const params = useParams(); // Get parameters from URL path
  const router = useRouter();
  
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  // --- 1. CAPTURE TOKEN ON MOUNT ---
  useEffect(() => {
    // In Next.js dynamic routes ([id]), the value is in params.id
    // We check for params.id OR params.token just in case you rename the folder later
    const urlToken = params?.id || params?.token;
    
    if (urlToken) {
        console.log("Token captured from URL Path:", urlToken);
        setToken(urlToken);
    } else {
        console.error("No token found in URL path params:", params);
    }
  }, [params]);

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- SAFETY CHECK ---
    if (!token) {
        showNotification("Error: Invalid Link (Missing Token)", "error");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    
    if (formData.password.length < 6) {
        showNotification("Password must be at least 6 characters", "error");
        return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            token: token, 
            password: formData.password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        showNotification(data.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      setStatus('idle');
      showNotification('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl border ${
              showToast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {showToast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-2xl"
      >
        {status === 'success' ? (
          <div className="text-center py-8">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            >
              <FaCheckCircle />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-gray-400 mb-8">
              Your password has been updated successfully.
            </p>
            <Link href="/login">
              <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-green-900/20">
                Continue to Login
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto border border-white/10">
                <FaLock />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
              <p className="text-gray-400 text-sm">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Min 6 characters"
                    className="w-full bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-white focus:outline-none focus:border-green-500 focus:bg-black transition-all placeholder:text-gray-600"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
                <input 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  placeholder="Re-enter password"
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-4 pr-4 text-white focus:outline-none focus:border-green-500 focus:bg-black transition-all placeholder:text-gray-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {status === 'loading' ? (
                  <><FaSpinner className="animate-spin" /> Updating...</>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}