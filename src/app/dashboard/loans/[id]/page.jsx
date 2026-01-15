// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { 
//   FaArrowLeft, FaUser, FaCalendarAlt, FaRupeeSign, FaPercent, 
//   FaCheckCircle, FaTrash, FaSpinner, FaClock, FaMoneyBillWave 
// } from 'react-icons/fa';

// export default function LoanDetails() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [loan, setLoan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [interestData, setInterestData] = useState({ months: 0, interest: 0, total: 0 });

//   // --- 1. FETCH LOAN DATA ---
//   useEffect(() => {
//     async function fetchLoanDetails() {
//       try {
//         const res = await fetch(`/api/loans/${id}`);
//         if (!res.ok) throw new Error("Loan not found");
//         const data = await res.json();
//         setLoan(data);
//         calculateInterest(data);
//       } catch (error) {
//         console.error(error);
//         // router.push('/dashboard/loans'); // Redirect if not found
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchLoanDetails();
//   }, [id, router]);

//   // --- 2. CALCULATE INTEREST LOGIC ---
//   const calculateInterest = (data) => {
//     if (!data) return;

//     const startDate = new Date(data.date);
//     const today = new Date();
    
//     // Calculate difference in months
//     const diffTime = Math.abs(today - startDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     const diffMonths = (diffDays / 30).toFixed(1); // Approx months

//     // Simple Interest Formula: P * R * T (Time in months) / 100
//     const p = data.amount;
//     const r = data.interestRate;
//     const interest = Math.round((p * r * diffMonths) / 100);
//     const total = p + interest;

//     setInterestData({
//       days: diffDays,
//       months: diffMonths,
//       interest: interest,
//       total: total
//     });
//   };

//   // --- 3. ACTIONS (Mark Paid / Delete) ---
//   const handleStatusUpdate = async (newStatus) => {
//     if (!confirm(`Are you sure you want to mark this loan as ${newStatus}?`)) return;
//     setActionLoading(true);

//     try {
//       const res = await fetch(`/api/loans/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         setLoan(prev => ({ ...prev, status: newStatus }));
//         router.refresh();
//       }
//     } catch (error) {
//       alert("Failed to update status");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("CRITICAL WARNING: This will permanently delete this financial record. Continue?")) return;
//     setActionLoading(true);

//     try {
//       const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         router.push('/dashboard/loans');
//       }
//     } catch (error) {
//       alert("Failed to delete loan");
//       setActionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-black pt-20">
//         <FaSpinner className="animate-spin text-4xl text-green-500" />
//       </div>
//     );
//   }

//   if (!loan) return null;

//   return (
//     <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center items-start">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-4xl"
//       >
        
//         {/* --- HEADER --- */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard/loans">
//               <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
//                 <FaArrowLeft />
//               </button>
//             </Link>
//             <div>
//               <div className="flex items-center gap-3">
//                 <h1 className="text-3xl font-bold text-white">Loan Details</h1>
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
//                   loan.status === 'Paid' 
//                     ? 'bg-green-500/10 text-green-400 border-green-500/20' 
//                     : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
//                 }`}>
//                   {loan.status}
//                 </span>
//               </div>
//               <p className="text-gray-400 text-sm mt-1">ID: {loan._id}</p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             {loan.status === 'Pending' && (
//               <button 
//                 onClick={() => handleStatusUpdate('Paid')}
//                 disabled={actionLoading}
//                 className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
//               >
//                 <FaCheckCircle /> Mark as Paid
//               </button>
//             )}
//             <button 
//               onClick={handleDelete}
//               disabled={actionLoading}
//               className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
//             >
//               <FaTrash /> Delete
//             </button>
//           </div>
//         </div>

//         {/* --- CONTENT GRID --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           {/* LEFT: Basic Info */}
//           <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-xl space-y-6">
//              <h2 className="text-xl font-bold text-gray-200 border-b border-white/5 pb-4">Loan Information</h2>
             
//              {/* Farmer */}
//              <div className="flex items-start gap-4">
//                <div className="p-3 bg-gray-800 rounded-lg text-gray-300"><FaUser /></div>
//                <div>
//                  <p className="text-xs text-gray-500 font-bold uppercase">Farmer</p>
//                  <p className="text-lg font-bold text-white">{loan.farmerId?.name || 'Unknown'}</p>
//                  <p className="text-sm text-gray-400">{loan.farmerId?.phone || 'No Contact'}</p>
//                  {loan.farmerId?.address && <p className="text-xs text-gray-500 mt-1">{loan.farmerId.address}</p>}
//                </div>
//              </div>

//              {/* Amount & Date */}
//              <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-start gap-3">
//                    <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><FaRupeeSign /></div>
//                    <div>
//                       <p className="text-xs text-gray-500 font-bold uppercase">Principal</p>
//                       <p className="text-xl font-bold text-white">{loan.amount.toLocaleString()}</p>
//                    </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FaCalendarAlt /></div>
//                    <div>
//                       <p className="text-xs text-gray-500 font-bold uppercase">Date Issued</p>
//                       <p className="text-base font-bold text-white">{new Date(loan.date).toLocaleDateString()}</p>
//                    </div>
//                 </div>
//              </div>

//              {/* Rate */}
//              <div className="flex items-start gap-3">
//                 <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><FaPercent /></div>
//                 <div>
//                    <p className="text-xs text-gray-500 font-bold uppercase">Interest Rate</p>
//                    <p className="text-base font-bold text-white">{loan.interestRate}% per month</p>
//                 </div>
//              </div>

//              {/* Notes */}
//              {loan.notes && (
//                <div className="bg-white/5 p-4 rounded-xl mt-4">
//                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Notes</p>
//                  <p className="text-sm text-gray-300 italic">"{loan.notes}"</p>
//                </div>
//              )}
//           </div>

//           {/* RIGHT: Interest Calculator */}
//           <div className="flex flex-col gap-6">
            
//             {/* Live Calculation Card */}
//             <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
//                {/* Background Glow */}
//                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full"></div>
               
//                <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
//                  <FaClock className="text-green-500" /> Time Elapsed
//                </h2>

