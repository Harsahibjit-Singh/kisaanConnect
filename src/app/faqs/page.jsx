'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaSearch, FaChevronDown, FaQuestionCircle, FaHeadset, FaEnvelopeOpenText } from 'react-icons/fa';

// --- FAQ DATA ---
const faqData = [
  {
    category: "General",
    questions: [
      {
        q: "What is Kisaan Connect?",
        a: "Kisaan Connect is a digital Mandi management platform designed for Arthiyas (Commission Agents). It automates billing, tracks farmer loans, manages inventory, and generates J-Forms compliant with government regulations."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We use industry-standard encryption (AES-256) to store your data. Daily backups ensure that your 'Bahi Khata' is never lost, even if you lose your phone or laptop."
      },
      {
        q: "Do I need a computer to use it?",
        a: "No! Kisaan Connect is fully responsive and works perfectly on smartphones and tablets. You can generate bills and check balances right from the Mandi floor."
      }
    ]
  },
  {
    category: "Billing & Finance",
    questions: [
      {
        q: "Does it calculate interest automatically?",
        a: "Yes. Our Loan Management module calculates simple or compound interest based on the rate you set for each farmer. You can generate a statement at any time."
      },
      {
        q: "Can I print the sale receipts?",
        a: "Yes. The system generates professional PDF receipts that you can print using any standard thermal or laser printer. You can also share them directly via WhatsApp."
      },
      {
        q: "How is the commission calculated?",
        a: "You can set your default commission rate (e.g., 2.5%) in the settings. The system automatically applies this to every sale entry, along with Mandi tax and labor charges."
      }
    ]
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "Can I add my staff members?",
        a: "Yes. The 'Arthiya Pro' and 'Enterprise' plans allow you to add sub-users (Munims) with restricted permissions so they can enter data without seeing sensitive profit reports."
      },
      {
        q: "What happens if I stop paying?",
        a: "Your data remains safe with us for 1 year. You will be switched to a 'Read-Only' mode where you can view old records but cannot add new entries until you renew."
      }
    ]
  }
];

// --- ACCORDION COMPONENT ---
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div 
      initial={false}
      className={`border border-white/10 rounded-2xl overflow-hidden mb-4 transition-colors ${isOpen ? 'bg-white/5 border-green-500/50' : 'bg-gray-900'}`}
    >
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className={`text-lg font-bold ${isOpen ? 'text-green-400' : 'text-gray-200'}`}>{question}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <FaChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQs() {
  const [activeTab, setActiveTab] = useState("General");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // Filter Logic
  const filteredFAQs = faqData
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(cat => cat.questions.length > 0);

  // If searching, show all matching categories. If not, show only active tab.
  const displayData = searchTerm ? filteredFAQs : filteredFAQs.filter(cat => cat.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pt-24 pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="container mx-auto px-6 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 text-3xl mb-6 border border-green-500/20"
        >
          <FaQuestionCircle />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Questions</span>
        </motion.h1>
        
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative flex items-center bg-gray-900 border border-white/10 rounded-full px-6 py-4 shadow-xl">
            <FaSearch className="text-gray-500 mr-4 text-lg" />
            <input 
              type="text" 
              placeholder="Search for answers (e.g., 'billing', 'loan')..." 
              className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* 2. CATEGORY TABS (Hidden if Searching) */}
      {!searchTerm && (
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {faqData.map((cat) => (
              <button
                key={cat.category}
                onClick={() => { setActiveTab(cat.category); setOpenIndex(null); }}
                className={`px-6 py-3 rounded-full font-bold transition-all border ${
                  activeTab === cat.category 
                    ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                    : 'bg-gray-900 border-white/10 text-gray-400 hover:border-green-500/50 hover:text-white'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. FAQ LIST */}
      <div className="container mx-auto px-6 max-w-3xl">
        {displayData.length > 0 ? (
          displayData.map((cat, catIndex) => (
            <div key={cat.category} className="mb-12">
              {searchTerm && <h3 className="text-xl font-bold text-green-400 mb-6 border-b border-white/10 pb-2">{cat.category}</h3>}
              
              {cat.questions.map((item, index) => {
                // Unique ID for each item to handle opening logic correctly across categories
                const itemKey = `${cat.category}-${index}`; 
                return (
                  <AccordionItem 
                    key={itemKey}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === itemKey}
                    onClick={() => setOpenIndex(openIndex === itemKey ? null : itemKey)}
                  />
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-white/5">
             <p className="text-gray-400 text-lg">No results found for "{searchTerm}"</p>
             <button onClick={() => setSearchTerm("")} className="mt-4 text-green-400 font-bold hover:underline">Clear Search</button>
          </div>
        )}
      </div>

      {/* 4. CONTACT CTA */}
      <section className="container mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-3xl font-bold mb-6 relative z-10">Still have questions?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
            Can’t find the answer you’re looking for? Our support team is here to help you get started.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link href="/contact">
              <button className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
                <FaEnvelopeOpenText /> Contact Support
              </button>
            </Link>
            <Link href="/contact">
              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all">
                <FaHeadset /> +91 8869006197
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}