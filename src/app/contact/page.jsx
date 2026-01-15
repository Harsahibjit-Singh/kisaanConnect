'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1596484552993-8b8393b4a204?q=80&w=2070&auto=format&fit=crop" 
          alt="Contact Support" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Have a question about the platform? Need help with your account? We're here 24/7.
          </motion.p>
        </div>
      </section>

      {/* 2. CONTACT CONTENT */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* LEFT: Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-400 mb-8">
                Reach out to our dedicated support team directly or visit our headquarters.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: FaPhoneAlt, title: "Phone", text: "+91 8869006197" },
                  { icon: FaEnvelope, title: "Email", text: "field2factory@gmail.com" },
                  { icon: FaMapMarkerAlt, title: "HQ Address", text: "Punjab, India" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl shrink-0">
                      <item.icon />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-gray-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Map (Styled) */}
            <div className="rounded-3xl overflow-hidden border border-white/10 h-64 shadow-2xl grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0570221360156!2d76.79782847551067!3d30.716912974591965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fece364023719%3A0xc3f60b64c7849c36!2sGrain%20Market%2C%20Sector%2026%2C%20Chandigarh%2C%20160019!5e0!3m2!1sen!2sin!4v1709664580000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* RIGHT: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
             {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-3xl font-bold mb-8 relative z-10">Send a Message</h2>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-500/20 border border-green-500 text-green-400 p-8 rounded-2xl text-center"
              >
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p>We have sent a confirmation email</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 bg-green-500 text-black px-6 py-2 rounded-full font-bold hover:bg-green-400"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Your Name</label>
                    <input 
                      type="text" name="name" required 
                      value={formData.name} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                      placeholder="Manik Pathria"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Phone Number</label>
                    <input 
                      type="tel" name="phone" 
                      value={formData.phone} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                      placeholder="+91 98..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Email Address</label>
                  <input 
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                    placeholder="vanshdhama@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Subject</label>
                  <select 
                    name="subject" required
                    value={formData.subject} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Message</label>
                  <textarea 
                    name="message" rows="5" required
                    value={formData.message} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <><FaSpinner className="animate-spin" /> Sending...</>
                  ) : (
                    <><FaPaperPlane /> Send Message</>
                  )}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}