// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { 
//   FaUser, FaRupeeSign, FaCalendarAlt, FaPercent, 
//   FaStickyNote, FaArrowLeft, FaSave, FaSpinner, FaExclamationTriangle 
// } from 'react-icons/fa';

// export default function NewLoanEntry() {
//   const router = useRouter();
  
//   // --- UI States ---
//   const [submitting, setSubmitting] = useState(false);
//   const [loadingFarmers, setLoadingFarmers] = useState(true);
//   const [error, setError] = useState('');
  
//   // --- Data States ---
//   const [farmers, setFarmers] = useState([]);
  
//   // --- Form State ---
//   // STRICTLY MATCHING YOUR SCHEMA
//   const [formData, setFormData] = useState({
//     farmerId: '',
//     amount: '',
//     interestRate: '2', // Default 2%
//     date: new Date().toISOString().split('T')[0], // Today's date
//     notes: '',
//     status: 'Pending'
//   });

//   // --- 1. FETCH FARMERS (GET /api/farmers) ---
//   useEffect(() => {
//     async function fetchFarmers() {
//       try {
//         const res = await fetch('/api/farmers');
//         if (!res.ok) throw new Error("Failed to load farmers list");
//         const data = await res.json();
//         setFarmers(data);
//       } catch (err) {
//         console.error("Error fetching farmers:", err);
//         setError("Could not load farmers. Please check your connection.");
//       } finally {
//         setLoadingFarmers(false);
//       }
//     }
//     fetchFarmers();
//   }, []);

//   // --- 2. INPUT HANDLER ---
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // --- 3. SUBMIT HANDLER (POST /api/loans) ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSubmitting(true);

//     // Basic Validation
//     if (!formData.farmerId) {
//       setError("Please select a farmer from the list.");
//       setSubmitting(false);
//       return;
//     }
//     if (parseFloat(formData.amount) <= 0) {
//       setError("Amount must be greater than 0.");
//       setSubmitting(false);
//       return;
//     }

//     try {
//       // API Call
//       const res = await fetch('/api/loans', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         // Handle specific errors from your API or fallback
//         throw new Error(result.error || "Failed to create loan");
//       }

//       // Success: Redirect to Loan Dashboard
//       router.push('/dashboard/loans');
//       router.refresh(); // Update the loans list immediately

//     } catch (err) {
//       setError(err.message);
//       setSubmitting(false);
//     }
//   };

//   // --- 4. LIVE CALCULATOR HELPER ---
//   // Calculates monthly interest based on principal * rate / 100
//   const calculatedInterest = (parseFloat(formData.amount || 0) * parseFloat(formData.interestRate || 0)) / 100;

//   return (
//     <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center items-start">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl"
//       >
        
//         {/* --- Header --- */}
//         <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
//           <Link href="/dashboard/loans">
//             <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
//               <FaArrowLeft />
//             </button>
//           </Link>
//           <div>
//             <h1 className="text-3xl font-bold text-white">Issue New Loan</h1>
//             <p className="text-gray-400 text-sm">Create a new financial record.</p>
//           </div>
//         </div>

//         {/* --- Error Banner --- */}
//         {error && (
//           <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
//             <FaExclamationTriangle />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* --- Form --- */}
//         <form onSubmit={handleSubmit} className="space-y-6">
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* 1. Farmer Dropdown */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-400 ml-1">Select Farmer</label>
//               <div className="relative">
//                 <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                 <select 
//                   name="farmerId"
//                   required
//                   value={formData.farmerId}
//                   onChange={handleChange}
//                   disabled={loadingFarmers}
//                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer disabled:opacity-50"
//                 >
//                   <option value="" disabled>
//                     {loadingFarmers ? "Loading Farmers..." : "Choose a farmer..."}
//                   </option>
                  
//                   {!loadingFarmers && farmers.map(f => (
//                     <option key={f._id} value={f._id}>
//                       {f.name} {f.aadhar ? `(Aadhar: ${f.aadhar.slice(-4)})` : f.phone ? `(${f.phone})` : ''}
//                     </option>
//                   ))}
//                 </select>
                
