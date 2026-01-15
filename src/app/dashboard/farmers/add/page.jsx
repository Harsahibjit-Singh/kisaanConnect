'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaUniversity, 
  FaCheckCircle, FaSpinner, FaArrowLeft, FaExclamationCircle, FaInfoCircle 
} from 'react-icons/fa';
import Link from 'next/link';

// --- Reusable Input Component ---
const InputGroup = ({ label, name, type = "text", icon: Icon, placeholder, required = false, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors z-10">
        <Icon />
      </div>
      <input 
        type={type} 
        name={name} 
        required={required}
        value={value}
        onChange={onChange}
        className="w-full bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 focus:bg-black focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all placeholder:text-gray-700 font-medium"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function AddFarmer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', fatherName: '', phone: '', email: '',
    address: '', aadhar: '', accountNo: '', ifscCode: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle | loading | success
  
  // --- TOAST STATE ---
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Success Modal will appear, then redirect
        setTimeout(() => router.push('/dashboard/farmers'), 2000);
      } else {
        setStatus('idle');
        // Use Styled Toast for Error
        showNotification(data.error || 'Failed to register farmer', 'error');
      }
    } catch (error) {
      setStatus('idle');
      showNotification('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center">
      
      {/* --- TOAST NOTIFICATION (Styled like LoanDetails) --- */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl border ${
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

      {/* --- SUCCESS MODAL DIALOG --- */}
      <AnimatePresence>
        {status === 'success' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-green-500/30 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1, rotate: 360 }} 
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl text-black mb-6 mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]"
              >
                <FaCheckCircle />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Farmer Registered!</h2>
              <p className="text-gray-400 text-sm mb-6">Account created successfully. Redirecting...</p>
              
              <div className="flex justify-center">
                 <FaSpinner className="animate-spin text-green-500" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/farmers">
            <button className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <FaArrowLeft />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Register New Farmer</h1>
            <p className="text-gray-500">Add details to your digital ledger.</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[600px]">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
            
            {/* Column 1: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="text-lg font-bold text-white">Personal Details</h3>
              </div>
              
              <InputGroup label="Full Name" name="name" icon={FaUser} placeholder="e.g. Ram Singh" required value={formData.name} onChange={handleChange} />
              <InputGroup label="Father's Name" name="fatherName" icon={FaUser} placeholder="e.g. Sham Singh" required value={formData.fatherName} onChange={handleChange} />
              <InputGroup label="Phone Number" name="phone" type="tel" icon={FaPhone} placeholder="10-digit mobile number" required value={formData.phone} onChange={handleChange} />
              <InputGroup label="Email" name="email" type="email" icon={FaUser} placeholder="farmer@gmail.com" value={formData.email} onChange={handleChange} />
            </div>

            {/* Column 2: Financial Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-lg font-bold text-white">Financial & Address</h3>
              </div>

              <InputGroup label="Aadhaar Number" name="aadhar" icon={FaIdCard} placeholder="12-digit Aadhaar" required value={formData.aadhar} onChange={handleChange} />
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Bank Account" name="accountNo" icon={FaUniversity} placeholder="Account No" value={formData.accountNo} onChange={handleChange} />
                <InputGroup label="IFSC Code" name="ifscCode" icon={FaUniversity} placeholder="SBIN000..." value={formData.ifscCode} onChange={handleChange} />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Address <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-green-500 z-10">
                    <FaMapMarkerAlt />
                  </div>
                  <textarea 
                    name="address" 
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-[#151515] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 focus:bg-black focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all placeholder:text-gray-700 resize-none font-medium"
                    placeholder="Village, Tehsil, District..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="md:col-span-2 pt-8 mt-4 border-t border-white/5 flex justify-end gap-4">
              <Link href="/dashboard/farmers">
                <button 
                  type="button"
                  className="px-8 py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? <><FaSpinner className="animate-spin" /> Saving...</> : 'Save Farmer Details'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}