//                <div className="grid grid-cols-2 gap-4 mb-6">
//                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                    <p className="text-3xl font-bold text-white">{interestData.days}</p>
//                    <p className="text-xs text-gray-500 uppercase font-bold">Days Passed</p>
//                  </div>
//                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                    <p className="text-3xl font-bold text-white">{interestData.months}</p>
//                    <p className="text-xs text-gray-500 uppercase font-bold">Approx Months</p>
//                  </div>
//                </div>

//                <div className="space-y-4 border-t border-white/10 pt-6">
//                  <div className="flex justify-between items-center text-gray-400">
//                    <span>Accrued Interest</span>
//                    <span className="font-mono text-green-400">+ ₹ {interestData.interest.toLocaleString()}</span>
//                  </div>
//                  <div className="flex justify-between items-center text-white text-xl font-bold">
//                    <span>Total Repayment</span>
//                    <span className="flex items-center gap-1">
//                      <FaMoneyBillWave className="text-green-500" />
//                      ₹ {interestData.total.toLocaleString()}
//                    </span>
//                  </div>
//                </div>
//             </div>

//             {/* Quick Status Note */}
//             <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
//               <p className="text-sm text-blue-200">
//                 <span className="font-bold">Note:</span> Interest is calculated automatically based on today's date using the Simple Interest formula on a monthly basis.
//               </p>
//             </div>

//           </div>
//         </div>

//       </motion.div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaArrowLeft, FaUser, FaCalendarAlt, FaRupeeSign, FaPercent, 
//   FaCheckCircle, FaTrash, FaSpinner, FaClock, FaMoneyBillWave,
//   FaEdit, FaDownload, FaShare, FaInfoCircle, FaChartLine,
//   FaChevronRight, FaCalendarDay, FaHistory, FaMoneyCheckAlt
// } from 'react-icons/fa';
// import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// export default function LoanDetails() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [loan, setLoan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [interestData, setInterestData] = useState({ months: 0, interest: 0, total: 0 });
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showPaidConfirm, setShowPaidConfirm] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

//   // Show toast notification
//   const showNotification = (message, type = 'success') => {
//     setShowToast({ show: true, message, type });
//     setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
//   };

//   // --- 1. FETCH LOAN DATA ---
//   useEffect(() => {
//     async function fetchLoanDetails() {
//       try {
//         const res = await fetch(`/api/loans/${id}`);
//         if (!res.ok) throw new Error("Loan not found");
//         const data = await res.json();
//         setLoan(data);
//         calculateInterest(data);
//         showNotification('Loan details loaded', 'success');
//       } catch (error) {
//         console.error(error);
//         showNotification('Failed to load loan details', 'error');
//         // router.push('/dashboard/loans');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchLoanDetails();
//   }, [id, router]);

//   // --- 2. CALCULATE INTEREST LOGIC ---
//   const calculateInterest = (data) => {
//     if (!data) return;

//     const startDate = new Date(data.date);
//     const today = new Date();
    
//     const diffTime = Math.abs(today - startDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     const diffMonths = (diffDays / 30).toFixed(1);

//     const p = data.amount;
//     const r = data.interestRate;
//     const interest = Math.round((p * r * diffMonths) / 100);
//     const total = p + interest;

//     setInterestData({
//       days: diffDays,
//       months: diffMonths,
//       interest: interest,
//       total: total
//     });
//   };

//   // --- 3. ACTIONS (Mark Paid / Delete) ---
//   const handleStatusUpdate = async (newStatus) => {
//     setActionLoading(true);

//     try {
//       const res = await fetch(`/api/loans/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         setLoan(prev => ({ ...prev, status: newStatus }));
//         showNotification(`Loan marked as ${newStatus}`, 'success');
//         setShowPaidConfirm(false);
//         router.refresh();
//       }
//     } catch (error) {
//       showNotification('Failed to update status', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setActionLoading(true);

//     try {
//       const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         showNotification('Loan deleted successfully', 'success');
//         setTimeout(() => router.push('/dashboard/loans'), 1500);
//       }
//     } catch (error) {
//       showNotification('Failed to delete loan', 'error');
//       setActionLoading(false);
//     }
//   };

//   // Generate repayment schedule
//   const generateSchedule = () => {
//     if (!loan) return [];
//     const schedule = [];
//     const monthlyInterest = (loan.amount * loan.interestRate) / 100;
    
//     for (let i = 1; i <= 6; i++) {
//       const date = new Date(loan.date);
//       date.setMonth(date.getMonth() + i);
//       schedule.push({
//         month: i,
//         date: date.toLocaleDateString(),
//         interest: monthlyInterest * i,
//         total: loan.amount + (monthlyInterest * i),
//         status: i > interestData.months ? 'Pending' : 'Overdue'
//       });
//     }
//     return schedule;
//   };

//   // Loading Skeleton
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black pt-32 px-4 md:px-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Header Skeleton */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse"></div>
//               <div className="space-y-3">
//                 <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg"></div>
//                 <div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <div className="h-10 w-32 bg-white/5 animate-pulse rounded-xl"></div>
//               <div className="h-10 w-32 bg-white/5 animate-pulse rounded-xl"></div>
//             </div>
//           </div>

//           {/* Content Skeleton */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-96 bg-white/5 animate-pulse rounded-2xl"></div>
//             </div>
//             <div className="space-y-6">
//               <div className="h-48 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-48 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-32 bg-white/5 animate-pulse rounded-2xl"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!loan) return null;

//   const repaymentSchedule = generateSchedule();