//                 {loadingFarmers && (
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                     <FaSpinner className="animate-spin text-green-500" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* 2. Date Input */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-400 ml-1">Issue Date</label>
//               <div className="relative">
//                 <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                 <input 
//                   type="date"
//                   name="date"
//                   required
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 [color-scheme:dark]"
//                 />
//               </div>
//             </div>

//             {/* 3. Amount Input */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-400 ml-1">Principal Amount (₹)</label>
//               <div className="relative">
//                 <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                 <input 
//                   type="number"
//                   name="amount"
//                   placeholder="e.g. 50000"
//                   required
//                   min="1"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500"
//                 />
//               </div>
//             </div>

//             {/* 4. Interest Rate Input (Schema: interestRate) */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-400 ml-1">Interest Rate (% per month)</label>
//               <div className="relative">
//                 <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
//                 <input 
//                   type="number"
//                   name="interestRate" 
//                   step="0.01"
//                   required
//                   value={formData.interestRate}
//                   onChange={handleChange}
//                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500"
//                 />
//               </div>
//             </div>

//           </div>

//           {/* 5. Notes Input */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-gray-400 ml-1">Notes (Optional)</label>
//             <div className="relative">
//               <FaStickyNote className="absolute left-4 top-6 text-gray-500" />
//               <textarea 
//                 name="notes"
//                 rows="3"
//                 placeholder="e.g. Advance for fertilizer purchase..."
//                 value={formData.notes}
//                 onChange={handleChange}
//                 className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 resize-none"
//               ></textarea>
//             </div>
//           </div>

//           {/* --- Live Calculation Box --- */}
//           <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4 flex justify-between items-center">
//             <div>
//               <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Projected Interest</p>
//               <p className="text-gray-400 text-xs mt-1">Based on {formData.interestRate}% monthly rate</p>
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-bold text-white">₹ {calculatedInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
//               <p className="text-[10px] text-gray-400">per month</p>
//             </div>
//           </div>

//           {/* --- Action Buttons --- */}
//           <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
//              <Link href="/dashboard/loans">
//                <button 
//                  type="button"
//                  className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
//                >
//                  Cancel
//                </button>
//              </Link>
             
//              <motion.button 
//                whileHover={{ scale: 1.02 }}
//                whileTap={{ scale: 0.98 }}
//                type="submit"
//                disabled={submitting || loadingFarmers}
//                className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//              >
//                {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />} 
//                {submitting ? 'Saving...' : 'Confirm Loan'}
//              </motion.button>
//           </div>

//         </form>
//       </motion.div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { 
//   FaSearch, FaPlus, FaSpinner, FaRupeeSign, 
//   FaCalendarAlt, FaCheckCircle, FaExclamationCircle 
// } from 'react-icons/fa';

// // Animation Variants
// const containerVar = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
// };

// const rowVar = {
//   hidden: { opacity: 0, y: 10 },
//   visible: { opacity: 1, y: 0 }
// };

// export default function LoanManagement() {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All'); 

//   // --- 1. FETCH LOAN DATA ---
//   useEffect(() => {
//     async function fetchLoans() {
//       try {
//         const res = await fetch('/api/loans'); 
//         if (!res.ok) throw new Error("Failed to fetch");
//         const data = await res.json();
//         setLoans(data || []);
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLoans();
//   }, []);

//   // --- 2. FILTER LOGIC (FIXED) ---
//   const filteredLoans = loans.filter(loan => {
//     // FIX: Safely access nested farmerId.name
//     // If farmerId is null (deleted farmer) or name is undefined, use empty string to prevent crash
//     const nameToCheck = loan.farmerId?.name || '';
    
//     const matchesSearch = nameToCheck.toLowerCase().includes(searchTerm.toLowerCase());
    
//     // Check against your Schema defaults (Pending/Paid)
//     const matchesStatus = statusFilter === 'All' || (loan.status || 'Pending') === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   // --- 3. CALCULATE TOTALS ---
//   // Using 'amount' from your schema
//   const totalDisbursed = loans.reduce((acc, curr) => acc + (curr.amount || 0), 0);
//   const activeLoansCount = loans.filter(l => l.status === 'Pending').length;
  
