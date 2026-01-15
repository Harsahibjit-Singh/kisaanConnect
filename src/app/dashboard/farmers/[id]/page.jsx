'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, 
  FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, 
  FaFileInvoiceDollar, FaExclamationTriangle, FaUniversity, FaIdCard, 
  FaCheckCircle, FaInfoCircle 
} from 'react-icons/fa';

export default function FarmerProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modals & Toast State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  const [farmer, setFarmer] = useState(null);
  const [formData, setFormData] = useState({});
  const [sales, setSales] = useState([]);
  const [loans, setLoans] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({ totalRevenue: 0, totalDebt: 0, pendingLoans: 0 });

  // --- HELPER: Notification Toast ---
  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- 1. FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        const farmerRes = await fetch(`/api/farmers/${id}`);
        if (!farmerRes.ok) throw new Error("Farmer not found");
        const farmerData = await farmerRes.json();
        setFarmer(farmerData);
        setFormData(farmerData); 

        const [salesRes, loansRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/loans')
        ]);

        const allSales = await salesRes.json();
        const allLoans = await loansRes.json();

        // Filter Data
        const farmerSales = allSales.filter(s => 
            (typeof s.farmerId === 'object' ? s.farmerId._id : s.farmerId) === id
        );
        
        const farmerLoans = allLoans.filter(l => 
            (typeof l.farmerId === 'object' ? l.farmerId._id : l.farmerId) === id
        );

        const sortedLoans = farmerLoans.sort((a, b) => {
           if (a.status === 'Pending' && b.status !== 'Pending') return -1;
           if (a.status !== 'Pending' && b.status === 'Pending') return 1;
           return new Date(b.date) - new Date(a.date);
        });

        setSales(farmerSales);
        setLoans(sortedLoans);

        const revenue = farmerSales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const activeLoans = farmerLoans.filter(l => (l.status || 'Pending') === 'Pending');
        const debt = activeLoans.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        
        setStats({
          totalRevenue: revenue,
          totalDebt: debt,
          pendingLoans: activeLoans.length
        });

      } catch (error) {
        console.error("Error loading profile:", error);
        showNotification("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // --- 2. ACTIONS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/farmers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");
      
      const updatedFarmer = await res.json();
      setFarmer(updatedFarmer);
      setIsEditing(false);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Error updating profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(farmer);
    setIsEditing(false);
  };

  // Trigger Modal
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Actual Delete Logic
  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/farmers/${id}`, { method: 'DELETE' });
      if(res.ok) {
        showNotification("Farmer profile deleted", "success");
        setTimeout(() => router.push('/dashboard/farmers'), 1500);
      }
    } catch (err) {
      showNotification("Failed to delete profile", "error");
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black pt-20">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  if (!farmer) return <div className="p-20 text-white text-center">Farmer not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center items-start">
      
      {/* --- TOAST NOTIFICATION --- */}
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
              {showToast.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2 text-white">Delete Farmer?</h3>
                <p className="text-gray-400 text-sm mb-6">This will permanently delete the farmer profile and unlink related records. This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={executeDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex justify-center items-center gap-2 font-bold transition-colors">
                        <FaTrash /> Confirm Delete
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/farmers">
            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <FaArrowLeft />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? "Edit Profile" : "Farmer Profile"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COL: PROFILE CARD (EDITABLE) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className={`bg-[#0A0A0A] border ${isEditing ? 'border-green-500/50' : 'border-white/10'} rounded-[2rem] p-8 shadow-xl text-center relative overflow-hidden transition-all duration-300`}>
              
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-900 rounded-2xl mx-auto flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-lg border border-white/10">
                {formData.name?.charAt(0) || "U"}
              </div>

              {/* --- FORM FIELDS --- */}
              <div className="space-y-4 text-left">
                
                {/* Name */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold ml-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{farmer.name}</h2>
                  )}
                </div>

                {/* Father Name */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold ml-1">S/o (Father's Name)</label>
                  {isEditing ? (
                    <input 
                      name="fatherName" 
                      value={formData.fatherName} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  ) : (
                    <p className="text-gray-400 text-sm">S/o {farmer.fatherName || 'Unknown'}</p>
                  )}
                </div>

                <div className="border-t border-white/10 my-4"></div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center"><FaPhone className="text-green-500" /></div>
                  <div className="flex-1">
                    {isEditing ? (
                       <input 
                         name="phone" 
                         value={formData.phone} 
                         onChange={handleInputChange} 
                         placeholder="Phone Number"
                         className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 mt-1 focus:border-green-500 focus:outline-none transition-colors text-sm"
                       />
                    ) : (
                       <span className="font-mono text-sm text-gray-300">{farmer.phone}</span>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center"><FaMapMarkerAlt className="text-blue-500" /></div>
                  <div className="flex-1">
                    {isEditing ? (
                       <input 
                         name="address" 
                         value={formData.address} 
                         onChange={handleInputChange} 
                         placeholder="Address"
                         className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 mt-1 focus:border-green-500 focus:outline-none transition-colors text-sm"
                       />
                    ) : (
                       <span className="text-sm text-gray-300">{farmer.address}</span>
                    )}
                  </div>
                </div>

                {/* Aadhar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center"><FaIdCard className="text-purple-500" /></div>
                  <div className="flex-1">
                    {isEditing ? (
                       <input 
                         name="aadhar" 
                         value={formData.aadhar} 
                         onChange={handleInputChange} 
                         placeholder="Aadhar Number"
                         className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 mt-1 focus:border-green-500 focus:outline-none transition-colors text-sm"
                       />
                    ) : (
                       <span className="font-mono text-sm text-gray-300">{farmer.aadhar}</span>
                    )}
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-[#111] p-3 rounded-xl border border-white/5 space-y-2 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUniversity className="text-amber-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Bank Details</span>
                    </div>
                    
                    {isEditing ? (
                        <>
                            <input 
                                name="accountNo" 
                                value={formData.accountNo || ''} 
                                onChange={handleInputChange} 
                                placeholder="Account Number"
                                className="w-full bg-[#1a1a1a] text-white border border-white/10 rounded-lg p-2 text-xs focus:border-green-500 focus:outline-none mb-2"
                            />
                            <input 
                                name="ifscCode" 
                                value={formData.ifscCode || ''} 
                                onChange={handleInputChange} 
                                placeholder="IFSC Code"
                                className="w-full bg-[#1a1a1a] text-white border border-white/10 rounded-lg p-2 text-xs focus:border-green-500 focus:outline-none"
                            />
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-[10px] text-gray-500">Account No</p>
                                <p className="text-xs font-mono text-white">{farmer.accountNo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">IFSC</p>
                                <p className="text-xs font-mono text-white">{farmer.ifscCode || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

              </div>

              {/* --- ACTION BUTTONS --- */}
              <div className="flex gap-3 mt-8">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
                    >
                       {saving ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save</>}
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 border border-red-500/20 hover:border-transparent"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 p-6 rounded-[2rem] shadow-lg">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Financial Overview</h3>
               <div className="flex justify-between items-center mb-3">
                 <span className="text-gray-400 text-sm">Total Revenue</span>
                 <span className="text-green-400 font-bold font-mono">₹ {stats.totalRevenue.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-400 text-sm">Active Debt</span>
                 <span className="text-red-400 font-bold font-mono">₹ {stats.totalDebt.toLocaleString()}</span>
               </div>
               <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden flex">
                 <div className="h-full bg-green-500" style={{ width: `${stats.totalRevenue > 0 ? 70 : 0}%` }}></div>
                 <div className="h-full bg-red-500" style={{ width: `${stats.totalDebt > 0 ? 30 : 0}%` }}></div>
               </div>
            </div>
          </motion.div>

          {/* --- RIGHT COL: LOANS & SALES --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            
            {/* 1. LOAN HISTORY (Active & Paid) */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaFileInvoiceDollar className="text-yellow-500" /> Loan History
                </h3>
                {stats.pendingLoans > 0 && (
                  <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-500/20">
                    <FaExclamationTriangle /> {stats.pendingLoans} Pending
                  </span>
                )}
              </div>

              {loans.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {loans.map(loan => (
                    <Link key={loan._id} href={`/dashboard/loans/${loan._id}`}>
                      <div className="group flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10 gap-4">
                        
                        {/* Left: Amount & Date */}
                        <div>
                          <p className="font-bold text-white font-mono text-lg">₹ {loan.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                             <span>{new Date(loan.date).toLocaleDateString()}</span>
                             <span>•</span>
                             <span>ID: {loan._id.slice(-6)}</span>
                          </div>
                        </div>

                        {/* Right: Status Tag */}
                        <div className="text-right">
                          {(loan.status === 'Paid') ? (
                             <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border text-green-400 bg-green-500/10 border-green-500/20">
                                <FaCheckCircle /> Paid
                             </span>
                          ) : (
                             <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
                                <FaExclamationTriangle /> Pending
                             </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-gray-500 text-sm">No loan history found for this farmer.</p>
                </div>
              )}
            </div>

            {/* 2. SALES HISTORY */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <FaFileInvoiceDollar className="text-green-500" /> Sales History
              </h3>

              {sales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/5 text-xs uppercase tracking-wider">
                        <th className="pb-4 pl-4 font-semibold">Date</th>
                        <th className="pb-4 font-semibold">Crop</th>
                        <th className="pb-4 font-semibold">Qty</th>
                        <th className="pb-4 text-right pr-4 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sales.map(sale => (
                        <tr key={sale._id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4 text-gray-400">{new Date(sale.date).toLocaleDateString()}</td>
                          <td className="py-4 font-bold text-white">{sale.cropType}</td>
                          <td className="py-4 text-gray-400">{sale.quantity} Qt</td>
                          <td className="py-4 text-right pr-4 text-green-400 font-bold font-mono">₹ {sale.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-gray-500 text-sm">No sales records found.</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}