//   return (
//     <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-6">
//       {/* Toast Notification */}
//       <AnimatePresence>
//         {showToast.show && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border ${
//               showToast.type === 'success' 
//                 ? 'bg-green-500/10 border-green-500/20 text-green-400' 
//                 : 'bg-red-500/10 border-red-500/20 text-red-400'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               {showToast.type === 'success' ? (
//                 <FaCheckCircle className="text-xl" />
//               ) : (
//                 <FaInfoCircle className="text-xl" />
//               )}
//               <span className="font-medium">{showToast.message}</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Confirmation Modals */}
//       <AnimatePresence>
//         {showDeleteConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDeleteConfirm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-[#0A0A0A] border border-red-500/30 rounded-2xl p-8 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FaTrash className="text-2xl text-red-500" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Delete Loan Record</h3>
//                 <p className="text-gray-400 text-sm">
//                   This action cannot be undone. This will permanently delete the loan record and all associated data.
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={actionLoading}
//                   className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
//                 >
//                   {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
//                   Confirm Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {showPaidConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowPaidConfirm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-[#0A0A0A] border border-green-500/30 rounded-2xl p-8 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FaCheckCircle className="text-2xl text-green-500" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Mark as Paid</h3>
//                 <p className="text-gray-400 text-sm">
//                   This will update the loan status to "Paid". The record will be archived but not deleted.
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowPaidConfirm(false)}
//                   className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleStatusUpdate('Paid')}
//                   disabled={actionLoading}
//                   className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
//                 >
//                   {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
//                   Mark as Paid
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto">
//         {/* --- HEADER --- */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
//         >
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard/loans">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group relative"
//               >
//                 <FaArrowLeft className="group-hover:translate-x-[-2px] transition-transform" />
//                 <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                   Back to Loans
//                 </span>
//               </motion.button>
//             </Link>
//             <div>
//               <div className="flex flex-wrap items-center gap-3 mb-2">
//                 <h1 className="text-3xl font-bold text-white">Loan Details</h1>
//                 <motion.span
//                   key={loan.status}
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${
//                     loan.status === 'Paid' 
//                       ? 'bg-green-500/10 text-green-400 border-green-500/20' 
//                       : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
//                   }`}
//                 >
//                   {loan.status === 'Paid' ? (
//                     <FaCheckCircle className="text-lg" />
//                   ) : (
//                     <FaClock className="text-lg" />
//                   )}
//                   {loan.status}
//                 </motion.span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
//                 <span className="flex items-center gap-2">
//                   <FaCalendarDay />
//                   Created: {new Date(loan.createdAt || loan.date).toLocaleDateString()}
//                 </span>
//                 <span className="hidden md:inline">•</span>
//                 <span className="flex items-center gap-2">
//                   <FaHistory />
//                   Last Updated: {new Date(loan.updatedAt || loan.date).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group"
//             >
//               <FaEdit className="group-hover:rotate-12 transition-transform" />
//               <span className="hidden sm:inline">Edit</span>
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group"
//             >
//               <FaDownload className="group-hover:translate-y-[-1px] transition-transform" />
//               <span className="hidden sm:inline">Export</span>
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group"
//             >
//               <FaShare className="group-hover:scale-110 transition-transform" />
//               <span className="hidden sm:inline">Share</span>
//             </motion.button>

//             {loan.status === 'Pending' && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowPaidConfirm(true)}
//                 disabled={actionLoading}
//                 className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all group"
//               >
//                 {actionLoading ? (
//                   <FaSpinner className="animate-spin" />
//                 ) : (
//                   <FaCheckCircle className="group-hover:scale-110 transition-transform" />
//                 )}
//                 <span>Mark as Paid</span>
//               </motion.button>
//             )}
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={actionLoading}
//               className="px-5 py-2.5 bg-gradient-to-r from-red-600/20 to-red-700/10 hover:from-red-600/30 hover:to-red-700/20 text-red-400 hover:text-red-300 border border-red-600/30 rounded-xl font-bold flex items-center gap-2 transition-all group"
//             >
//               {actionLoading ? (
//                 <FaSpinner className="animate-spin" />
//               ) : (
//                 <FaTrash className="group-hover:scale-110 transition-transform" />
//               )}
//               <span>Delete</span>
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* --- TABS --- */}
//         <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
//           {['overview', 'schedule', 'documents', 'history'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-3 font-medium text-sm uppercase tracking-wider relative ${
//                 activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               {tab}
//               {activeTab === tab && (
//                 <motion.div
//                   layoutId="activeTab"
//                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"
//                 />
//               )}
//             </button>
//           ))}
//         </div>

//         {/* --- CONTENT --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT: Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Quick Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-400 text-sm font-medium">Principal Amount</span>
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <FaRupeeSign className="text-green-400" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">{loan.amount.toLocaleString()}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <FiTrendingUp className="text-green-500" />
//                   <span className="text-xs text-green-400">Original Loan</span>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-400 text-sm font-medium">Accrued Interest</span>
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <FaChartLine className="text-purple-400" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">₹ {interestData.interest.toLocaleString()}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <FiTrendingUp className="text-purple-500" />
//                   <span className="text-xs text-purple-400">{interestData.months} months elapsed</span>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-green-500/20 rounded-2xl p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-200 text-sm font-medium">Total Due</span>
//                   <div className="p-2 bg-green-500/20 rounded-lg">
//                     <FaMoneyCheckAlt className="text-green-400" />
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">₹ {interestData.total.toLocaleString()}</p>
//                 <div className="text-xs text-gray-400 mt-2">Including principal + interest</div>
//               </motion.div>
//             </div>

//             {/* Farmer Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//             >
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/10 rounded-lg">
//                   <FaUser className="text-blue-400" />
//                 </div>
//                 Farmer Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-400 mb-1">Full Name</p>
//                   <p className="text-lg font-semibold text-white">{loan.farmerId?.name || 'Unknown'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400 mb-1">Phone Number</p>
//                   <p className="text-lg font-semibold text-white">{loan.farmerId?.phone || 'N/A'}</p>
//                 </div>
//                 <div className="md:col-span-2">
//                   <p className="text-sm text-gray-400 mb-1">Address</p>
//                   <p className="text-white">{loan.farmerId?.address || 'No address provided'}</p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Repayment Schedule */}
//             {activeTab === 'schedule' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//               >
//                 <h2 className="text-xl font-bold text-white mb-6">Repayment Schedule</h2>
//                 <div className="space-y-4">
//                   {repaymentSchedule.map((item, index) => (
//                     <motion.div
//                       key={item.month}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
//                           <span className="font-bold">M{item.month}</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-white">Month {item.month}</p>
//                           <p className="text-sm text-gray-400">{item.date}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-white">₹ {item.total.toLocaleString()}</p>
//                         <p className="text-sm text-gray-400">Interest: ₹ {item.interest.toLocaleString()}</p>
//                       </div>
//                       <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         item.status === 'Overdue' 
//                           ? 'bg-red-500/10 text-red-400' 
//                           : 'bg-yellow-500/10 text-yellow-400'
//                       }`}>
//                         {item.status}
//                       </div>
//                       <FaChevronRight className="text-gray-400 group-hover:text-white transition-colors" />
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* RIGHT: Sidebar */}
//           <div className="space-y-6">
//             {/* Interest Calculator Card */}
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
//             >
//               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full"></div>
              
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
//                 <div className="p-2 bg-green-500/10 rounded-lg">
//                   <FaClock className="text-green-400" />
//                 </div>
//                 Time Analytics
//               </h2>