//   // Outstanding calculation
//   const outstandingAmount = loans
//     .filter(l => l.status === 'Pending')
//     .reduce((acc, curr) => acc + (curr.amount || 0), 0);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-black pt-20">
//         <FaSpinner className="animate-spin text-4xl text-green-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6 pt-32">
//       <div className="max-w-7xl mx-auto">
        
//         {/* --- HEADER & STATS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="md:col-span-2">
//             <h1 className="text-4xl font-extrabold text-white mb-2">Loan Management</h1>
//             <p className="text-gray-400">Track advances, interest, and repayments.</p>
//           </div>
          
//           {/* Quick Stats Box */}
//           <div className="bg-[#111] border border-white/10 p-4 rounded-xl flex justify-between items-center shadow-lg">
//              <div>
//                 <p className="text-gray-500 text-xs uppercase font-bold">Outstanding</p>
//                 <p className="text-2xl font-bold text-red-400">₹ {outstandingAmount.toLocaleString()}</p>
//              </div>
//              <div className="text-right">
//                 <p className="text-gray-500 text-xs uppercase font-bold">Pending Cases</p>
//                 <p className="text-2xl font-bold text-white">{activeLoansCount}</p>
//              </div>
//           </div>
//         </div>

//         {/* --- CONTROLS --- */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
//           <div className="flex gap-4 w-full md:w-auto">
//              {/* Search */}
//              <div className="relative w-full md:w-64">
//                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                 <input 
//                   type="text" 
//                   placeholder="Search Farmer..." 
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-green-500 focus:outline-none"
//                 />
//              </div>

//              {/* Filter Tabs */}
//              <div className="bg-[#151515] p-1 rounded-xl border border-white/10 flex">
//                 {['All', 'Pending', 'Paid'].map(status => (
//                   <button
//                     key={status}
//                     onClick={() => setStatusFilter(status)}
//                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
//                       statusFilter === status 
//                       ? 'bg-green-600 text-white shadow-md' 
//                       : 'text-gray-400 hover:text-white'
//                     }`}
//                   >
//                     {status}
//                   </button>
//                 ))}
//              </div>
//           </div>

//           <Link href="/dashboard/loans/new">
//             <motion.button 
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
//             >
//               <FaPlus /> Issue Loan
//             </motion.button>
//           </Link>
//         </div>

//         {/* --- LOAN TABLE --- */}
//         <motion.div 
//           variants={containerVar}
//           initial="hidden"
//           animate="visible"
//           className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/5">
//                   <th className="p-6">Issue Date</th>
//                   <th className="p-6">Farmer</th>
//                   <th className="p-6">Amount</th>
//                   <th className="p-6">Rate / Month</th>
//                   <th className="p-6">Status</th>
//                   <th className="p-6 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5 text-gray-300">
//                 {filteredLoans.length > 0 ? (
//                   filteredLoans.map((loan) => (
//                     <motion.tr 
//                       key={loan._id}
//                       variants={rowVar}
//                       className="hover:bg-white/5 transition-colors"
//                     >
//                       <td className="p-6 whitespace-nowrap">
//                         <div className="flex items-center gap-2 text-gray-400">
//                            <FaCalendarAlt />
//                            <span>{new Date(loan.date).toLocaleDateString()}</span>
//                         </div>
//                       </td>

//                       <td className="p-6">
//                          {/* FIX: Use nested farmerId.name */}
//                          <div className="font-bold text-white">{loan.farmerId?.name || 'Unknown Farmer'}</div>
//                          <div className="text-xs text-gray-500">Loan ID: #{loan._id.substring(0,6)}</div>
//                       </td>

//                       <td className="p-6">
//                          <div className="flex items-center gap-1 font-mono font-bold text-white">
//                             <FaRupeeSign className="text-xs text-gray-500" />
//                             {/* FIX: Use 'amount' from schema */}
//                             {loan.amount.toLocaleString()}
//                          </div>
//                       </td>

