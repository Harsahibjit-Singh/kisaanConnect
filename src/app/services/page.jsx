'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FaFileInvoice, FaChartPie, FaMobileAlt, FaShieldAlt, 
  FaCheck, FaCrown, FaBuilding, FaHandHoldingWater 
} from 'react-icons/fa';
import Link from 'next/link';

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Services() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    // FIX: Added ref={targetRef} here
    <div ref={targetRef} className="min-h-screen bg-gray-950 text-white font-sans pt-20 overflow-hidden">
      
      {/* 1. SERVICES HERO */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Solutions for the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Modern Arthiya
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            From gate entry to final settlement, we digitize every step of your Mandi operations.
          </motion.p>
        </div>
      </section>

      {/* 2. CORE SERVICES GRID */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVar}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: FaFileInvoice, 
                title: "Digital Bill-Forms", 
                desc: "Generate government-compliant Bill-Forms instantly. Auto-calculate commission, market fees, and taxes." 
              },
              { 
                icon: FaHandHoldingWater, 
                title: "Loan Management", 
                desc: "Track every rupee lent to farmers. Calculate simple/compound interest automatically and generate statements." 
              },
              { 
                icon: FaChartPie, 
                title: "Profit Analytics", 
                desc: "Real-time dashboard showing your daily profit, total sales volume, and top-performing crops." 
              },
              { 
                icon: FaMobileAlt, 
                title: "Mail Alertds", 
                desc: "Automatically send sale receipts and payment reminders to farmers via mails." 
              },
              { 
                icon: FaBuilding, 
                title: "Inventory Tracking", 
                desc: "Manage stock in your godown. Know exactly how many bags of Wheat or Paddy are unsold." 
              },
              { 
                icon: FaShieldAlt, 
                title: "Secure Cloud", 
                desc: "Your data is encrypted and backed up daily. Never lose your 'Bahi Khata' to fire or theft." 
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                variants={itemVar}
                whileHover={{ y: -10, borderColor: 'rgba(34, 197, 94, 0.5)' }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl transition-all hover:bg-white/10 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-2xl flex items-center justify-center text-2xl text-green-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <service.icon />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-green-400 transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. DEEP DIVE SECTION */}
      <section className="py-32 bg-gray-900/50">
        <div className="container mx-auto px-6 space-y-32">
          
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Eliminate Calculation Errors</h2>
              <p className="text-gray-400 text-lg mb-6">
                Manual calculation of commissions, labor charges (mazdoori), and taxes often leads to losses.
              </p>
              <ul className="space-y-4">
                {["Auto-commission logic", "Configurable Tax Rates", "Instant PDF Generation"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs"><FaCheck /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-20"></div>
              <img src="/services/mid_phone_photo.png" alt="Accounting" className="relative rounded-2xl border border-white/10 shadow-2xl z-10" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20"></div>
              <img src="/services/mid_farmer_handshake.png" alt="Farmer Handshake" className="relative rounded-2xl border border-white/10 shadow-2xl z-10" />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl font-bold mb-6">Build Trust with Farmers</h2>
              <p className="text-gray-400 text-lg mb-6">
                Farmers prefer Arthiyas who provide clear, printed receipts and transparent accounts.
              </p>
              <ul className="space-y-4">
                {[ "Detailed Ledger History", "Fair Interest Calculations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs"><FaCheck /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>
{/* 4. PRICING SECTION */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Choose a plan that fits your business size.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1 - Starter */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl relative flex flex-col">
              <h3 className="text-xl font-bold text-gray-400 mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-6">Free</div>
              <p className="text-sm text-gray-500 mb-8">Perfect for small agents just starting out.</p>
              <ul className="space-y-4 mb-8 text-sm text-gray-300 flex-grow">
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Up to 50 Farmers</li>
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Basic Sales Recording</li>
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Email Support</li>
              </ul>
              {/* LINK TO REGISTER */}
              <Link 
                href="/register" 
                className="block w-full text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-bold"
              >
                Get Started
              </Link>
            </div>

            {/* Plan 2 - Popular */}
            <div className="bg-gray-800 border border-green-500 p-8 rounded-3xl relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Arthiya Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">₹999<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <p className="text-sm text-gray-400 mb-8">For growing businesses managing high volume.</p>
              <ul className="space-y-4 mb-8 text-sm text-gray-200 flex-grow">
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Unlimited Farmers</li>
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Loan & Interest Calc</li>
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Mailing Integration</li>
                <li className="flex gap-2"><FaCheck className="text-green-500" /> Priority Support</li>
              </ul>
              {/* LINK TO REGISTER */}
              <Link 
                href="/contact" 
                className="block w-full text-center py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors font-bold shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Plan 3 - Enterprise */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl relative flex flex-col">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">Custom</div>
              <p className="text-sm text-gray-500 mb-8">For large Mandi associations.</p>
              <ul className="space-y-4 mb-8 text-sm text-gray-300 flex-grow">
                <li className="flex gap-2"><FaCrown className="text-purple-500" /> Multi-User Access</li>
                <li className="flex gap-2"><FaCrown className="text-purple-500" /> Custom API Integration</li>
                <li className="flex gap-2"><FaCrown className="text-purple-500" /> Dedicated Manager</li>
              </ul>
              {/* LINK TO CONTACT */}
              <Link 
                href="/contact" 
                className="block w-full text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-bold"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}