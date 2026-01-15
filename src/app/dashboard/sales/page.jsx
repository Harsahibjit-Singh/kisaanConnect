'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaFilter, FaSpinner, 
  FaDownload, FaLeaf, FaRupeeSign, FaCalendarAlt, FaFileAlt, FaTimes 
} from 'react-icons/fa';

// PDF Libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVar = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- UNIFIED SEARCH STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // --- 1. FETCH SALES DATA ---
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/sales');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSales(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  // --- 2. ROBUST FILTER LOGIC ---
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const farmerName = (sale.farmerId?.name || '').toLowerCase();
      const cropName = (sale.cropType || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase().trim();
      
      const matchesSearch = farmerName.includes(searchLower) || cropName.includes(searchLower);
      const matchesType = filterType === 'All' || sale.cropType === filterType;

      return matchesSearch && matchesType;
    });
  }, [sales, searchTerm, filterType]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('All');
  };

  // --- 3. FORMAL PDF GENERATION ---
  const downloadReceipt = (sale) => {
    try {
      const doc = new jsPDF();
      
      // -- CONSTANTS --
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      const primaryColor = [22, 101, 52]; // Dark Green (#166534)
      const grayColor = [100, 100, 100];

      // -- BORDER --
      doc.setDrawColor(200, 200, 200);
      doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.height - 10);

      // -- HEADER --
      // Company Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...primaryColor);
      doc.text("KISAAN CONNECT MANDI", pageWidth / 2, 20, { align: "center" });

      // Sub-header / Address
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...grayColor);
      doc.text("Sector 17, Chandigarh, India - 160017", pageWidth / 2, 26, { align: "center" });
      doc.text("Reg No: KC-MANDI-2025 | Phone: +91 8869006197", pageWidth / 2, 31, { align: "center" });
      
      // Divider Line
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(margin, 35, pageWidth - margin, 35);

      // -- TITLE --
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("SALE CONFIRMATION RECEIPT", pageWidth / 2, 45, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("(Form J - Duplicate)", pageWidth / 2, 50, { align: "center" });

      // -- RECEIPT META (Right Side) --
      const dateStr = new Date(sale.date).toLocaleDateString();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Receipt No:`, pageWidth - margin - 50, 60);
      doc.text(`Date:`, pageWidth - margin - 50, 66);
      
      doc.setFont("helvetica", "normal");
      doc.text(sale._id.slice(-8).toUpperCase(), pageWidth - margin, 60, { align: "right" });
      doc.text(dateStr, pageWidth - margin, 66, { align: "right" });

      // -- FARMER DETAILS (Left Side) --
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, 55, 90, 25, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...grayColor);
      doc.text("SOLD BY (FARMER):", margin + 5, 62);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text((sale.farmerId?.name || 'Unknown Farmer').toUpperCase(), margin + 5, 68);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Phone: ${sale.farmerId?.phone || 'N/A'}`, margin + 5, 74);

      // -- TABLE --
      const tableColumn = ["Item Description", "Quantity (Qt)", "Rate (Rs/Qt)", "Amount (Rs)"];
      const tableRows = [
        [
          `${sale.cropType} Crop - Grade A`,
          `${sale.quantity.toFixed(2)}`,
          `${sale.price.toFixed(2)}`,
          `${sale.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        ]
      ];

      autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: { 
          fillColor: primaryColor, 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center' 
        },
        bodyStyles: { 
          textColor: [50, 50, 50],
          halign: 'center',
          cellPadding: 4 
        },
        columnStyles: {
          0: { halign: 'left' }, // Description aligned left
          3: { halign: 'right' } // Amount aligned right
        },
        styles: { lineColor: [200, 200, 200], lineWidth: 0.1 },
      });

      // -- FINANCIAL SUMMARY --
      const finalY = doc.lastAutoTable.finalY + 10;
      const rightColX = pageWidth - margin - 50;
      
      // Helper for summary rows
      const addSummaryRow = (label, value, isBold = false) => {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(isBold ? 11 : 10);
        doc.text(label, rightColX, doc.lastAutoTable.finalY + offset);
        doc.text(value, pageWidth - margin, doc.lastAutoTable.finalY + offset, { align: "right" });
      };

      let offset = 10;
      doc.line(pageWidth / 2, finalY - 5, pageWidth - margin, finalY - 5); // Separator

      addSummaryRow("Sub Total:", `Rs. ${sale.totalAmount.toLocaleString()}`);
      offset += 6;
      addSummaryRow("Mandi Fee (Tax):", "Rs. 0.00");
      offset += 6;
      addSummaryRow("Commission:", `Rs. ${sale.commission.toLocaleString()}`);
      offset += 8;
      
      // Total Highlight
      doc.setFillColor(240, 253, 244); // Light Green bg
      doc.rect(rightColX - 5, doc.lastAutoTable.finalY + offset - 5, 60, 10, 'F');
      doc.setTextColor(...primaryColor);
      addSummaryRow("TOTAL PAYABLE:", `Rs. ${sale.totalAmount.toLocaleString()}`, true);

      // -- AMOUNT IN WORDS --
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      // Simple logic just for display, normally you'd use a library for this
      doc.text(`* Amount includes calculated values based on rate and quantity.`, margin, finalY + 10);

      // -- FOOTER --
      const footerY = doc.internal.pageSize.height - 40;
      
      // Terms
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text("Terms & Conditions:", margin, footerY);
      doc.setFont("helvetica", "normal");
      doc.text("1. This is a computer generated receipt.", margin, footerY + 5);
      doc.text("2. Any discrepancies must be reported within 24 hours.", margin, footerY + 9);
      doc.text("3. Subject to Chandigarh Jurisdiction.", margin, footerY + 13);

      // Signatures
      doc.setFont("helvetica", "bold");
      doc.text("For Kisaan Connect Mandi", pageWidth - margin - 10, footerY, { align: "right" });
      
      // Placeholder Signature Line
      doc.setDrawColor(0, 0, 0);
      doc.line(pageWidth - margin - 40, footerY + 20, pageWidth - margin, footerY + 20);
      doc.setFont("helvetica", "normal");
      doc.text("Authorized Signatory", pageWidth - margin - 10, footerY + 25, { align: "right" });

      // Save
      doc.save(`JForm_${sale._id.slice(-6)}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    }
  };

  // --- 4. COMBINED REPORT (Slightly improved) ---
  const downloadCombinedReport = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(22, 101, 52);
      doc.text("SALES SUMMARY REPORT", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Criteria: ${filterType === 'All' ? 'All Crops' : filterType} | Search: "${searchTerm}"`, 14, 34);

      const tableRows = filteredSales.map(sale => [
        new Date(sale.date).toLocaleDateString(),
        sale.farmerId?.name || 'Unknown',
        sale.cropType,
        `${sale.quantity} Qt`,
        `Rs. ${sale.price}`,
        `Rs. ${sale.totalAmount.toLocaleString()}`
      ]);

      const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);

      autoTable(doc, {
        startY: 40,
        head: [['Date', 'Farmer', 'Crop', 'Qty', 'Rate', 'Total']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [22, 101, 52] },
        foot: [['', '', '', '', 'Grand Total:', `Rs. ${totalRevenue.toLocaleString()}`]],
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
      });

      doc.save(`Sales_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      alert("Error generating report");
    }
  };

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
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Sales Ledger</h1>
            <p className="text-gray-400">
              Total Transactions: <span className="text-green-400 font-bold">{filteredSales.length}</span>
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/dashboard/sales/new">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus /> New Entry
              </motion.button>
            </Link>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 mb-8 flex flex-col xl:flex-row gap-4 items-center justify-between">
          
          {/* SEARCH & FILTER GROUP */}
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-2/3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search Farmer or Crop..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={clearFilters}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-white/10 p-1 rounded-full"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>

            {/* Dropdown Filter */}
            <div className="relative w-full md:w-48">
               <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
               <select 
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="w-full bg-[#151515] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-green-500 cursor-pointer"
               >
                 <option value="All">All Crops</option>
                 <option value="Wheat">Wheat</option>
                 <option value="Paddy">Paddy</option>
                 <option value="Mustard">Mustard</option>
                 <option value="Maize">Maize</option>
               </select>
            </div>
          </div>

          {/* Download Report Button */}
          <button 
            onClick={downloadCombinedReport}
            className="w-full xl:w-auto bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <FaFileAlt /> Download Report
          </button>
        </div>

        {/* --- DATA TABLE --- */}
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
                  <th className="p-6">Date</th>
                  <th className="p-6">Farmer</th>
                  <th className="p-6">Crop Info</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <AnimatePresence mode="popLayout">
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <motion.tr 
                        key={sale._id}
                        variants={rowVar}
                        exit="exit"
                        layout
                        className="hover:bg-white/5 transition-colors group"
                      >
                        {/* Date */}
                        <td className="p-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-400">
                             <FaCalendarAlt />
                             <span>{new Date(sale.date).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* Farmer */}
                        <td className="p-6">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs text-white border border-white/10">
                               {sale.farmerId?.name?.charAt(0) || "U"}
                             </div>
                             <div>
                               <p className="font-bold text-white text-sm">{sale.farmerId?.name || "Unknown"}</p>
                               <p className="text-[10px] text-gray-500">{sale.farmerId?.phone || "No Phone"}</p>
                             </div>
                           </div>
                        </td>

                        {/* Crop */}
                        <td className="p-6">
                           <div className="flex flex-col">
                             <span className="flex items-center gap-2 text-white font-medium text-sm">
                               <FaLeaf className="text-green-500 text-xs" /> {sale.cropType}
                             </span>
                             <span className="text-xs text-gray-500">{sale.quantity} Qt @ ₹{sale.price}</span>
                           </div>
                        </td>

                        {/* Amount */}
                        <td className="p-6">
                           <div className="flex items-center gap-1 font-mono font-bold text-green-400">
                              <FaRupeeSign className="text-xs" />
                              {sale.totalAmount.toLocaleString()}
                           </div>
                        </td>

                        {/* Download Action */}
                        <td className="p-6 text-center">
                           <button 
                             onClick={() => downloadReceipt(sale)}
                             className="p-2 rounded-lg bg-white/5 hover:bg-green-500 hover:text-white text-gray-400 transition-all tooltip"
                             title="Download Receipt"
                           >
                             <FaDownload />
                           </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    // EMPTY STATE
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                             <p>No records found matching your criteria.</p>
                             {(searchTerm || filterType !== 'All') && (
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