//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                     <p className="text-2xl font-bold text-white">{interestData.days}</p>
//                     <p className="text-xs text-gray-400 uppercase font-medium">Days Passed</p>
//                   </div>
//                   <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                     <p className="text-2xl font-bold text-white">{interestData.months}</p>
//                     <p className="text-xs text-gray-400 uppercase font-medium">Approx Months</p>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-4 border-t border-white/10">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-300">Daily Interest</span>
//                     <span className="font-mono text-green-400">
//                       ₹ {((loan.amount * loan.interestRate) / (100 * 30)).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-300">Monthly Interest</span>
//                     <span className="font-mono text-green-400">
//                       ₹ {((loan.amount * loan.interestRate) / 100).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-white/10">
//                     <span className="text-white">Total Due</span>
//                     <span className="text-white flex items-center gap-2">
//                       <FaMoneyBillWave className="text-green-500" />
//                       ₹ {interestData.total.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Loan Terms */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//             >
//               <h3 className="text-lg font-bold text-white mb-4">Loan Terms</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Interest Rate</span>
//                   <span className="text-white font-semibold">{loan.interestRate}% per month</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Start Date</span>
//                   <span className="text-white font-semibold">{new Date(loan.date).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Status</span>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                     loan.status === 'Paid' 
//                       ? 'bg-green-500/10 text-green-400' 
//                       : 'bg-yellow-500/10 text-yellow-500'
//                   }`}>
//                     {loan.status}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Notes */}
//             {loan.notes && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//               >
//                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                   <FaInfoCircle className="text-blue-400" />
//                   Additional Notes
//                 </h3>
//                 <div className="bg-white/5 p-4 rounded-xl">
//                   <p className="text-gray-300 italic">"{loan.notes}"</p>
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaArrowLeft, FaUser, FaRupeeSign, FaCheckCircle, FaTrash, 
//   FaSpinner, FaClock, FaMoneyBillWave, FaEdit, FaDownload, 
//   FaShare, FaInfoCircle, FaChartLine, FaCalendarDay, FaHistory, 
//   FaMoneyCheckAlt, FaSave, FaTimes
// } from 'react-icons/fa';
// import { FiTrendingUp } from 'react-icons/fi';

// // Import jsPDF (Ensure you run: npm install jspdf jspdf-autotable)
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export default function LoanDetails() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [loan, setLoan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [interestData, setInterestData] = useState({ months: 0, interest: 0, total: 0 });
  
//   // Modals State
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showPaidConfirm, setShowPaidConfirm] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
  
//   // Edit Form State
//   const [editFormData, setEditFormData] = useState({ amount: 0, interestRate: 0, notes: '' });

//   const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

//   // Show toast notification
//   const showNotification = (message, type = 'success') => {
//     setShowToast({ show: true, message, type });
//     setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
//   };

//   // --- 1. FETCH LOAN DATA ---
//   useEffect(() => {
//     async function fetchLoanDetails() {
//       try {
//         const res = await fetch(`/api/loans/${id}`);
//         if (!res.ok) throw new Error("Loan not found");
//         const data = await res.json();
//         setLoan(data);
//         setEditFormData({ 
//             amount: data.amount, 
//             interestRate: data.interestRate, 
//             notes: data.notes || '' 
//         });
//         calculateInterest(data);
//         showNotification('Loan details loaded', 'success');
//       } catch (error) {
//         console.error(error);
//         showNotification('Failed to load loan details', 'error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchLoanDetails();
//   }, [id, router]);

//   // --- 2. CALCULATE INTEREST LOGIC ---
//   const calculateInterest = (data) => {
//     if (!data) return;

//     const startDate = new Date(data.date);
//     const today = new Date();
    
//     const diffTime = Math.abs(today - startDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     const diffMonths = (diffDays / 30).toFixed(1);

//     const p = data.amount;
//     const r = data.interestRate;
//     const interest = Math.round((p * r * diffMonths) / 100);
//     const total = p + interest;

//     setInterestData({
//       days: diffDays,
//       months: diffMonths,
//       interest: interest,
//       total: total
//     });
//   };

//   // --- 3. ACTIONS ---

//   const handleStatusUpdate = async (newStatus) => {
//     setActionLoading(true);
//     try {
//       const res = await fetch(`/api/loans/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         setLoan(prev => ({ ...prev, status: newStatus }));
//         showNotification(`Loan marked as ${newStatus}`, 'success');
//         setShowPaidConfirm(false);
//         router.refresh();
//       }
//     } catch (error) {
//       showNotification('Failed to update status', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setActionLoading(true);
//     try {
//       const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         showNotification('Loan deleted successfully', 'success');
//         setTimeout(() => router.push('/dashboard/loans'), 1500);
//       }
//     } catch (error) {
//       showNotification('Failed to delete loan', 'error');
//       setActionLoading(false);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setActionLoading(true);
//     try {
//         const res = await fetch(`/api/loans/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(editFormData),
//         });

//         if (res.ok) {
//             const updatedLoan = { ...loan, ...editFormData };
//             setLoan(updatedLoan);
//             calculateInterest(updatedLoan);
//             showNotification('Loan details updated', 'success');
//             setShowEditModal(false);
//         } else {
//             throw new Error("Update failed");
//         }
//     } catch (error) {
//         showNotification('Failed to update loan', 'error');
//     } finally {
//         setActionLoading(false);
//     }
//   };

//   // Export PDF Logic
//   const handleExportPDF = () => {
//     try {
//       const doc = new jsPDF();

//       // Title
//       doc.setFontSize(20);
//       doc.text("Loan Details Statement", 14, 22);

//       // Meta Info
//       doc.setFontSize(10);
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
//       doc.text(`Loan ID: ${loan._id}`, 14, 35);

