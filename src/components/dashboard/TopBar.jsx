'use client';

import { useSession } from 'next-auth/react';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';

export default function TopBar({ onMenuClick }) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Arthiya Ji";
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="h-20 bg-gray-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      
      {/* Left: Mobile Toggle & Date */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
        >
          <FaBars size={20} />
        </button>
        <div className="hidden md:block">
           <h2 className="text-white font-bold text-lg">Dashboard</h2>
           <p className="text-xs text-gray-400">{today}</p>
        </div>
      </div>

      {/* Center: Search (Optional) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search farmers, bills..." 
            className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-green-500 text-white placeholder-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <FaBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">{userName}</p>
            <p className="text-xs text-green-400">Pro Account</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/10">
            {userName.charAt(0)}
          </div>
        </div>
      </div>

    </header>
  );
}