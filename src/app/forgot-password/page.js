'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaArrowLeft, FaPaperPlane, FaSpinner, 
  FaCheckCircle, FaExclamationCircle, FaLock 
} from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  
  // --- TOAST STATE ---
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email) return;
    
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        showNotification(data.error || 'Failed to send reset email', 'error');
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

      {/* --- TOAST NOTIFICATION --- */}
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
        {/* --- STATE: SUCCESS --- */}
        {status === 'success' ? (
          <div className="text-center py-8">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            >
              <FaCheckCircle />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your mail</h2>
            <p className="text-gray-400 mb-8">
              We have sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
            <Link href="/login">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all">
                Back to Login
              </button>
            </Link>
            <button 
              onClick={() => setStatus('idle')} 
              className="mt-4 text-sm text-gray-500 hover:text-green-400 transition-colors"
            >
              Didn't receive it? Try again
            </button>
          </div>
        ) : (
          /* --- STATE: FORM --- */
          <>
            <div className="mb-8">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6">
                <FaArrowLeft /> Back to Login
              </Link>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 text-xl mb-4 border border-green-500/20">
                <FaLock />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-400">
                Don't worry! It happens. Please enter the email associated with your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <FaEnvelope />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 focus:bg-black transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <><FaSpinner className="animate-spin" /> Sending...</>
                ) : (
                  <><FaPaperPlane /> Send Reset Link</>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}