//       // Farmer Details Section
//       doc.setFontSize(12);
//       doc.setTextColor(0, 128, 0); // Green color
//       doc.text("Farmer Information", 14, 45);
//       doc.setTextColor(0, 0, 0); // Black

//       const farmerData = [
//         ["Name", loan.farmerId?.name || "N/A"],
//         ["Phone", loan.farmerId?.phone || "N/A"],
//         ["Address", loan.farmerId?.address || "N/A"],
//       ];

//       autoTable(doc, {
//         startY: 50,
//         head: [],
//         body: farmerData,
//         theme: 'plain',
//         styles: { fontSize: 10, cellPadding: 2 },
//         columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
//       });

//       // Financial Details Section
//       const finalY = doc.lastAutoTable.finalY || 50;
//       doc.setFontSize(12);
//       doc.setTextColor(0, 128, 0);
//       doc.text("Financial Breakdown", 14, finalY + 10);
//       doc.setTextColor(0, 0, 0);

//       const financeData = [
//         ["Principal Amount", `Rs. ${loan.amount.toLocaleString()}`],
//         ["Interest Rate", `${loan.interestRate}% per month`],
//         ["Start Date", new Date(loan.date).toLocaleDateString()],
//         ["Status", loan.status],
//         ["Time Elapsed", `${interestData.months} Months (${interestData.days} days)`],
//         ["Accrued Interest", `Rs. ${interestData.interest.toLocaleString()}`],
//         ["TOTAL DUE", `Rs. ${interestData.total.toLocaleString()}`]
//       ];

//       autoTable(doc, {
//         startY: finalY + 15,
//         head: [['Description', 'Value']],
//         body: financeData,
//         theme: 'grid',
//         headStyles: { fillColor: [22, 163, 74] }, // Green header
//         columnStyles: { 0: { fontStyle: 'bold' } },
//       });

//       // Notes
//       if (loan.notes) {
//         const notesY = doc.lastAutoTable.finalY + 10;
//         doc.setFontSize(10);
//         doc.text("Notes:", 14, notesY);
//         doc.setFont("helvetica", "italic");
//         doc.text(loan.notes, 14, notesY + 5);
//       }

//       doc.save(`Loan_${loan.farmerId?.name || 'Details'}.pdf`);
//       showNotification('PDF downloaded successfully', 'success');

//     } catch (error) {
//       console.error("PDF Error:", error);
//       // Fallback if jsPDF is not installed
//       window.print(); 
//       showNotification('Opening print dialog...', 'info');
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//         title: `Loan Details: ${loan.farmerId?.name}`,
//         text: `Check loan details for ${loan.farmerId?.name}. Amount: ${loan.amount}`,
//         url: window.location.href
//     };

//     try {
//         if (navigator.share) {
//             await navigator.share(shareData);
//         } else {
//             await navigator.clipboard.writeText(window.location.href);
//             showNotification('Link copied to clipboard', 'success');
//         }
//     } catch (err) {
//         console.error(err);
//     }
//   };

//   // --- ORIGINAL LOADING SKELETON ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black pt-32 px-4 md:px-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Header Skeleton */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse"></div>
//               <div className="space-y-3">
//                 <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg"></div>
//                 <div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <div className="h-10 w-32 bg-white/5 animate-pulse rounded-xl"></div>
//               <div className="h-10 w-32 bg-white/5 animate-pulse rounded-xl"></div>
//             </div>
//           </div>

//           {/* Content Skeleton */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-96 bg-white/5 animate-pulse rounded-2xl"></div>
//             </div>
//             <div className="space-y-6">
//               <div className="h-48 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-48 bg-white/5 animate-pulse rounded-2xl"></div>
//               <div className="h-32 bg-white/5 animate-pulse rounded-2xl"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!loan) return null;

//   const isEditable = loan.status === 'Pending';

//   return (
//     <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-6 pb-20">
//       {/* Toast Notification */}
//       <AnimatePresence>
//         {showToast.show && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-24 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl border ${
//               showToast.type === 'success' 
//                 ? 'bg-green-500/10 border-green-500/20 text-green-400' 
//                 : 'bg-red-500/10 border-red-500/20 text-red-400'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               {showToast.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
//               <span className="font-medium">{showToast.message}</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {/* Delete Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
//             <motion.div 
//                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-[#111] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-xl font-bold mb-2">Delete Record?</h3>
//                 <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
//                 <div className="flex gap-3">
//                     <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg">Cancel</button>
//                     <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 rounded-lg flex justify-center items-center gap-2">
//                         {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
//                     </button>
//                 </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Mark Paid Modal */}
//         {showPaidConfirm && (
//           <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPaidConfirm(false)}>
//              <motion.div 
//                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-[#111] border border-green-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-xl font-bold mb-2">Mark as Paid?</h3>
//                 <p className="text-gray-400 text-sm mb-6">Status will be updated to "Paid".</p>
//                 <div className="flex gap-3">
//                     <button onClick={() => setShowPaidConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg">Cancel</button>
//                     <button onClick={() => handleStatusUpdate('Paid')} className="flex-1 py-2 bg-green-600 rounded-lg flex justify-center items-center gap-2">
//                         {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Confirm
//                     </button>
//                 </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {showEditModal && (
//             <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
//                 <motion.div 
//                     initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
//                     className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}
//                 >
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-xl font-bold">Edit Loan Details</h3>
//                         <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
//                     </div>
//                     <form onSubmit={handleEditSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-sm text-gray-400 mb-1">Principal Amount (₹)</label>
//                             <input 
//                                 type="number" 
//                                 value={editFormData.amount}
//                                 onChange={(e) => setEditFormData({...editFormData, amount: Number(e.target.value)})}
//                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm text-gray-400 mb-1">Interest Rate (% per month)</label>
//                             <input 
//                                 type="number" 
//                                 step="0.1"
//                                 value={editFormData.interestRate}
//                                 onChange={(e) => setEditFormData({...editFormData, interestRate: Number(e.target.value)})}
//                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm text-gray-400 mb-1">Notes</label>
//                             <textarea 
//                                 value={editFormData.notes}
//                                 onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
//                                 rows="4"
//                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
//                             ></textarea>
//                         </div>
//                         <button 
//                             type="submit" 
//                             disabled={actionLoading}
//                             className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 mt-4"
//                         >
//                             {actionLoading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
//                         </button>
//                     </form>
//                 </motion.div>
//             </div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto">
//         {/* --- HEADER --- */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
//         >
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard/loans">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group relative"
//               >
//                 <FaArrowLeft />
//               </motion.button>
//             </Link>
//             <div>
//               <div className="flex flex-wrap items-center gap-3 mb-2">
//                 <h1 className="text-3xl font-bold text-white">Loan Details</h1>
//                 <span className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${
//                   loan.status === 'Paid' 
//                     ? 'bg-green-500/10 text-green-400 border-green-500/20' 
//                     : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
//                 }`}>
//                   {loan.status === 'Paid' ? <FaCheckCircle /> : <FaClock />}
//                   {loan.status}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
//                 <span className="flex items-center gap-2">
//                   <FaCalendarDay /> Created: {new Date(loan.createdAt || loan.date).toLocaleDateString()}
//                 </span>
//                 <span className="hidden md:inline">•</span>
//                 <span className="flex items-center gap-2">
//                   <FaHistory /> Last Updated: {new Date(loan.updatedAt || loan.date).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <motion.button
//               whileHover={isEditable ? { scale: 1.02 } : {}}
//               whileTap={isEditable ? { scale: 0.98 } : {}}
//               onClick={() => isEditable && setShowEditModal(true)}
//               disabled={!isEditable}
//               className={`px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 transition-all group ${
//                 !isEditable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
//               }`}
//             >
//               <FaEdit className={isEditable ? "group-hover:rotate-12 transition-transform" : ""} />
//               <span className="hidden sm:inline">Edit</span>
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleExportPDF}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group"
//             >
//               <FaDownload className="group-hover:translate-y-[-1px] transition-transform" />
//               <span className="hidden sm:inline">PDF</span>
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleShare}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group"
//             >
//               <FaShare className="group-hover:scale-110 transition-transform" />
//               <span className="hidden sm:inline">Share</span>
//             </motion.button>

