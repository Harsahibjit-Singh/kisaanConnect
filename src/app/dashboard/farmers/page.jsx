'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserPlus, FaSearch, FaPhoneAlt, FaMapMarkerAlt, 
  FaIdCard, FaUniversity, FaSpinner, FaArrowRight, 
  FaTimes, FaUser 
} from 'react-icons/fa';

// --- ANIMATIONS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVar = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export default function FarmerList() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  // 1. FETCH FARMERS
  useEffect(() => {
    async function fetchFarmers() {
      try {
        const res = await fetch('/api/farmers');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFarmers(data);
      } catch (error) {
        console.error("Failed to fetch farmers", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFarmers();
  }, []);

  // 2. SEARCH LOGIC (useMemo for performance)
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      // Safety check for null values
      const name = (f.name || '').toLowerCase();
      const phone = (f.phone || '').toLowerCase();
      const term = searchInput.toLowerCase().trim();

      // Filter by Name OR Phone
      return name.includes(term) || phone.includes(term);
    });
  }, [farmers, searchInput]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black pt-20">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      
      {/* --- HEADER & ACTIONS --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Farmer Directory</h1>
            <p className="text-gray-400 text-lg">
              Manage your network of <span className="text-green-400 font-bold">{filteredFarmers.length}</span> registered growers.
            </p>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto items-stretch">
            
            {/* SEARCH BAR */}
            <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search Name or Phone..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-green-500 transition-colors shadow-inner placeholder-gray-600"
                />
                
                {/* Clear Button */}
                {searchInput && (
                  <button 
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-white/10 rounded-full p-1 transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
            </div>

            {/* ADD BUTTON */}
            <Link href="/dashboard/farmers/add">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 whitespace-nowrap transition-all"
              >
                <FaUserPlus /> Add New Farmer
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- FARMER GRID --- */}
      <motion.div 
        variants={containerVar}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode='popLayout'>
          {filteredFarmers.length > 0 ? (
            filteredFarmers.map((farmer) => (
              <motion.div 
                key={farmer._id}
                variants={cardVar}
                layout
                exit="exit"
                className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 hover:border-green-500/40 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col h-full"
              >
                {/* Background Glow on Hover */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full blur-[50px] group-hover:bg-green-500/20 transition-all duration-500 pointer-events-none"></div>

                {/* 1. Header: Avatar & Name (Clickable Link) */}
                <Link href={`/dashboard/farmers/${farmer._id}`} className="block">
                    <div className="flex items-start gap-4 mb-6 relative z-10 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {farmer.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white truncate group-hover:text-green-400 transition-colors">
                                {farmer.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">S/o {farmer.fatherName || 'Unknown'}</p>
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400">
                                <FaIdCard className="text-xs" /> {farmer.aadhar || 'N/A'}
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 2. Details Grid */}
                <div className="space-y-3 relative z-10 flex-grow">
                  <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#111] border border-white/5 p-3 rounded-xl">
                    <FaPhoneAlt className="text-green-500" />
                    <span className="font-mono">{farmer.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#111] border border-white/5 p-3 rounded-xl">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="truncate">{farmer.address || 'No Address'}</span>
                  </div>

                  {farmer.accountNo && (
                    <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#111] border border-white/5 p-3 rounded-xl">
                      <FaUniversity className="text-amber-500" />
                      <span className="font-mono truncate">A/C: **** {farmer.accountNo.slice(-4)}</span>
                    </div>
                  )}
                </div>

                {/* 3. Action Buttons (Profile & Bill) */}
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 relative z-10">
                   {/* View Profile Button */}
                   <Link href={`/dashboard/farmers/${farmer._id}`} className="flex-1">
                      <button className="w-full bg-[#151515] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                        <FaUser /> View Profile
                      </button>
                   </Link>

                   {/* Create Bill Button */}
                   <Link href={`/dashboard/sales/new?farmerId=${farmer._id}`} className="flex-1">
                      <button className="w-full bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/20 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">
                        Bill <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                      </button>
                   </Link>
                </div>

              </motion.div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#0A0A0A] rounded-[2rem] border border-white/5 border-dashed">
               <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-gray-600 mb-4">
                 <FaSearch className="text-3xl" />
               </div>
               <p className="text-gray-400 text-lg">No farmers found matching "{searchInput}"</p>
               <button onClick={() => setSearchInput('')} className="mt-2 text-green-500 font-bold hover:underline">
                 Clear Search
               </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}