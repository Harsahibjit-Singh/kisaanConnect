'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaSpinner, FaArrowRight } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        setStatus('error');
        setErrorMsg('Invalid email or password.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-950">
      
      {/* 1. LEFT SIDE - IMAGE + WELCOME TEXT (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        
        {/* Background Image */}
        <motion.img 
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2071&auto=format&fit=crop" 
          alt="Indian Mandi" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* --- MOVED TEXT HERE (Visible on Desktop) --- */}
        <div className="relative z-20 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-6">
              <span className="text-green-500">Kisaan</span>Connect
            </Link>
            
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Welcome Back!
            </h1>
            <p className="text-gray-200 text-xl leading-relaxed">
              Please sign in to your dashboard to manage your sales, farmers, and loans.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. RIGHT SIDE - FORM ONLY */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 pt-24 lg:pt-0 relative bg-[#050505]">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto z-10"
        >
          
          {/* --- MOBILE ONLY HEADER (Hidden on Desktop) --- */}
          <div className="text-center mb-10 lg:hidden">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tighter mb-2">
              <span className="text-green-500">Kisaan</span>Connect
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-400">Please sign in to your dashboard.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={data.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <Link href="/forgot-password">
                    <span className="text-xs text-green-400 hover:text-green-300 cursor-pointer">Forgot Password?</span>
                  </Link>
                </div>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={data.password}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {status === 'error' && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
                >
                  {errorMsg}
                </motion.p>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <FaSpinner className="animate-spin" /> : 'Sign In'}
                {status !== 'loading' && <FaArrowRight className="text-sm" />}
              </motion.button>

            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <FaGoogle className="text-red-500" />
              Sign in with Google
            </button>
          </div>

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-400 font-bold hover:underline">
              Register now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}