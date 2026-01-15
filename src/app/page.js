'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { 
  FaLeaf, FaTractor, FaFileInvoiceDollar, FaChartLine, 
  FaHandHoldingUsd, FaUsers, FaArrowRight, FaStar, FaQuoteLeft 
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

// 1. Infinite Market Ticker
const MarketTicker = () => {
  const crops = [
    { name: "Wheat (Sharbati)", price: "₹2,125/qt", trend: "+1.2%" },
    { name: "Rice (Basmati)", price: "₹3,850/qt", trend: "+0.5%" },
    { name: "Maize (Hybrid)", price: "₹1,980/qt", trend: "-0.2%" },
    { name: "Mustard", price: "₹5,400/qt", trend: "+2.1%" },
    { name: "Cotton", price: "₹6,200/qt", trend: "+1.8%" },
    { name: "Soybean", price: "₹4,800/qt", trend: "-0.5%" },
    { name: "Gram (Chana)", price: "₹5,100/qt", trend: "+0.8%" },
  ];

  return (
    <div className="bg-green-900/20 border-y border-green-500/20 py-3 overflow-hidden flex backdrop-blur-md relative z-30">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10"></div>
      <motion.div 
        className="flex whitespace-nowrap gap-12"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...crops, ...crops, ...crops].map((crop, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-mono">
            <span className="text-gray-300 font-bold">{crop.name}:</span>
            <span className="text-white">{crop.price}</span>
            <span className={crop.trend.includes('+') ? "text-green-400" : "text-red-400"}>
              {crop.trend}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// 2. Loan Calculator Widget (Reusable)
const CalculatorWidget = ({ className }) => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(2); // 2% per month common in Mandis
  const [months, setMonths] = useState(6);

  const interest = (amount * rate * months) / 100;
  const total = parseInt(amount) + interest;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel p-6 rounded-3xl shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-black/90 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaHandHoldingUsd className="text-green-500" /> Loan Estimator
        </h3>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Live Calc</span>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2 text-gray-400">
            <span>Amount</span>
            <span className="text-white font-mono">₹{amount.toLocaleString()}</span>
          </div>
          <input 
            type="range" min="5000" max="500000" step="5000" 
            value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2 text-gray-400">
            <span>Interest Rate (Monthly)</span>
            <span className="text-white font-mono">{rate}%</span>
          </div>
          <input 
            type="range" min="0.5" max="5" step="0.1" 
            value={rate} onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2 text-gray-400">
            <span>Duration</span>
            <span className="text-white font-mono">{months} Months</span>
          </div>
          <input 
            type="range" min="1" max="24" step="1" 
            value={months} onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Interest Payable</span>
          <span>₹{interest.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-white">
          <span>Total Repayment</span>
          <span className="text-green-400">₹{total.toLocaleString()}</span>
        </div>
      </div>
      
      <button className="w-full mt-6 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
        Apply for Loan
      </button>
    </motion.div>
  );
};

// 3. Counter Animation Component
const AnimatedCounter = ({ from, to }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useSpring(from, { bounce: 0, duration: 2000 });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (inView) count.set(to);
  }, [inView, to, count]);

  useEffect(() => count.on("change", (latest) => setDisplay(Math.floor(latest))), [count]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
};


// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[110vh] flex items-center pt-20">
        
        {/* Animated Background */}
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/60 to-gray-950 z-10"></div>
          {/* Using a placeholder image - replace with actual high-res farm image */}
          <img 
            src="https://images.unsplash.com/photo-1605000797499-95a059e00b28?q=80&w=2072&auto=format&fit=crop" 
            alt="Indian Farm Field" 
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        <div className="container mx-auto px-6 z-20 relative grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="w-12 h-[1px] bg-green-500"></span>
              <span className="text-green-400 font-bold tracking-widest uppercase text-sm">Welcome to Kisaan Connect</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Mandi Management
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Empowering Arthiyas with automated billing, inventory tracking, and commission calculations. Join the digital revolution of Indian Agriculture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_rgba(34,197,94,0.4)] border border-green-500 transition-all flex items-center gap-3"
                >
                  Start Free Trial <FaArrowRight />
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white rounded-full font-bold text-lg transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Calculator (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block transform rotate-y-12 perspective-1000"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-[2rem] blur opacity-30 animate-pulse"></div>
              <CalculatorWidget className="relative" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. TICKER SECTION */}
      <MarketTicker />

      {/* 3. STATS SECTION */}
      <section className="py-20 bg-gray-950 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
            {[
              { label: "Active Farmers", val: 120, suffix: "+" },
              { label: "Daily Transactions", val: 5, suffix: "K+" },
              { label: "Partner Mandis", val: 5, suffix: "+" },
              { label: "Trust Score", val: 100, suffix: "%" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
                  <AnimatedCounter from={0} to={stat.val} />{stat.suffix}
                </div>
                <p className="text-green-500 font-medium uppercase text-xs tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="py-32 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the <span className="text-green-500">Modern Arthiya</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Replace your traditional 'Bahi Khata' with a secure, cloud-based ledger that goes wherever you go.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaFileInvoiceDollar, title: "Automated J-Forms", desc: "Generate professional J-Forms and Sale slips instantly. Auto-calculate commissions and taxes." },
              { icon: FaUsers, title: "Farmer Database", desc: "Maintain digital records of all your farmers including Aadhaar, bank details, and family history." },
              { icon: FaChartLine, title: "Profit Analytics", desc: "Visual dashboards showing your daily earnings, commission trends, and crop-wise sales analysis." },
              { icon: FaHandHoldingUsd, title: "Advance & Loans", desc: "Track money lent to farmers with interest calculators. Never lose track of a single rupee." },
              { icon: FaLeaf, title: "Inventory Mgmt", desc: "Keep track of stock in your warehouse. Get alerts when stock is low or aging." },
              { icon: FaTractor, title: "Mandi Integration", desc: "Seamlessly integrates with government Mandi APIs (eNAM) for reporting." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-gray-900 border border-white/5 p-8 rounded-3xl hover:bg-gray-800 transition-all hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.2)]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-green-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LOAN CALCULATOR (Mobile View) */}
      <section className="lg:hidden py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
           <div className="text-center mb-10">
             <h2 className="text-3xl font-bold mb-4">Plan Finances</h2>
             <p className="text-gray-400">Calculate interest and EMI on the go.</p>
           </div>
           <CalculatorWidget />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-gray-950 relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Arthiyas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Rajesh Kumar", loc: "Khanna Mandi, Punjab", text: "Since I started using Kisaan Connect, my paperwork time has reduced by 80%. The loan tracking feature is a lifesaver." },
              { name: "Vikram Singh", loc: "Azadpur Mandi, Delhi", text: "The automatic email receipts make me look very professional to my farmers. Highly recommended!" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white/5 p-8 rounded-2xl border border-white/5 relative"
              >
                <FaQuoteLeft className="text-4xl text-green-500/20 absolute top-6 right-6" />
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[1,2,3,4,5].map(s => <FaStar key={s} />)}
                </div>
                <p className="text-lg text-gray-300 italic mb-6">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-green-500 text-sm">{t.loc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white">
            Ready to Digitalize your Mandi?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the network of smart Arthiyas today. No credit card required for trial.
          </p>
          <Link href="/register">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="bg-white text-green-900 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-gray-100 transition-colors"
             >
               Get Started for Free
             </motion.button>
          </Link>
          <p className="mt-6 text-sm text-gray-500">Available on Web, Android, and iOS.</p>
        </div>
      </section>

    </div>
  );
}