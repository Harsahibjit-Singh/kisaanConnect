// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { HiMenuAlt3, HiX } from 'react-icons/hi';
// import { FaUserCircle } from 'react-icons/fa';
// import { useSession } from 'next-auth/react';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const { data: session } = useSession();
//   const pathname = usePathname();

//   // Detect scroll to toggle glass effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'About', href: '/about' },
//     { name: 'Services', href: '/services' },
//     { name: 'Blog', href: '/blog' },
//     { name: 'FAQs', href: '/faqs' },
//     { name: 'Contact', href: '/contact' },
//   ];

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//         scrolled 
//           ? 'bg-gray-900/80 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10 py-3' 
//           : 'bg-transparent py-5'
//       }`}
//     >
//       <div className="container mx-auto px-6 flex justify-between items-center text-white">
        
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
//            <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
//              <span className="text-white text-lg">K</span>
//            </div>
//            <span>Kisaan<span className="text-green-400">Connect</span></span>
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden lg:flex items-center gap-8">
//           {navLinks.map((link) => (
//             <Link key={link.name} href={link.href} className="relative group py-2">
//               <span className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}`}>
//                 {link.name}
//               </span>
//               {/* Hover Underline Animation */}
//               <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform origin-left transition-transform duration-300 ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
//             </Link>
//           ))}
//         </div>

//         {/* Auth Buttons */}
//         <div className="hidden lg:flex items-center gap-4">
//           {session ? (
//             <Link href="/dashboard">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all"
//               >
//                 <FaUserCircle className="text-lg"/> Dashboard
//               </motion.button>
//             </Link>
//           ) : (
//             <>
//               <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
//                 Login
//               </Link>
//               <Link href="/register">
//                 <motion.button
//                    whileHover={{ scale: 1.05 }}
//                    whileTap={{ scale: 0.95 }}
//                    className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg"
//                 >
//                   Get Started
//                 </motion.button>
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Toggle Button */}
//         <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-2xl text-white p-2 focus:outline-none">
//           {isOpen ? <HiX /> : <HiMenuAlt3 />}
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: '100vh' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-gray-900 fixed inset-0 top-[60px] z-40 overflow-hidden"
//           >
//             <div className="flex flex-col p-8 gap-6 text-center">
//               {navLinks.map((link, i) => (
//                 <motion.div
//                   key={link.name}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.1 }}
//                 >
//                   <Link 
//                     href={link.href} 
//                     onClick={() => setIsOpen(false)} 
//                     className={`text-2xl font-bold ${pathname === link.href ? 'text-green-400' : 'text-white'}`}
//                   >
//                     {link.name}
//                   </Link>
//                 </motion.div>
//               ))}
               
//                <div className="w-full h-px bg-white/10 my-4"></div>

//                {session ? (
//                   <Link href="/dashboard" onClick={() => setIsOpen(false)}>
//                     <button className="w-full bg-green-500 py-4 rounded-xl text-xl font-bold text-white shadow-lg">
//                       Go to Dashboard
//                     </button>
//                   </Link>
//                ) : (
//                  <div className="flex flex-col gap-4">
//                   <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl text-gray-300">Login</Link>
//                   <Link href="/register" onClick={() => setIsOpen(false)}>
//                     <button className="w-full bg-white py-4 rounded-xl text-xl font-bold text-gray-900">
//                       Create Account
//                     </button>
//                   </Link>
//                  </div>
//                )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }







'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiLogout } from 'react-icons/hi';
import { FaUserCircle, FaCalculator, FaSeedling, FaMoneyBillWave, FaUsers } from 'react-icons/fa'; // Added specific icons if needed later
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Detect scroll to toggle glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 1. GUEST LINKS (Not Logged In) ---
  const guestLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // --- 2. USER LINKS (Logged In - Updated) ---
  const userLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Farmers', href: '/dashboard/farmers' },
    { name: 'Sales', href: '/dashboard/sales' },
    { name: 'Loans', href: '/dashboard/loans' },
    { name: 'Calculator', href: '/dashboard/loan-calculator' },
  ];

  // Decide which links to show
  const currentLinks = session ? userLinks : guestLinks;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/80 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center text-white">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
           <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
             <span className="text-white text-lg">K</span>
           </div>
           <span>Kisaan<span className="text-green-400">Connect</span></span>
        </Link>

        {/* --- DESKTOP LINKS --- */}
        <div className="hidden lg:flex items-center gap-8">
          {currentLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative group py-2">
              <span className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}`}>
                {link.name}
              </span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform origin-left transition-transform duration-300 ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
          ))}
        </div>

        {/* --- AUTH BUTTONS --- */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {/* Logout Button */}
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-300 hover:text-red-400 transition-colors text-sm font-semibold flex items-center gap-1"
              >
                <HiLogout className="text-lg" /> Logout
              </button>

              {/* My Profile Button (Replaces Dashboard button) */}
              <Link href="/myprofile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all"
                >
                  <FaUserCircle className="text-lg"/> My Profile
                </motion.button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register">
                <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-2xl text-white p-2 focus:outline-none">
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 fixed inset-0 top-[60px] z-40 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-center">
              {/* Dynamic Mobile Links */}
              {currentLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className={`text-2xl font-bold ${pathname === link.href ? 'text-green-400' : 'text-white'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
                
               <div className="w-full h-px bg-white/10 my-4"></div>

               {/* Mobile Auth Buttons */}
               {session ? (
                 <div className="flex flex-col gap-4">
                   <Link href="/myprofile" onClick={() => setIsOpen(false)}>
                     <button className="w-full bg-green-500 py-4 rounded-xl text-xl font-bold text-white shadow-lg flex justify-center items-center gap-2">
                       <FaUserCircle /> My Profile
                     </button>
                   </Link>
                   
                   <button 
                     onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                     className="w-full bg-red-500/10 border border-red-500/50 text-red-400 py-4 rounded-xl text-xl font-bold hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2"
                   >
                     <HiLogout /> Logout
                   </button>
                 </div>
               ) : (
                 <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl text-gray-300">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-white py-4 rounded-xl text-xl font-bold text-gray-900">
                      Create Account
                    </button>
                  </Link>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}