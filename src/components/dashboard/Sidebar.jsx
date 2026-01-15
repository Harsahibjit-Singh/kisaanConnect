'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaUserFriends, FaFileInvoiceDollar, FaHandHoldingUsd, 
  FaTimes, FaLeaf, FaCog, FaSignOutAlt 
} from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', icon: FaHome, href: '/dashboard' },
  { name: 'Farmers', icon: FaUserFriends, href: '/dashboard/farmers' },
  { name: 'Sales & Bills', icon: FaFileInvoiceDollar, href: '/dashboard/sales' },
  { name: 'Loans', icon: FaHandHoldingUsd, href: '/dashboard/loans' },
  { name: 'Inventory', icon: FaLeaf, href: '/dashboard/inventory' }, // Optional placeholder
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        // Force 'open' state on desktop (md and up) by overriding variants via CSS or simple conditional logic
        className={`fixed md:relative inset-y-0 left-0 w-72 bg-gray-900 border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          // This tailwind class handles the desktop visibility override
          'md:translate-x-0 md:opacity-100'
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">K</span>
            </div>
            <span>Kisaan<span className="text-green-400">Connect</span></span>
          </Link>
          {/* Mobile Close Button */}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-600/20 to-green-600/10 text-green-400' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>
                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"
                    />
                  )}
                  
                  <item.icon className={`text-xl ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Logout Section */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FaSignOutAlt />
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}