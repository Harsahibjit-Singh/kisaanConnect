'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaWeightHanging, FaRupeeSign, FaCalculator, FaCheckCircle, 
  FaSpinner, FaArrowLeft, FaTimes, FaLeaf, FaDownload, FaPercentage, FaMoneyBillWave, FaExclamationCircle, FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function NewSale() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedFarmerId = searchParams.get('farmerId');

  // --- STATE ---
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  
  // Loans State
  const [activeLoans, setActiveLoans] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0);

  const [saleData, setSaleData] = useState({
    cropType: 'Wheat',
    quantity: '',
    price: '',
  });

  // Configurable Settings
  const [commissionRate, setCommissionRate] = useState(2.5); 
  const [deductionAmount, setDeductionAmount] = useState(''); 

  const [calculated, setCalculated] = useState({
    grossAmount: 0,
    commissionAmount: 0,
    netBeforeLoan: 0,
    finalPayable: 0,
    loanDed: 0
  });

  const [status, setStatus] = useState('idle');
  const [lastSaleSnapshot, setLastSaleSnapshot] = useState(null);

  // --- TOAST STATE ---
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- 1. LOAD FARMERS ---
  useEffect(() => {
    async function loadFarmers() {
      try {
        const res = await fetch('/api/farmers');
        const data = await res.json();
        setFarmers(data);
        if (preSelectedFarmerId) {
          const preSelected = data.find(f => f._id === preSelectedFarmerId);
          if (preSelected) selectFarmer(preSelected);
        }
      } catch (e) { console.error("Error loading farmers:", e); }
    }
    loadFarmers();
  }, [preSelectedFarmerId]);

  // --- 2. FETCH LOANS ---
  const fetchFarmerLoans = async (farmerId) => {
    try {
      const res = await fetch(`/api/loans?farmerId=${farmerId}&status=Pending`);
      if(res.ok) {
        const loans = await res.json();
        
        // Safety Filter
        const myLoans = loans.filter(l => (l.farmerId?._id === farmerId) || (l.farmerId === farmerId));
        setActiveLoans(myLoans);
        
        // Calc Debt
        let debtSum = 0;
        const today = new Date();
        
        myLoans.forEach(loan => {
           const startDate = new Date(loan.date);
           const diffTime = Math.abs(today - startDate);
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
           const diffMonths = Math.max((diffDays / 30), 0.1); 
           
           const principal = parseFloat(loan.amount) || 0;
           const rate = parseFloat(loan.interestRate) || 0;
           const interest = (principal * rate * diffMonths) / 100;
           
           debtSum += (principal + interest);
        });
        setTotalDebt(Math.round(debtSum));
      }
    } catch (error) {
      console.error("Failed to load loans");
    }
  };

  // --- 3. MAIN CALCULATOR ---
  useEffect(() => {
    const qty = parseFloat(saleData.quantity) || 0;
    const price = parseFloat(saleData.price) || 0;
    const grossAmount = qty * price;
    
    const commRate = parseFloat(commissionRate) || 0;
    const commissionAmount = (grossAmount * commRate) / 100;
    
    const netBeforeLoan = grossAmount - commissionAmount;

    let loanDed = parseFloat(deductionAmount) || 0;
    if (loanDed > netBeforeLoan) loanDed = netBeforeLoan;

    const finalPayable = netBeforeLoan - loanDed;

    setCalculated({ 
      grossAmount, 
      commissionAmount, 
      netBeforeLoan, 
      loanDed, 
      finalPayable 
    });
  }, [saleData, commissionRate, deductionAmount, totalDebt]);

  const selectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setSearchQuery(farmer.name);
    setShowDropdown(false);
    setTotalDebt(0);
    setActiveLoans([]);
    setDeductionAmount('');
    fetchFarmerLoans(farmer._id);
  };

  // --- 4. PDF GENERATOR ---
  const generatePDF = (returnBase64 = false, dataSnapshot = null) => {
    try {
      const farmer = dataSnapshot?.farmer || selectedFarmer;
      const sale = dataSnapshot?.sale || saleData;
      const calc = dataSnapshot?.calc || calculated;
      const commRate = dataSnapshot?.commRate || commissionRate;

      if (!farmer) throw new Error("Missing farmer data");

      const doc = new jsPDF();

      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("KISAAN CONNECT MANDI", 105, 20, null, null, "center");
      doc.setFontSize(12);
      doc.text("Sale Settlement Receipt", 105, 30, null, null, "center");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 55);
      doc.text(`Farmer: ${farmer.name}`, 15, 65);
      
      const bodyData = [
        ['Crop Type', sale.cropType],
        ['Quantity', `${sale.quantity} Qt`],
        ['Rate', `Rs. ${sale.price} / Qt`],
        ['Gross Amount', `Rs. ${calc.grossAmount.toLocaleString()}`],
        [`Commission (${commRate}%)`, `- Rs. ${calc.commissionAmount.toLocaleString()}`]
      ];

      if (calc.loanDed > 0) {
        bodyData.push(['Loan Recovery', `- Rs. ${calc.loanDed.toLocaleString()}`]);
      }

      bodyData.push(['NET PAYABLE', `Rs. ${calc.finalPayable.toLocaleString()}`]);

      autoTable(doc, {
        startY: 85,
        head: [['Description', 'Value']],
        body: bodyData,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        foot: [['', '']], 
      });

      const finalY = doc.lastAutoTable?.finalY || 150;
      doc.setFontSize(10);
      doc.text("Authorized Signature", 160, finalY + 40, null, null, "center");
      doc.line(140, finalY + 35, 180, finalY + 35);

      if (returnBase64) return doc.output('datauristring');
      doc.save(`${farmer.name}_Receipt.pdf`);
    } catch (err) {
      showNotification("PDF Error: " + err.message, "error");
    }
  };

  // --- 5. SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFarmer) {
        showNotification("Please select a farmer.", "error");
        return;
    }
    setStatus('loading');

    try {
      const pdfString = generatePDF(true);

      const payload = {
        farmerId: selectedFarmer._id,
        cropType: saleData.cropType,
        quantity: parseFloat(saleData.quantity),
        price: parseFloat(saleData.price),
        commissionRate: parseFloat(commissionRate),
        commissionAmount: calculated.commissionAmount,
        deductedLoanAmount: calculated.loanDed, 
        totalAmount: calculated.finalPayable,
        pdfData: pdfString 
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setLastSaleSnapshot({
          farmer: selectedFarmer,
          sale: saleData,
          calc: calculated,
          commRate: commissionRate
        });
        setStatus('success');
      } else {
        const err = await res.json();
        showNotification("Error: " + err.error, "error");
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      showNotification("Submission failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex justify-center">
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl border ${
              showToast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {showToast.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
              <span className="font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl grid lg:grid-cols-3 gap-8">
        
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden z-20 shadow-2xl">
          
          <div className="flex items-center gap-4 mb-8">
             <Link href="/dashboard"><button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><FaArrowLeft /></button></Link>
             <h1 className="text-2xl font-bold">New Sale Entry</h1>
          </div>

          {/* SUCCESS MODAL OVERLAY */}
          <AnimatePresence>
            {status === 'success' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[100] bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center rounded-[2rem] text-center p-8">
                  {/* Glow Effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1, rotate: 360 }} 
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                  >
                    <FaCheckCircle className="text-5xl text-black" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">Transaction Complete!</h2>
                  <p className="text-gray-400 mb-8 max-w-md">
                    {calculated.loanDed > 0 ? `Loan of ₹${calculated.loanDed.toLocaleString()} recovered successfully.` : 'Sale recorded and receipt generated.'}
                  </p>
                  
                  <div className="flex gap-4">
                    <button onClick={() => generatePDF(false, lastSaleSnapshot)} className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all hover:scale-105">
                      <FaDownload /> Download PDF
                    </button>
                    <Link href="/dashboard">
                      <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">Dashboard</button>
                    </Link>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Farmer Search */}
            <div className="relative z-50">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Select Farmer</label>
               <div className="relative group">
                 <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                 <input 
                   type="text" 
                   value={searchQuery} 
                   onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); setSelectedFarmer(null); }} 
                   onFocus={() => setShowDropdown(true)} 
                   className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white focus:outline-none focus:border-green-500 focus:bg-black font-bold text-lg transition-all placeholder:font-normal" 
                   placeholder="Search Farmer Name..." 
                   required 
                 />
                 {searchQuery && <button type="button" onClick={() => { setSearchQuery(''); setSelectedFarmer(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><FaTimes /></button>}
               </div>
               
               <AnimatePresence>
                 {showDropdown && searchQuery && !selectedFarmer && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
                     {farmers.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(farmer => (
                       <div key={farmer._id} onClick={() => selectFarmer(farmer)} className="p-4 hover:bg-green-600 hover:text-white cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center transition-colors">
                         <span className="font-bold">{farmer.name}</span>
                         <span className="text-xs bg-white/10 px-2 py-1 rounded">{farmer.phone}</span>
                       </div>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Crop Details */}
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Crop Type</label>
                 <div className="relative group">
                   <FaLeaf className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                   <select value={saleData.cropType} onChange={(e) => setSaleData({...saleData, cropType: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-green-500 focus:bg-black transition-all appearance-none cursor-pointer">
                     <option>Wheat</option><option>Paddy</option><option>Mustard</option><option>Maize</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quantity (Qt)</label>
                 <div className="relative group">
                   <FaWeightHanging className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                   <input type="number" placeholder="0.00" required value={saleData.quantity} onChange={(e) => setSaleData({...saleData, quantity: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 text-white focus:outline-none focus:border-green-500 focus:bg-black font-mono text-lg transition-all" />
                 </div>
               </div>
            </div>

            {/* Price & Commission */}
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Rate (₹/Qt)</label>
                 <div className="relative group">
                   <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                   <input type="number" placeholder="2250" required value={saleData.price} onChange={(e) => setSaleData({...saleData, price: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 text-white focus:outline-none focus:border-green-500 focus:bg-black font-mono text-xl font-bold transition-all" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Commission (%)</label>
                 <div className="relative group">
                   <FaPercentage className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                   <input type="number" step="0.1" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-12 text-white focus:outline-none focus:border-green-500 focus:bg-black font-mono text-lg transition-all" />
                 </div>
               </div>
            </div>

            {/* --- LOAN DEDUCTION SECTION --- */}
            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mt-4 relative overflow-hidden group">
               <div className="flex justify-between items-center mb-4 relative z-10">
                 <h3 className="text-red-400 font-bold flex items-center gap-2"><FaExclamationCircle /> Loan Recovery</h3>
                 <span className="text-xs text-gray-300 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full font-mono">
                   Total Debt: ₹{totalDebt.toLocaleString()}
                 </span>
               </div>
               
               <div className="relative z-10">
                 <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
                 <input 
                   type="number" 
                   placeholder="Enter amount to deduct" 
                   value={deductionAmount}
                   max={calculated.netBeforeLoan}
                   onChange={(e) => setDeductionAmount(e.target.value)}
                   className="w-full bg-black/40 border border-red-500/30 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 font-mono text-lg transition-all placeholder:text-gray-600" 
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                   Max: ₹{Math.min(calculated.netBeforeLoan, totalDebt).toLocaleString()}
                 </div>
               </div>
            </div>

            <button type="submit" disabled={status === 'loading'} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 mt-8 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {status === 'loading' ? <FaSpinner className="animate-spin" /> : 'Confirm & Generate Bill'}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE CALCULATOR */}
        <div className="lg:col-span-1">
           <div className="sticky top-40 bg-[#111] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                 <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-green-400"><FaCalculator /></div>
                 <h3 className="text-xl font-bold text-white">Summary</h3>
              </div>
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between text-gray-400"><span>Gross Amount</span><span className="text-white font-mono font-bold">₹{calculated.grossAmount.toLocaleString()}</span></div>
                 <div className="flex justify-between text-gray-400"><span>Commission ({commissionRate}%)</span><span className="text-red-400 font-mono">- ₹{calculated.commissionAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
                 
                 {calculated.loanDed > 0 && (
                   <div className="flex justify-between text-gray-400 pb-2 border-b border-white/5">
                     <span>Loan Deduction</span>
                     <span className="text-red-500 font-mono font-bold">- ₹{calculated.loanDed.toLocaleString()}</span>
                   </div>
                 )}

                 <div className="pt-4 border-t border-white/5">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Net Payable to Farmer</p>
                    <p className="text-4xl font-extrabold text-green-400 font-mono tracking-tight">₹{calculated.finalPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                 </div>
              </div>
           </div>
        </div>

      </motion.div>
    </div>
  );
}