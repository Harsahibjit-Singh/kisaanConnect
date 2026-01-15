'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaCheckCircle, 
  FaExclamationCircle, FaSpinner, FaSave, FaShieldAlt, FaCalendarAlt
} from 'react-icons/fa';

export default function MyProfile() {
  const router = useRouter();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('personal'); // personal | security
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Real DB Data State
  const [user, setUser] = useState({
    name: '',
    email: '',
    joinedDate: ''
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  // --- HELPER: Notification ---
  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        
        if (res.status === 401) {
            router.push('/login'); 
            return;
        }
        
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        
        setUser({
          name: data.name || '',
          email: data.email || '',
          joinedDate: data.createdAt || new Date().toISOString(),
        });
      } catch (error) {
        showNotification('Failed to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  // --- 2. UPDATE NAME ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: user.name }) // Only updating Name
        });

        if (res.ok) {
            showNotification('Name updated successfully!');
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        showNotification('Failed to update', 'error');
    } finally {
        setIsSaving(false);
    }
  };

  // --- 3. UPDATE PASSWORD (Placeholder logic if you haven't built that API endpoint yet) ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showNotification("New passwords don't match", "error");
      return;
    }
    // Note: You would need a separate /api/change-password route for this logic
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API
    setIsSaving(false);
    setPasswords({ current: '', new: '', confirm: '' });
    showNotification('Password update logic required in backend');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8">
      
      {/* Toast Notification */}
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

      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              My Profile
            </h1>
            <p className="text-gray-400 mt-2">Manage your account details.</p>
          </div>
          <button 
            onClick={() => router.push('/api/auth/signout')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition-all font-bold text-sm"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: PROFILE SUMMARY --- */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl"
            >
              {/* Avatar Circle */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-700 p-1">
                  <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                    <span className="text-5xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <FaShieldAlt /> Arthiya
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaEnvelope className="text-gray-500" /> {user.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaCalendarAlt className="text-gray-500" /> Member Since: {new Date(user.joinedDate).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: TABS --- */}
          <div className="lg:col-span-2">
            
            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'personal', label: 'Personal Details', icon: FaUser },
                { id: 'security', label: 'Security', icon: FaLock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-black shadow-lg' 
                      : 'bg-[#0A0A0A] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                  }`}
                >
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 min-h-[400px]">
              
              {/* --- TAB 1: PERSONAL DETAILS --- */}
              {activeTab === 'personal' && (
                <motion.form 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSaveProfile} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                    <input 
                      name="name"
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                    <input 
                      name="email"
                      value={user.email} 
                      readOnly
                      className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-600 pl-1">Email cannot be changed directly.</p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
                    >
                      {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                    </button>
                  </div>
                </motion.form>
              )}

              {/* --- TAB 2: SECURITY --- */}
              {activeTab === 'security' && (
                <motion.form 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePasswordUpdate}
                  className="space-y-6 max-w-md"
                >
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6 flex gap-3">
                    <FaShieldAlt className="text-blue-500 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-blue-500 font-bold text-sm">Update Password</h4>
                      <p className="text-gray-400 text-xs mt-1">Ensure your account stays secure with a strong password.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
                    <input 
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                    <input 
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
                    <input 
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      {isSaving ? <FaSpinner className="animate-spin" /> : 'Update Password'}
                    </button>
                  </div>
                </motion.form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}