//                       <td className="p-6">
//                          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
//                            {/* FIX: Use 'interestRate' from schema */}
//                            {loan.interestRate}%
//                          </span>
//                       </td>

//                       <td className="p-6">
//                          {loan.status === 'Pending' ? (
//                            <span className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold border border-yellow-500/20">
//                              <FaExclamationCircle /> Pending
//                            </span>
//                          ) : (
//                            <span className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold border border-green-500/20">
//                              <FaCheckCircle /> Paid
//                            </span>
//                          )}
//                       </td>

//                       <td className="p-6 text-center">
//                          <Link href={`/dashboard/loans/${loan._id}`}>
//                            <button className="text-sm font-bold text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all">
//                              View Details
//                            </button>
//                          </Link>
//                       </td>
//                     </motion.tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="p-12 text-center text-gray-500">
//                       No loan records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//       </div>
//     </div>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaUser, FaRupeeSign, FaCalendarAlt, FaPercent, 
  FaStickyNote, FaArrowLeft, FaSave, FaSpinner, FaExclamationTriangle 
} from 'react-icons/fa';

export default function NewLoanEntry() {
  const router = useRouter();
  
  const [submitting, setSubmitting] = useState(false);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [error, setError] = useState('');
  const [farmers, setFarmers] = useState([]);
  
  const [formData, setFormData] = useState({
    farmerId: '',
    amount: '',
    interestRate: '2', 
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'Pending'
  });

  useEffect(() => {
    async function fetchFarmers() {
      try {
        const res = await fetch('/api/farmers');
        if (!res.ok) throw new Error("Failed to load farmers list");
        const data = await res.json();
        setFarmers(data);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError("Could not load farmers. Please check your connection.");
      } finally {
        setLoadingFarmers(false);
      }
    }
    fetchFarmers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.farmerId) {
      setError("Please select a farmer from the list.");
      setSubmitting(false);
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
          ...formData,
          amount: parseFloat(formData.amount),
          interestRate: parseFloat(formData.interestRate)
      };

      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create loan");
      }

      router.push('/dashboard/loans');
      router.refresh(); 

    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const calculatedInterest = (parseFloat(formData.amount || 0) * parseFloat(formData.interestRate || 0)) / 100;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center items-start">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
          <Link href="/dashboard/loans">
            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <FaArrowLeft />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Issue New Loan</h1>
            <p className="text-gray-400 text-sm">Create a new financial record.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Farmer Select */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Select Farmer</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <select 
                  name="farmerId"
                  required
                  value={formData.farmerId}
                  onChange={handleChange}
                  disabled={loadingFarmers}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>
                    {loadingFarmers ? "Loading Farmers..." : "Choose a farmer..."}
                  </option>
                  {!loadingFarmers && farmers.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name} {f.phone ? `(${f.phone})` : ''}
                    </option>
                  ))}
                </select>
                {loadingFarmers && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FaSpinner className="animate-spin text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Issue Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Principal Amount (₹)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="number"
                  name="amount"
                  placeholder="e.g. 50000"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Interest Rate (% per month)</label>
              <div className="relative">
                <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input 
                  type="number"
                  name="interestRate" 
                  step="0.01"
                  required
                  value={formData.interestRate}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-1">Notes (Optional)</label>
            <div className="relative">
              <FaStickyNote className="absolute left-4 top-6 text-gray-500" />
              <textarea 
                name="notes"
                rows="3"
                placeholder="e.g. Advance for fertilizer purchase..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Projected Interest</p>
              <p className="text-gray-400 text-xs mt-1">Based on {formData.interestRate}% monthly rate</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">₹ {calculatedInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-gray-400">per month</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
              <Link href="/dashboard/loans">
               <button 
                 type="button"
                 className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
               >
                 Cancel
               </button>
              </Link>
             
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="submit"
               disabled={submitting || loadingFarmers}
               className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />} 
               {submitting ? 'Saving...' : 'Confirm Loan'}
             </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}