'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaSpinner, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

export default function Register() {
  const router = useRouter();
  const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus('loading');

    try {
      // 2. Call Register API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Registration failed");
      }

      // 3. Success State
      setStatus('success');
      
      // Optional: Auto-login or redirect after delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      setStatus('error');
      setErrorMsg(error.message);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-950">
      
      {/* 1. LEFT SIDE - CINEMATIC VISUAL (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        
        {/* Slow Zoom Animation - Harvest Theme */}
        <motion.img 
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1605000797499-95a059e00b28?q=80&w=2072&auto=format&fit=crop" 
          alt="Golden Wheat Fields" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-6">
              <span className="text-green-500">Kisaan</span>Connect
            </Link>

            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Grow Your Business <br/>
              <span className="text-green-500">With Technology.</span>
            </h2>
            <p className="text-gray-200 text-xl leading-relaxed border-l-4 border-green-500 pl-6">
              Create your digital mandi account today and start managing farmers, sales, and loans in one place.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. RIGHT SIDE - REGISTER FORM */}
      {/* FIX APPLIED HERE: Changed lg:pt-0 to lg:pt-20 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 pt-24 lg:pt-20 lg:pl-16 xl:pl-24 relative bg-[#050505]">
        
        {/* Background Decor */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md z-10"
        >
          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            {/* Mobile Logo (Hidden on Desktop) */}
            <Link href="/" className="inline-block lg:hidden text-2xl font-bold tracking-tighter mb-2">
              <span className="text-green-500">Kisaan</span>Connect
            </Link>
            
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join the digital revolution.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-2xl relative overflow-hidden">
            
            {status === 'success' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg shadow-green-500/40">
                  <FaCheckCircle />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                <p className="text-gray-400">Redirecting you to login...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                    <input 
                      type="text" name="name" required 
                      value={data.name} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                      placeholder="Arthiya Name / Firm Name"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                    <input 
                      type="email" name="email" required 
                      value={data.email} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                    <input 
                      type="password" name="password" required 
                      value={data.password} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                      placeholder="Create a strong password"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                    <input 
                      type="password" name="confirmPassword" required 
                      value={data.confirmPassword} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? <FaSpinner className="animate-spin" /> : 'Create Account'}
                  {status !== 'loading' && <FaArrowRight className="text-sm" />}
                </motion.button>
              </form>
            )}

            {!status.includes('success') && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
                >
                  <FaGoogle className="text-red-500" />
                  Sign up with Google
                </button>
              </>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-center lg:text-left text-gray-400 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}