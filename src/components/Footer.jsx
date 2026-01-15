'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  // --- 1. Check Login Status & Fetch Email ---
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        // Assuming your session object has { user: { email: '...' } }
        if (session && session.user && session.user.email) {
          setIsLoggedIn(true);
          setEmail(session.user.email);
        }
      } catch (error) {
        console.log("Not logged in");
      }
    }
    checkSession();
  }, []);

  // --- 2. Handle Subscription ---
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(!email) return;
    
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully!');
        if(!isLoggedIn) setEmail(''); // Clear if it was manual entry
      } else {
        setStatus('error');
        setMessage(data.message || data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Try again.');
    }

    // Reset status after 3 seconds
    setTimeout(() => {
        setStatus('idle');
        setMessage('');
    }, 3000);
  };

  return (
    <footer className="bg-gray-950 text-white border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-bold tracking-tighter flex items-center gap-2">
               <span className="text-green-400">Kisaan</span>Connect
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering the Indian agriculture ecosystem with cutting-edge technology. Connecting Arthiyas and Farmers for a transparent, digital future.
            </p>
            {/* <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -5, color: '#4ade80' }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all border border-white/5"
                >
                  <Icon />
                </motion.a>
              ))}
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-green-500 pl-3">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', link: '/' },
                { name: 'About Us', link: '/about' },
                { name: 'Our Services', link: '/services' },
                { name: 'Latest News', link: '/blog' },
                { name: 'Contact Support', link: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.link} className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-green-500 pl-3">Get in Touch</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-green-500" />
                <span>Punjab, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-500" />
                <span>+91 8869006197</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-500" />
                <span>field2factory@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter - FUNCTIONAL */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-green-500 pl-3">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to get daily market rates and updates.</p>
            
            <form onSubmit={handleSubscribe} className="space-y-3 relative">
              <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggedIn || status === 'loading'} // Auto-filled & disabled if logged in
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white ${isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                    required
                  />
                  {/* Status Indicator inside input */}
                  {status === 'success' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                          <FaCheckCircle />
                      </div>
                  )}
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                disabled={status === 'loading' || status === 'success'}
                className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2
                    ${status === 'success' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-green-600 hover:bg-green-500 text-white'}`}
              >
                {status === 'loading' ? <FaSpinner className="animate-spin" /> : status === 'success' ? 'Subscribed' : 'Subscribe'}
              </motion.button>

              {/* Feedback Message */}
              <AnimatePresence>
                {message && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }}
                        className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}
                    >
                        {message}
                    </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Kisaan Connect Pvt Ltd. All rights reserved.
          </p>
          {/* <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-green-400 transition-colors">Cookie Policy</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}