//             {loan.status === 'Pending' && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowPaidConfirm(true)}
//                 disabled={actionLoading}
//                 className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all group"
//               >
//                 {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
//                 <span>Mark as Paid</span>
//               </motion.button>
//             )}
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={actionLoading}
//               className="px-5 py-2.5 bg-gradient-to-r from-red-600/20 to-red-700/10 hover:from-red-600/30 hover:to-red-700/20 text-red-400 hover:text-red-300 border border-red-600/30 rounded-xl font-bold flex items-center gap-2 transition-all group"
//             >
//               <FaTrash /> <span>Delete</span>
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* --- CONTENT --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT: Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Quick Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-400 text-sm font-medium">Principal Amount</span>
//                   <div className="p-2 bg-green-500/10 rounded-lg"><FaRupeeSign className="text-green-400" /></div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">{loan.amount.toLocaleString()}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <FiTrendingUp className="text-green-500" />
//                   <span className="text-xs text-green-400">Original Loan</span>
//                 </div>
//               </motion.div>

//               <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-400 text-sm font-medium">Accrued Interest</span>
//                   <div className="p-2 bg-purple-500/10 rounded-lg"><FaChartLine className="text-purple-400" /></div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">₹ {interestData.interest.toLocaleString()}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <FiTrendingUp className="text-purple-500" />
//                   <span className="text-xs text-purple-400">{interestData.months} months elapsed</span>
//                 </div>
//               </motion.div>

//               <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-green-500/20 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-200 text-sm font-medium">Total Due</span>
//                   <div className="p-2 bg-green-500/20 rounded-lg"><FaMoneyCheckAlt className="text-green-400" /></div>
//                 </div>
//                 <p className="text-3xl font-bold text-white">₹ {interestData.total.toLocaleString()}</p>
//                 <div className="text-xs text-gray-400 mt-2">Including principal + interest</div>
//               </motion.div>
//             </div>

//             {/* Farmer Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//             >
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/10 rounded-lg"><FaUser className="text-blue-400" /></div>
//                 Farmer Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-400 mb-1">Full Name</p>
//                   <p className="text-lg font-semibold text-white">{loan.farmerId?.name || 'Unknown'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400 mb-1">Phone Number</p>
//                   <p className="text-lg font-semibold text-white">{loan.farmerId?.phone || 'N/A'}</p>
//                 </div>
//                 <div className="md:col-span-2">
//                   <p className="text-sm text-gray-400 mb-1">Address</p>
//                   <p className="text-white">{loan.farmerId?.address || 'No address provided'}</p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Additional Notes - Moved Here */}
//             {loan.notes && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//               >
//                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                   <FaInfoCircle className="text-blue-400" />
//                   Additional Notes
//                 </h3>
//                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
//                   <p className="text-gray-300 italic">"{loan.notes}"</p>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* RIGHT: Sidebar */}
//           <div className="space-y-6">
//             {/* Interest Calculator Card */}
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
//             >
//               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full"></div>
              
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
//                 <div className="p-2 bg-green-500/10 rounded-lg"><FaClock className="text-green-400" /></div>
//                 Time Analytics
//               </h2>

//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                     <p className="text-2xl font-bold text-white">{interestData.days}</p>
//                     <p className="text-xs text-gray-400 uppercase font-medium">Days Passed</p>
//                   </div>
//                   <div className="bg-black/40 p-4 rounded-xl border border-white/5">
//                     <p className="text-2xl font-bold text-white">{interestData.months}</p>
//                     <p className="text-xs text-gray-400 uppercase font-medium">Approx Months</p>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-4 border-t border-white/10">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-300">Daily Interest</span>
//                     <span className="font-mono text-green-400">
//                       ₹ {((loan.amount * loan.interestRate) / (100 * 30)).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-300">Monthly Interest</span>
//                     <span className="font-mono text-green-400">
//                       ₹ {((loan.amount * loan.interestRate) / 100).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-white/10">
//                     <span className="text-white">Total Due</span>
//                     <span className="text-white flex items-center gap-2">
//                       <FaMoneyBillWave className="text-green-500" />
//                       ₹ {interestData.total.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Loan Terms */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
//             >
//               <h3 className="text-lg font-bold text-white mb-4">Loan Terms</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Interest Rate</span>
//                   <span className="text-white font-semibold">{loan.interestRate}% per month</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Start Date</span>
//                   <span className="text-white font-semibold">{new Date(loan.date).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">Status</span>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                     loan.status === 'Paid' 
//                       ? 'bg-green-500/10 text-green-400' 
//                       : 'bg-yellow-500/10 text-yellow-500'
//                   }`}>
//                     {loan.status}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaUser, FaRupeeSign, FaCheckCircle, FaTrash, 
  FaSpinner, FaClock, FaMoneyBillWave, FaEdit, FaDownload, 
  FaShare, FaInfoCircle, FaChartLine, FaCalendarDay, FaHistory, 
  FaMoneyCheckAlt, FaSave, FaTimes, FaCoins
} from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

