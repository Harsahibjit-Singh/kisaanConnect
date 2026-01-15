'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(2); // default 2% per month
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseFloat(months);
    if (!p || !r || !t) return;
    
    const interest = (p * r * t) / 100;
    const total = p + interest;
    setResult({ interest, total });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-500">Loan Interest Calculator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Principal Amount (₹)</label>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-[#151515] p-3 rounded-xl border border-white/10 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Interest Rate (% per month)</label>
            <input type="number" value={rate} onChange={e=>setRate(e.target.value)} className="w-full bg-[#151515] p-3 rounded-xl border border-white/10 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Duration (Months)</label>
            <input type="number" value={months} onChange={e=>setMonths(e.target.value)} className="w-full bg-[#151515] p-3 rounded-xl border border-white/10 text-white" />
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={calculate}
            className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold text-lg mt-4"
          >
            Calculate
          </motion.button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total Interest:</span>
              <span className="font-bold text-green-400">₹ {result.interest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-white">Total Repayment:</span>
              <span className="font-bold text-white text-xl">₹ {result.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}