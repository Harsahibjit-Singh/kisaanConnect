'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaSpinner, FaTimes,
  FaRupeeSign, FaCalendarAlt, FaCheckCircle, FaExclamationCircle 
} from 'react-icons/fa';

// Animation Variants
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVar = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -10 } 
};

export default function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 

  // --- 1. FETCH LOAN DATA ---
  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch('/api/loans'); 
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setLoans(data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  // --- 2. IMPROVED FILTER LOGIC (useMemo + Normalization) ---
  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      // FIX 1: Normalize Text (Trim + Lowercase) to prevent "stuck" searches
      const farmerName = (loan.farmerId?.name || '').toLowerCase(); 
      const searchLower = searchTerm.toLowerCase().trim();
      
      const matchesSearch = farmerName.includes(searchLower);
      
      // FIX 2: Normalize Status Comparison (Fixes the "Reversing" bug)
      // This ensures 'pending' (DB) matches 'Pending' (Filter)
      const currentStatus = (loan.status || 'Pending').toLowerCase();
      const filterStatusLower = statusFilter.toLowerCase();

      const matchesStatus = statusFilter === 'All' || currentStatus === filterStatusLower;
      
      return matchesSearch && matchesStatus;
    });
  }, [loans, searchTerm, statusFilter]);

  // --- 3. HELPER: RESET FILTERS ---
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  // --- 4. CALCULATE TOTALS ---
  // We use useMemo here too so stats don't jitter during typing
  const stats = useMemo(() => {
    const active = loans.filter(l => (l.status || 'Pending') === 'Pending');
    return {
        count: active.length,
        outstanding: active.reduce((acc, curr) => acc + (curr.amount || 0), 0)
    };
  }, [loans]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black pt-20">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER & STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-extrabold text-white mb-2">Loan Management</h1>
            <p className="text-gray-400">Track advances, interest, and repayments.</p>
          </div>
          
          {/* Quick Stats Box */}
          <div className="bg-[#111] border border-white/10 p-4 rounded-xl flex justify-between items-center shadow-lg">
             <div>
                <p className="text-gray-500 text-xs uppercase font-bold">Outstanding (Principal)</p>
                <p className="text-2xl font-bold text-red-400">₹ {stats.outstanding.toLocaleString()}</p>
             </div>
             <div className="text-right">
                <p className="text-gray-500 text-xs uppercase font-bold">Pending Cases</p>
                <p className="text-2xl font-bold text-white">{stats.count}</p>
             </div>
          </div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             {/* Search with Clear Button */}
             <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search Farmer..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <FaTimes />
                    </button>
                )}
             </div>

             {/* Filter Tabs */}
             <div className="bg-[#151515] p-1 rounded-xl border border-white/10 flex">
                {['All', 'Pending', 'Paid'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      statusFilter === status 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
             </div>
          </div>

          <Link href="/dashboard/loans/new">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              <FaPlus /> Issue Loan
            </motion.button>
          </Link>
        </div>

        {/* --- LOAN TABLE --- */}
        <motion.div 
          variants={containerVar}
          initial="hidden"
          animate="visible"
          className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/5">
                  <th className="p-6">Issue Date</th>
                  <th className="p-6">Farmer</th>
                  <th className="p-6">Principal</th>
                  <th className="p-6">Rate / Month</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <AnimatePresence mode="popLayout">
                    {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                        <motion.tr 
                        key={loan._id}
                        variants={rowVar}
                        exit="exit"
                        layout
                        className="hover:bg-white/5 transition-colors"
                        >
                        <td className="p-6 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-gray-400">
                               <FaCalendarAlt />
                               <span>{loan.date ? new Date(loan.date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </td>

                        <td className="p-6">
                            <div className="font-bold text-white">{loan.farmerId?.name || 'Unknown Farmer'}</div>
                            <div className="text-xs text-gray-500">Loan ID: #{loan._id.substring(0,6)}</div>
                        </td>

                        <td className="p-6">
                            <div className="flex items-center gap-1 font-mono font-bold text-white">
                               <FaRupeeSign className="text-xs text-gray-500" />
                               {(loan.amount || 0).toLocaleString()}
                            </div>
                        </td>

                        <td className="p-6">
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
                                {loan.interestRate || 0}%
                            </span>
                        </td>

                        <td className="p-6">
                            {(loan.status || 'Pending') === 'Pending' ? (
                                <span className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold border border-yellow-500/20">
                                <FaExclamationCircle /> Pending
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold border border-green-500/20">
                                <FaCheckCircle /> Paid
                                </span>
                            )}
                        </td>

                        <td className="p-6 text-center">
                            <Link href={`/dashboard/loans/${loan._id}`}>
                                <button className="text-sm font-bold text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all">
                                View Details
                                </button>
                            </Link>
                        </td>
                        </motion.tr>
                    ))
                    ) : (
                        // Empty State Logic
                        <tr>
                            <td colSpan="6" className="p-12 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p>No loans found matching your criteria.</p>
                                    {(searchTerm || statusFilter !== 'All') && (
                                        <button 
                                            onClick={clearFilters}
                                            className="text-green-500 hover:text-green-400 text-sm font-bold underline"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}