// Import jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LoanDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [interestData, setInterestData] = useState({ months: 0, interest: 0, total: 0 });
  
  // Modals State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaidConfirm, setShowPaidConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPartialPayModal, setShowPartialPayModal] = useState(false); // NEW
  
  // Form State
  const [editFormData, setEditFormData] = useState({ amount: 0, interestRate: 0, notes: '' });
  const [partialAmount, setPartialAmount] = useState(''); // NEW

  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- 1. FETCH LOAN DATA ---
  useEffect(() => {
    async function fetchLoanDetails() {
      try {
        const res = await fetch(`/api/loans/${id}`);
        if (!res.ok) throw new Error("Loan not found");
        const data = await res.json();
        setLoan(data);
        setEditFormData({ 
            amount: data.amount, 
            interestRate: data.interestRate, 
            notes: data.notes || '' 
        });
        calculateInterest(data);
      } catch (error) {
        console.error(error);
        showNotification('Failed to load loan details', 'error');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchLoanDetails();
  }, [id]);

  // --- 2. CALCULATE INTEREST LOGIC ---
  const calculateInterest = (data) => {
    if (!data) return;

    const startDate = new Date(data.date);
    const today = new Date();
    
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const diffMonths = (diffDays / 30).toFixed(1);

    const p = data.amount;
    const r = data.interestRate;
    const interest = Math.round((p * r * diffMonths) / 100);
    const total = p + interest;

    setInterestData({
      days: diffDays,
      months: diffMonths,
      interest: interest,
      total: total
    });
  };

  // --- 3. ACTIONS ---

const handlePartialPayment = async (e) => {
    e.preventDefault();
    if (!partialAmount || partialAmount <= 0) {
        showNotification("Please enter a valid amount", "error");
        return;
    }

    setActionLoading(true);
    try {
        // We only send the payment amount. The Backend handles the interest math.
        const res = await fetch(`/api/loans/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'partial_payment', // Flag for backend
                paymentAmount: partialAmount 
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setLoan(data); // Update state with the new data from backend
            calculateInterest(data); // Recalculate frontend display
            
            showNotification(`Payment Successful. New Balance: ₹${data.amount}`, 'success');
            setShowPartialPayModal(false);
            setPartialAmount('');
        } else {
            throw new Error(data.error || "Payment failed");
        }
    } catch (error) {
        console.error(error);
        showNotification(error.message, 'error');
    } finally {
        setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/loans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLoan(prev => ({ ...prev, status: newStatus }));
        showNotification(`Loan marked as ${newStatus}`, 'success');
        setShowPaidConfirm(false);
      }
    } catch (error) {
      showNotification('Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Loan deleted successfully', 'success');
        setTimeout(() => router.push('/dashboard/loans'), 1500);
      }
    } catch (error) {
      showNotification('Failed to delete loan', 'error');
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const res = await fetch(`/api/loans/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editFormData),
        });

        if (res.ok) {
            const updatedLoan = { ...loan, ...editFormData };
            setLoan(updatedLoan);
            calculateInterest(updatedLoan);
            showNotification('Loan details updated', 'success');
            setShowEditModal(false);
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        showNotification('Failed to update loan', 'error');
    } finally {
        setActionLoading(false);
    }
  };

  // Export PDF Logic
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Loan Details Statement", 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Loan ID: ${loan._id}`, 14, 35);

      doc.setFontSize(12);
      doc.setTextColor(0, 128, 0);
      doc.text("Farmer Information", 14, 45);
      doc.setTextColor(0, 0, 0);

      const farmerData = [
        ["Name", loan.farmerId?.name || "N/A"],
        ["Phone", loan.farmerId?.phone || "N/A"],
        ["Address", loan.farmerId?.address || "N/A"],
      ];

      autoTable(doc, {
        startY: 50,
        head: [],
        body: farmerData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      });

      const finalY = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 0);
      doc.text("Financial Breakdown", 14, finalY + 10);
      doc.setTextColor(0, 0, 0);

      const financeData = [
        ["Principal Amount", `Rs. ${loan.amount.toLocaleString()}`],
        ["Interest Rate", `${loan.interestRate}% per month`],
        ["Start Date", new Date(loan.date).toLocaleDateString()],
        ["Status", loan.status],
        ["Time Elapsed", `${interestData.months} Months (${interestData.days} days)`],
        ["Accrued Interest", `Rs. ${interestData.interest.toLocaleString()}`],
        ["TOTAL DUE", `Rs. ${interestData.total.toLocaleString()}`]
      ];

      autoTable(doc, {
        startY: finalY + 15,
        head: [['Description', 'Value']],
        body: financeData,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        columnStyles: { 0: { fontStyle: 'bold' } },
      });

    //   if (loan.notes) {
    //     const notesY = doc.lastAutoTable.finalY + 10;
    //     doc.setFontSize(10);
    //     doc.text("Notes/Payment History:", 14, notesY);
        
    //     // Handle multiline notes in PDF
    //     const splitNotes = doc.splitTextToSize(loan.notes, 180);
    //     doc.setFont("helvetica", "italic");
    //     doc.text(splitNotes, 14, notesY + 5);
    //   }

      doc.save(`Loan_${loan.farmerId?.name || 'Details'}.pdf`);
      showNotification('PDF downloaded successfully', 'success');
    } catch (error) {
      console.error("PDF Error:", error);
      window.print(); 
      showNotification('Opening print dialog...', 'info');
    }
  };

  const handleShare = async () => {
    const shareData = {
        title: `Loan Details: ${loan.farmerId?.name}`,
        text: `Check loan details for ${loan.farmerId?.name}. Amount: ${loan.amount}`,
        url: window.location.href
    };
    try {
        if (navigator.share) await navigator.share(shareData);
        else {
            await navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard', 'success');
        }
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black pt-20">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  if (!loan) return null;
  const isEditable = loan.status === 'Pending';

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-6 pb-20">
      
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
              {showToast.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* Partial Pay Modal - NEW */}
        {showPartialPayModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPartialPayModal(false)}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#111] border border-blue-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FaCoins className="text-blue-500"/> Repay Partial Amount
                    </h3>
                    <form onSubmit={handlePartialPayment}>
                        <label className="block text-sm text-gray-400 mb-2">Enter Amount Received (₹)</label>
                        <input 
                            type="number" 
                            autoFocus
                            placeholder="e.g. 5000"
                            value={partialAmount}
                            onChange={(e) => setPartialAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500 text-white"
                        />
                        <div className="p-3 bg-blue-500/10 rounded-lg mb-4 text-xs text-blue-300">
                            This will reduce the Principal Amount. Interest will be recalculated based on the new balance.
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowPartialPayModal(false)} className="flex-1 py-2 bg-white/5 rounded-lg">Cancel</button>
                            <button type="submit" disabled={actionLoading} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex justify-center items-center gap-2 font-bold">
                                {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Submit
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">Delete Record?</h3>
                <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 rounded-lg flex justify-center items-center gap-2">
                        {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                    </button>
                </div>
            </motion.div>
          </div>
        )}

        {/* Mark Full Paid Modal */}
        {showPaidConfirm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPaidConfirm(false)}>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-green-500/30 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">Mark as Fully Paid?</h3>
                <p className="text-gray-400 text-sm mb-6">Status will be updated to "Paid". Only use this if full amount is cleared.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowPaidConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg">Cancel</button>
                    <button onClick={() => handleStatusUpdate('Paid')} className="flex-1 py-2 bg-green-600 rounded-lg flex justify-center items-center gap-2">
                        {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Confirm
                    </button>
                </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Edit Loan Details</h3>
                        <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                    </div>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Principal Amount (₹)</label>
                            <input 
                                type="number" 
                                value={editFormData.amount}
                                onChange={(e) => setEditFormData({...editFormData, amount: Number(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Interest Rate (% per month)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={editFormData.interestRate}
                                onChange={(e) => setEditFormData({...editFormData, interestRate: Number(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Notes</label>
                            <textarea 
                                value={editFormData.notes}
                                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={actionLoading}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 mt-4"
                        >
                            {actionLoading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard/loans">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group relative"
              >
                <FaArrowLeft />
              </motion.button>
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Loan Details</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${
                  loan.status === 'Paid' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {loan.status === 'Paid' ? <FaCheckCircle /> : <FaClock />}
                  {loan.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <FaCalendarDay /> Issued: {new Date(loan.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={isEditable ? { scale: 1.02 } : {}}
              onClick={() => isEditable && setShowEditModal(true)}
              disabled={!isEditable}
              className={`px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 transition-all ${!isEditable ? 'opacity-50' : 'hover:bg-white/10'}`}
            >
              <FaEdit /> <span className="hidden sm:inline">Edit</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleExportPDF}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all"
            >
              <FaDownload /> <span className="hidden sm:inline">PDF</span>
            </motion.button>
            
            {loan.status === 'Pending' && (
             <>
              {/* Repay Part Button - NEW */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPartialPayModal(true)}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <FaCoins /> <span>Repay Part</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPaidConfirm(true)}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
              >
                <FaCheckCircle /> <span>Mark Full Paid</span>
              </motion.button>
             </>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl font-bold flex items-center gap-2"
            >
              <FaTrash />
            </motion.button>
          </div>
        </motion.div>

        {/* --- CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm font-medium">Principal Remaining</span>
                  <div className="p-2 bg-green-500/10 rounded-lg"><FaRupeeSign className="text-green-400" /></div>
                </div>
                <p className="text-3xl font-bold text-white">{loan.amount.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="text-green-500" />
                  <span className="text-xs text-green-400">Current Balance</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm font-medium">Accrued Interest</span>
                  <div className="p-2 bg-purple-500/10 rounded-lg"><FaChartLine className="text-purple-400" /></div>
                </div>
                <p className="text-3xl font-bold text-white">₹ {interestData.interest.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="text-purple-500" />
                  <span className="text-xs text-purple-400">{interestData.months} months elapsed</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-200 text-sm font-medium">Total Due Now</span>
                  <div className="p-2 bg-green-500/20 rounded-lg"><FaMoneyCheckAlt className="text-green-400" /></div>
                </div>
                <p className="text-3xl font-bold text-white">₹ {interestData.total.toLocaleString()}</p>
                <div className="text-xs text-gray-400 mt-2">To clear full loan</div>
              </motion.div>
            </div>

            {/* Farmer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><FaUser className="text-blue-400" /></div>
                Farmer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-white">{loan.farmerId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                  <p className="text-lg font-semibold text-white">{loan.farmerId?.phone || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">Address</p>
                  <p className="text-white">{loan.farmerId?.address || 'No address provided'}</p>
                </div>
              </div>
            </motion.div>

            {/* Payment History / Notes */}
            {loan.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaHistory className="text-blue-400" />
                  History & Notes
                </h3>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                  <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{loan.notes}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* Interest Calculator Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg"><FaClock className="text-green-400" /></div>
                Time Analytics
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-2xl font-bold text-white">{interestData.days}</p>
                    <p className="text-xs text-gray-400 uppercase font-medium">Days Passed</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-2xl font-bold text-white">{interestData.months}</p>
                    <p className="text-xs text-gray-400 uppercase font-medium">Approx Months</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Interest</span>
                    <span className="font-mono text-green-400">
                      ₹ {((loan.amount * loan.interestRate) / (100 * 30)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Interest</span>
                    <span className="font-mono text-green-400">
                      ₹ {((loan.amount * loan.interestRate) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-white/10">
                    <span className="text-white">Total Due</span>
                    <span className="text-white flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      ₹ {interestData.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loan Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Loan Terms</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Interest Rate</span>
                  <span className="text-white font-semibold">{loan.interestRate}% per month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Start Date</span>
                  <span className="text-white font-semibold">{new Date(loan.date).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}