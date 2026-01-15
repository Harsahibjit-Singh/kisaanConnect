// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
//   PieChart, Pie, Cell, Legend 
// } from 'recharts';
// import { 
//   FaRupeeSign, FaUserFriends, FaShoppingBag, 
//   FaPlus, FaCloudSun, FaLeaf, FaTractor, FaSpinner 
// } from 'react-icons/fa';
// import Link from 'next/link';

// // --- COLORS & VARIANTS ---
// const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

// const containerVar = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
// };

// const itemVar = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 }
// };

// export default function DashboardHome() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({ sales: 0, farmers: 0, commission: 0, loans: 0 });
//   const [salesChartData, setSalesChartData] = useState([]);
//   const [cropChartData, setCropChartData] = useState([]);
//   const [recentSales, setRecentSales] = useState([]);

//   // --- 1. FETCH REAL DATA ---
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [salesRes, farmersRes, loansRes] = await Promise.all([
//           fetch('/api/sales'),
//           fetch('/api/farmers'),
//           fetch('/api/loans')
//         ]);
        
//         const sales = await salesRes.json();
//         const farmers = await farmersRes.json();
//         const loans = await loansRes.json();

//         // --- 2. CALCULATE STATS ---
//         setStats({
//           sales: sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
//           farmers: farmers.length,
//           commission: sales.reduce((acc, curr) => acc + (curr.commission || 0), 0),
//           // Sum only 'Pending' loans
//           loans: loans.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
//         });

//         setRecentSales(sales.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));

//         // --- 3. PROCESS CHART DATA (Sales per Day) ---
//         const last7DaysMap = {};
//         for (let i = 6; i >= 0; i--) {
//           const d = new Date();
//           d.setDate(d.getDate() - i);
//           // Format: "Mon", "Tue" etc.
//           const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' }); 
//           last7DaysMap[dayName] = 0;
//         }

//         sales.forEach(sale => {
//           const d = new Date(sale.date);
//           const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
//           if (last7DaysMap[dayName] !== undefined) {
//             last7DaysMap[dayName] += sale.totalAmount;
//           }
//         });

//         setSalesChartData(Object.keys(last7DaysMap).map(key => ({
//           name: key,
//           sales: last7DaysMap[key]
//         })));

//         // --- 4. PROCESS PIE CHART (Crop Distribution) ---
//         const cropMap = {};
//         sales.forEach(sale => {
//           cropMap[sale.cropType] = (cropMap[sale.cropType] || 0) + sale.quantity;
//         });

//         setCropChartData(Object.keys(cropMap).map(key => ({
//           name: key,
//           value: cropMap[key]
//         })));

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error loading dashboard data:", error);
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

//   if (isLoading) {
//     return (
//       <div className="flex h-[80vh] w-full items-center justify-center bg-black">
//         <FaSpinner className="animate-spin text-4xl text-green-500" />
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       variants={containerVar}
//       initial="hidden"
//       animate="visible"
//       className="space-y-8 bg-black min-h-full p-2" // Ensure background is black
//     >
      
//       {/* 1. HERO BANNER */}
//       <motion.div 
//         variants={itemVar}
//         className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl group border border-white/5"
//       >
//         <div className="absolute inset-0 bg-[#050505]">
//           <img 
//             src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2071&auto=format&fit=crop" 
//             alt="Farm Landscape" 
//             className="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
//         </div>

//         <div className="absolute inset-0 p-8 flex flex-col md:flex-row justify-between items-end md:items-center z-10">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-3 backdrop-blur-md">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//               Live Market Data
//             </div>
//             <h1 className="text-4xl font-extrabold text-white mb-2">
//               Dashboard
//             </h1>
//             <p className="text-gray-400 text-lg max-w-lg">
//               Overview of your sales, farmers, and daily commission.
//             </p>
//             <div className="mt-6 flex gap-4">
//                <Link href="/dashboard/sales/new">
//                  <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all">
//                     <FaPlus /> New Sale
//                  </button>
//                </Link>
//             </div>
//           </div>

//           <div className="hidden md:block bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-white min-w-[180px]">
//             <div className="flex items-center gap-3 mb-2">
//                <FaCloudSun className="text-yellow-400 text-3xl" />
//                <div>
//                  <p className="text-2xl font-bold">28°C</p>
//                  <p className="text-xs text-gray-400">Chandigarh, IN</p>
//                </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>


//       {/* 2. GLOWING STAT CARDS (Darkest BG) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { title: 'Total Sales', value: formatCurrency(stats.sales), icon: FaRupeeSign, color: 'text-green-500' },
//           { title: 'Farmers', value: stats.farmers, icon: FaUserFriends, color: 'text-blue-500' },
//           { title: 'Commission', value: formatCurrency(stats.commission), icon: FaShoppingBag, color: 'text-amber-500' },
//           { title: 'Pending Loans', value: formatCurrency(stats.loans), icon: FaTractor, color: 'text-pink-500' },
//         ].map((stat, i) => (
//           <motion.div 
//             key={i}
//             variants={itemVar}
//             whileHover={{ y: -5 }}
//             className="relative bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl overflow-hidden group hover:border-white/10 transition-colors"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className={`w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center ${stat.color} text-xl border border-white/5 shadow-inner`}>
//                 <stat.icon />
//               </div>
//             </div>
//             <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
//             <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            
//             {/* Subtle glow effect on hover */}
//             <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${stat.color === 'text-green-500' ? 'from-green-500' : stat.color === 'text-blue-500' ? 'from-blue-500' : stat.color === 'text-amber-500' ? 'from-amber-500' : 'from-pink-500'} to-transparent opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}></div>
//           </motion.div>
//         ))}
//       </div>


//       {/* 3. CHARTS (Darkest Theme) */}
//       <div className="grid lg:grid-cols-3 gap-8">
        
//         {/* Main Area Chart */}
//         <motion.div variants={itemVar} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
//           </div>
          
//           <div className="h-[320px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={salesChartData}>
//                 <defs>
//                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
//                     <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
//                 <XAxis dataKey="name" stroke="#525252" tickLine={false} axisLine={false} dy={10} />
//                 <YAxis stroke="#525252" tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
//                   itemStyle={{ color: '#fff' }}
//                 />
//                 <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>

//         {/* Pie Chart */}
//         <motion.div variants={itemVar} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl flex flex-col">
//           <h3 className="text-xl font-bold text-white mb-2">Crop Distribution</h3>
//           <p className="text-sm text-gray-500 mb-6">Quantity (Kg) sold by type</p>
          
//           <div className="flex-1 min-h-[200px] relative">
//             {cropChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={cropChartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                     stroke="none"
//                   >
//                     {cropChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
//                   <Legend verticalAlign="bottom" height={36} iconType="circle" />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//                 <div className="flex items-center justify-center h-full text-gray-600 text-sm">
//                     No sales data available
//                 </div>
//             )}
            
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
//                <FaLeaf className="text-green-900 text-3xl opacity-50" />
//             </div>
//           </div>
//         </motion.div>
//       </div>


//       {/* 4. RECENT TRANSACTIONS (Rich List - Darkest) */}
//       <motion.div variants={itemVar} className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
//         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F0F0F]">
//           <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
//           <Link href="/dashboard/sales" className="text-sm text-green-500 hover:text-green-400 font-bold">
//             View All
//           </Link>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-[#050505] text-gray-500 text-xs uppercase tracking-wider font-semibold">
//                 <th className="p-6">Farmer</th>
//                 <th className="p-6">Crop</th>
//                 <th className="p-6">Weight</th>
//                 <th className="p-6">Amount</th>
//                 <th className="p-6">Date</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5 text-gray-300">
//               {recentSales.length > 0 ? recentSales.map((sale, i) => (
//                 <tr key={i} className="hover:bg-white/5 transition-colors group">
//                   <td className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center font-bold text-gray-300 border border-white/10 group-hover:border-green-500 transition-colors">
//                         {sale.farmerId?.name?.charAt(0) || "F"}
//                       </div>
//                       <div>
//                         <p className="font-bold text-white text-sm">{sale.farmerId?.name || "Unknown"}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-6">
//                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
//                       {sale.cropType}
//                     </span>
//                   </td>
//                   <td className="p-6 font-medium text-sm text-gray-400">{sale.quantity} Kg</td>
//                   <td className="p-6">
//                     <div className="flex flex-col">
//                       <span className="font-mono text-green-400 font-bold">₹{sale.totalAmount.toLocaleString()}</span>
//                     </div>
//                   </td>
//                   <td className="p-6 text-xs text-gray-500">
//                     {new Date(sale.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                    <td colSpan="5" className="p-12 text-center text-gray-600">
//                       No recent sales found.
//                    </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//     </motion.div>
//   );
// }









// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
//   PieChart, Pie, Cell, Legend, BarChart, Bar 
// } from 'recharts';
// import { 
//   FaRupeeSign, FaUserFriends, FaShoppingBag, 
//   FaPlus, FaCloudSun, FaLeaf, FaTractor, FaSpinner, FaArrowRight,
//   FaTemperatureHigh, FaWind, FaTint, FaNewspaper, FaChartLine
// } from 'react-icons/fa';
// import Link from 'next/link';

// // --- CONFIG ---
// const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

// // --- ANIMATION VARIANTS ---
// const containerVar = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
// };

// const itemVar = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
// };

// export default function DashboardHome() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({ sales: 0, farmers: 0, commission: 0, loans: 0 });
//   const [salesChartData, setSalesChartData] = useState([]);
//   const [cropChartData, setCropChartData] = useState([]);
//   const [recentSales, setRecentSales] = useState([]);
//   const [greeting, setGreeting] = useState('Good Morning');

//   // NEW: Calculate Time of Day
//   useEffect(() => {
//     const hour = new Date().getHours();
    
//     if (hour >= 5 && hour < 12) {
//       setGreeting("Good Morning");
//     } else if (hour === 12) {
//       setGreeting("Good Noon");
//     } else if (hour > 12 && hour < 17) {
//       setGreeting("Good Afternoon");
//     } else if (hour >= 17 && hour < 21) {
//       setGreeting("Good Evening");
//     } else if (hour >= 21 || hour < 0) {
//       setGreeting("Good Night");
//     } else {
//       // Covers 12 AM to 5 AM (Midnight hours)
//       setGreeting("Working Late?"); 
//     }
//   }, []);


//   // Mock Weather Data (You can replace this with a real API call later)
//   const weather = { temp: 28, condition: 'Partly Cloudy', humidity: 65, wind: 12, loc: 'Punjab, IN' };
  
//   // Mock News Data
//   const news = [
//     { title: "MSP for Wheat increased by ₹150", source: "AgriMin", time: "2h ago" },
//     { title: "Monsoon expected to be normal", source: "IMD", time: "5h ago" },
//     { title: "New subsidy on solar pumps", source: "State Govt", time: "1d ago" },
//   ];

//   useEffect(() => {
//     async function loadData() {
//       try {
//         // Fetch all data in parallel
//         const [salesRes, farmersRes, loansRes] = await Promise.all([
//           fetch('/api/sales'),
//           fetch('/api/farmers'),
//           fetch('/api/loans')
//         ]);
        
//         const sales = await salesRes.json();
//         const farmers = await farmersRes.json();
//         const loans = await loansRes.json();

//         // Calculate Totals
//         setStats({
//           sales: sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
//           farmers: farmers.length,
//           commission: sales.reduce((acc, curr) => acc + (curr.commission || 0), 0),
//           loans: loans.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
//         });

//         // Set Recent Transactions
//         setRecentSales(sales.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));

//         // Prepare Chart Data
//         if (sales.length === 0) {
//             setSalesChartData(Array(7).fill({ name: '-', sales: 0 }));
//             setCropChartData([{ name: 'No Data', value: 100 }]);
//         } else {
//             // Sales Chart (Last 7 Days)
//              const last7DaysMap = {};
//             for (let i = 6; i >= 0; i--) {
//               const d = new Date();
//               d.setDate(d.getDate() - i);
//               const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' }); 
//               last7DaysMap[dayName] = 0;
//             }
//             sales.forEach(sale => {
//               const d = new Date(sale.date);
//               const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
//               if (last7DaysMap[dayName] !== undefined) {
//                 last7DaysMap[dayName] += sale.totalAmount;
//               }
//             });
//             setSalesChartData(Object.keys(last7DaysMap).map(key => ({ name: key, sales: last7DaysMap[key] })));

//             // Crop Pie Chart
//              const cropMap = {};
//             sales.forEach(sale => { cropMap[sale.cropType] = (cropMap[sale.cropType] || 0) + sale.quantity; });
//             setCropChartData(Object.keys(cropMap).map(key => ({ name: key, value: cropMap[key] })));
//         }

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Failed to load dashboard data", error);
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-black">
//         <FaSpinner className="animate-spin text-5xl text-green-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen text-white pt-28 pb-24 px-4 md:px-8">
      
//       {/* --- 1. FIXED BACKGROUND IMAGE --- */}
//       <div className="fixed inset-0 z-0">
//         <img 
//             src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2071&auto=format&fit=crop"
//             alt="Farm Background"
//             className="w-full h-full object-cover opacity-20"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
//       </div>

//       <motion.div 
//         variants={containerVar}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 max-w-[1600px] mx-auto space-y-6"
//       >
        
//         {/* --- 2. HEADER SECTION (Welcome + Weather) --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
//             {/* Welcome Card */}
//             <motion.div variants={itemVar} className="lg:col-span-2 bg-gradient-to-r from-green-900/40 to-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-md">
//                 <div className="relative z-10">
//                     <div className="flex items-center gap-3 mb-4">
//                         <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
//                              Live Market
//                         </span>
//                         <span className="text-gray-400 text-sm">{new Date().toDateString()}</span>
//                     </div>
//                     <h1 className="text-3xl md:text-5xl font-bold mb-4">
//                         Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Arthiya Ji</span>
//                     </h1>
//                     <p className="text-gray-300 max-w-lg text-lg">
//                         Overview: You have processed <strong className="text-white">{recentSales.length} transactions</strong> this week. Market volatility is low.
//                     </p>
//                     <div className="mt-8 flex gap-4">
//                         <Link href="/dashboard/sales/new">
//                             <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20">
//                                 <FaPlus /> Create Bill
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//                 {/* Decoration */}
//                 <div className="absolute right-0 bottom-0 opacity-10">
//                     <FaTractor size={200} />
//                 </div>
//             </motion.div>

//             {/* Weather Widget */}
//             <motion.div variants={itemVar} className="bg-blue-900/20 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
//                  <div className="absolute top-0 right-0 p-4 opacity-20"><FaCloudSun size={100} /></div>
//                  <div>
//                     <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Mandi Weather</h3>
//                     <p className="text-2xl font-bold text-white mt-1">{weather.loc}</p>
//                  </div>
                 
//                  <div className="flex items-end gap-2 mt-4">
//                     <span className="text-6xl font-light text-white">{weather.temp}°</span>
//                     <span className="text-xl text-blue-300 mb-2">{weather.condition}</span>
//                  </div>

//                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaTint /></div>
//                         <div>
//                             <p className="text-xs text-gray-400">Humidity</p>
//                             <p className="font-bold">{weather.humidity}%</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-500/20 rounded-lg text-gray-300"><FaWind /></div>
//                         <div>
//                             <p className="text-xs text-gray-400">Wind</p>
//                             <p className="font-bold">{weather.wind} km/h</p>
//                         </div>
//                     </div>
//                  </div>
//             </motion.div>
//         </div>


//         {/* --- 3. ANALYTICAL STATS GRID (Clickable) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { title: 'Total Sales', value: formatCurrency(stats.sales), icon: FaRupeeSign, color: 'text-green-400', border: 'hover:border-green-500/50', link: '/dashboard/sales' },
//             { title: 'Farmers Linked', value: stats.farmers, icon: FaUserFriends, color: 'text-blue-400', border: 'hover:border-blue-500/50', link: '/dashboard/farmers' },
//             { title: 'My Commission', value: formatCurrency(stats.commission), icon: FaShoppingBag, color: 'text-amber-400', border: 'hover:border-amber-500/50', link: '/dashboard/sales' },
//             { title: 'Outstanding Loans', value: formatCurrency(stats.loans), icon: FaChartLine, color: 'text-red-400', border: 'hover:border-red-500/50', link: '/dashboard/loans' },
//           ].map((stat, i) => (
//             <Link href={stat.link} key={i}>
//                 <motion.div 
//                   variants={itemVar}
//                   whileHover={{ y: -5 }}
//                   className={`bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 ${stat.border} p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl group`}
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                       <div className={`p-3 rounded-xl bg-white/5 ${stat.color} text-xl group-hover:scale-110 transition-transform`}>
//                           <stat.icon />
//                       </div>
//                       <FaArrowRight className="text-gray-600 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all duration-300" />
//                   </div>
//                   <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{stat.title}</p>
//                   <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</h3>
//                 </motion.div>
//             </Link>
//           ))}
//         </div>


//         {/* --- 4. CHARTS & GRAPHS --- */}
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Revenue Area Chart */}
//           <motion.div variants={itemVar} className="lg:col-span-2 bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-bold flex items-center gap-2"><FaChartLine className="text-green-500"/> Revenue Trend</h3>
//                 <select className="bg-black border border-white/20 rounded-lg text-xs p-2 text-gray-300 outline-none">
//                     <option>Last 7 Days</option>
//                     <option>Last Month</option>
//                 </select>
//             </div>
//             <div className="h-[300px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={salesChartData}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
//                   <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} dy={10} fontSize={12} />
//                   <YAxis stroke="#666" tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} fontSize={12} />
//                   <Tooltip 
//                     contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
//                     itemStyle={{ color: '#fff' }}
//                     formatter={(value) => [`₹${value}`, 'Sales']}
//                   />
//                   <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           {/* Crop Distribution Pie Chart */}
//           <motion.div variants={itemVar} className="bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
//             <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FaLeaf className="text-green-500"/> Crop Volume</h3>
//             <p className="text-gray-500 text-xs mb-4">Distribution by Quantity (Qt)</p>
//             <div className="flex-1 relative min-h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={cropChartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                     stroke="none"
//                   >
//                     {cropChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
//                   <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
//                 </PieChart>
//               </ResponsiveContainer>
//               {/* Center Text */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
//                   <span className="text-2xl font-bold text-white">{cropChartData.length}</span>
//                   <span className="text-[10px] text-gray-500 uppercase">Crops</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>


//         {/* --- 5. BOTTOM SECTION (Transactions + News) --- */}
//         <div className="grid lg:grid-cols-3 gap-6">
            
//             {/* Recent Transactions Table */}
//             <motion.div variants={itemVar} className="lg:col-span-2 bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md overflow-hidden">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-lg font-bold">Recent Transactions</h3>
//                     <Link href="/dashboard/sales" className="text-xs text-green-400 hover:underline">View All</Link>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left text-sm">
//                         <thead className="text-xs text-gray-500 uppercase bg-white/5">
//                             <tr>
//                                 <th className="p-4 rounded-l-lg">Farmer</th>
//                                 <th className="p-4">Crop</th>
//                                 <th className="p-4">Amount</th>
//                                 <th className="p-4 rounded-r-lg">Date</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-gray-300">
//                             {recentSales.map((sale, i) => (
//                                 <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
//                                     <td className="p-4 font-bold text-white">{sale.farmerId?.name || "Unknown"}</td>
//                                     <td className="p-4">
//                                         <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
//                                             {sale.cropType}
//                                         </span>
//                                     </td>
//                                     <td className="p-4 font-mono text-green-400 font-bold">₹{sale.totalAmount.toLocaleString()}</td>
//                                     <td className="p-4 text-gray-500 text-xs">{new Date(sale.date).toLocaleDateString()}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {recentSales.length === 0 && <div className="p-8 text-center text-gray-500">No data available</div>}
//                 </div>
//             </motion.div>

//             {/* Farming News Feed */}
//             <motion.div variants={itemVar} className="bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
//                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaNewspaper className="text-blue-400" /> Farming News</h3>
//                 <div className="space-y-4">
//                     {news.map((item, i) => (
//                         <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
//                             <h4 className="text-sm font-semibold text-gray-200 group-hover:text-green-400 transition-colors line-clamp-2">
//                                 {item.title}
//                             </h4>
//                             <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
//                                 <span>{item.source}</span>
//                                 <span>{item.time}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
//                     Read More News
//                 </button>
//             </motion.div>

//         </div>

//       </motion.div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FaRupeeSign, FaUserFriends, FaShoppingBag, 
  FaPlus, FaCloudSun, FaLeaf, FaTractor, FaSpinner, FaArrowRight,
  FaTint, FaWind, FaNewspaper, FaChartLine
} from 'react-icons/fa';
import Link from 'next/link';

// --- CONFIG ---
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
// ACCESS KEYS FROM ENV
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; 
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Dynamic Data States
  const [greeting, setGreeting] = useState('Good Morning');
  const [stats, setStats] = useState({ sales: 0, farmers: 0, commission: 0, loans: 0 });
  const [salesChartData, setSalesChartData] = useState([]);
  const [cropChartData, setCropChartData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  
  // API Data States
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);

  // --- 1. CALCULATE GREETING ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour === 12) setGreeting("Good Noon");
    else if (hour > 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else if (hour >= 21 || hour < 0) setGreeting("Good Night");
    else setGreeting("Working Late?");
  }, []);

  // --- 2. LOAD DASHBOARD DATA ---
  useEffect(() => {
    async function loadData() {
      try {
        // A. Fetch Internal DB Data
        const [salesRes, farmersRes, loansRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/farmers'),
          fetch('/api/loans')
        ]);
        
        const sales = await salesRes.json();
        const farmers = await farmersRes.json();
        const loans = await loansRes.json();

        // Calculate Stats
        setStats({
          sales: sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
          farmers: farmers.length,
          commission: sales.reduce((acc, curr) => acc + (curr.commission || 0), 0),
          loans: loans.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
        });

        setRecentSales(sales.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));

        // Chart Data Logic...
        if (sales.length > 0) {
            const last7DaysMap = {};
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' }); 
              last7DaysMap[dayName] = 0;
            }
            sales.forEach(sale => {
              const d = new Date(sale.date);
              const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
              if (last7DaysMap[dayName] !== undefined) last7DaysMap[dayName] += sale.totalAmount;
            });
            setSalesChartData(Object.keys(last7DaysMap).map(key => ({ name: key, sales: last7DaysMap[key] })));

            const cropMap = {};
            sales.forEach(sale => { cropMap[sale.cropType] = (cropMap[sale.cropType] || 0) + sale.quantity; });
            setCropChartData(Object.keys(cropMap).map(key => ({ name: key, value: cropMap[key] })));
        } else {
            setSalesChartData(Array(7).fill({ name: '-', sales: 0 }));
            setCropChartData([{ name: 'No Data', value: 100 }]);
        }

        // B. Fetch Weather
        try {
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Ludhiana,IN&units=metric&appid=${WEATHER_API_KEY}`);
            if(weatherRes.ok) {
                const wData = await weatherRes.json();
                setWeather({
                    temp: Math.round(wData.main.temp),
                    condition: wData.weather[0].main,
                    humidity: wData.main.humidity,
                    wind: Math.round(wData.wind.speed * 3.6),
                    loc: wData.name
                });
            }
        } catch (err) {
            console.error("Weather fetch failed", err);
            setWeather({ temp: 28, condition: 'Clear', humidity: 45, wind: 10, loc: 'Punjab' });
        }

        // C. Fetch News
        try {
            const newsRes = await fetch(`https://newsapi.org/v2/everything?q=agriculture+india&sortBy=publishedAt&pageSize=3&language=en&apiKey=${NEWS_API_KEY}`);
            if(newsRes.ok) {
                const nData = await newsRes.json();
                const processedNews = nData.articles.map(article => ({
                    title: article.title,
                    source: article.source.name,
                    time: getTimeAgo(new Date(article.publishedAt)),
                    url: article.url
                }));
                setNews(processedNews);
            }
        } catch (err) {
            console.error("News fetch failed", err);
            setNews([
                { title: "MSP for Wheat increased by ₹150", source: "AgriMin", time: "2h ago" },
                { title: "Monsoon expected to be normal", source: "IMD", time: "5h ago" },
                { title: "New subsidy on solar pumps", source: "State Govt", time: "1d ago" },
            ]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    return Math.floor(seconds / 60) + "m ago";
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <FaSpinner className="animate-spin text-5xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white pt-28 pb-20 px-4 md:px-8">
      
      {/* --- FIX: Changed 'fixed' to 'absolute' to prevent overlapping footer --- */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img 
            src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2071&auto=format&fit=crop"
            alt="Farm Background"
            className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
      </div>

      <motion.div 
        variants={containerVar}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1600px] mx-auto space-y-6"
      >
        
        {/* --- 2. HEADER SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Welcome Card */}
            <motion.div variants={itemVar} className="lg:col-span-2 bg-gradient-to-r from-green-900/40 to-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-md">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                             Live Market
                        </span>
                        <span className="text-gray-400 text-sm">{new Date().toDateString()}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                          {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Arthiya Ji</span>
                    </h1>
                    <p className="text-gray-300 max-w-lg text-lg">
                        Overview: You have processed <strong className="text-white">{recentSales.length} transactions</strong> this week. Market volatility is low.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link href="/dashboard/sales/new">
                            <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20">
                                <FaPlus /> Create Bill
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                    <FaTractor size={200} />
                </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div variants={itemVar} className="bg-blue-900/20 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20"><FaCloudSun size={100} /></div>
                 
                 {weather ? (
                      <>
                        <div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Mandi Weather</h3>
                            <p className="text-2xl font-bold text-white mt-1">{weather.loc}</p>
                        </div>
                        
                        <div className="flex items-end gap-2 mt-4">
                            <span className="text-6xl font-light text-white">{weather.temp}°</span>
                            <span className="text-xl text-blue-300 mb-2">{weather.condition}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaTint /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Humidity</p>
                                    <p className="font-bold">{weather.humidity}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-500/20 rounded-lg text-gray-300"><FaWind /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Wind</p>
                                    <p className="font-bold">{weather.wind} km/h</p>
                                </div>
                            </div>
                        </div>
                      </>
                 ) : (
                    <div className="flex items-center justify-center h-full">
                        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                 )}
            </motion.div>
        </div>

        {/* --- 3. ANALYTICAL STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Sales', value: formatCurrency(stats.sales), icon: FaRupeeSign, color: 'text-green-400', border: 'hover:border-green-500/50', link: '/dashboard/sales' },
            { title: 'Farmers Linked', value: stats.farmers, icon: FaUserFriends, color: 'text-blue-400', border: 'hover:border-blue-500/50', link: '/dashboard/farmers' },
            { title: 'My Commission', value: formatCurrency(stats.commission), icon: FaShoppingBag, color: 'text-amber-400', border: 'hover:border-amber-500/50', link: '/dashboard/sales' },
            { title: 'Outstanding Loans', value: formatCurrency(stats.loans), icon: FaChartLine, color: 'text-red-400', border: 'hover:border-red-500/50', link: '/dashboard/loans' },
          ].map((stat, i) => (
            <Link href={stat.link} key={i}>
                <motion.div 
                  variants={itemVar}
                  whileHover={{ y: -5 }}
                  className={`bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 ${stat.border} p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl group`}
                >
                  <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-white/5 ${stat.color} text-xl group-hover:scale-110 transition-transform`}>
                          <stat.icon />
                      </div>
                      <FaArrowRight className="text-gray-600 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                  </div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</h3>
                </motion.div>
            </Link>
          ))}
        </div>

        {/* --- 4. CHARTS --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={itemVar} className="lg:col-span-2 bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><FaChartLine className="text-green-500"/> Revenue Trend</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} dy={10} fontSize={12} />
                  <YAxis stroke="#666" tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`₹${value}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVar} className="bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FaLeaf className="text-green-500"/> Crop Volume</h3>
            <p className="text-gray-500 text-xs mb-4">Distribution by Quantity (Qt)</p>
            <div className="flex-1 relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {cropChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-2xl font-bold text-white">{cropChartData.length}</span>
                  <span className="text-[10px] text-gray-500 uppercase">Crops</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- 5. BOTTOM SECTION --- */}
        <div className="grid lg:grid-cols-3 gap-6">
            
            <motion.div variants={itemVar} className="lg:col-span-2 bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Recent Transactions</h3>
                    <Link href="/dashboard/sales" className="text-xs text-green-400 hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-gray-500 uppercase bg-white/5">
                            <tr>
                                <th className="p-4 rounded-l-lg">Farmer</th>
                                <th className="p-4">Crop</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4 rounded-r-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {recentSales.map((sale, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{sale.farmerId?.name || "Unknown"}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                                            {sale.cropType}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-green-400 font-bold">₹{sale.totalAmount.toLocaleString()}</td>
                                    <td className="p-4 text-gray-500 text-xs">{new Date(sale.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Farming News Feed */}
            <motion.div variants={itemVar} className="bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaNewspaper className="text-blue-400" /> Farming News</h3>
                <div className="space-y-4">
                    {news.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                             {item.url ? (
                                <a href={item.url} target="_blank" rel="noreferrer">
                                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-green-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
                                        <span>{item.source}</span>
                                        <span>{item.time}</span>
                                    </div>
                                </a>
                             ) : (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-green-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
                                        <span>{item.source}</span>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                             )}
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    Read More News
                </button>
            </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
















// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
//   PieChart, Pie, Cell, Legend 
// } from 'recharts';
// import { 
//   FaRupeeSign, FaUserFriends, FaShoppingBag, FaArrowUp, FaArrowDown, 
//   FaPlus, FaCloudSun, FaLeaf, FaTractor 
// } from 'react-icons/fa';
// import Link from 'next/link';

// // --- VISUAL ASSETS & COLORS ---
// const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']; // Green, Blue, Amber, Pink

// const containerVar = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
// };

// const itemVar = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 }
// };

// export default function DashboardHome() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({ sales: 0, farmers: 0, commission: 0, loans: 0 });
//   const [salesData, setSalesData] = useState([]);
//   const [cropData, setCropData] = useState([]);
//   const [recentSales, setRecentSales] = useState([]);

//   // --- DATA FETCHING (Same logic as before, just styled differently) ---
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [salesRes, farmersRes, loansRes] = await Promise.all([
//           fetch('/api/sales'),
//           fetch('/api/farmers'),
//           fetch('/api/loans')
//         ]);
        
//         const sales = await salesRes.json();
//         const farmers = await farmersRes.json();
//         const loans = await loansRes.json();

//         // Process Data (Simplified for brevity)
//         setStats({
//             sales: sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
//             farmers: farmers.length,
//             commission: sales.reduce((acc, curr) => acc + (curr.commission || 0), 0),
//             loans: loans.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
//         });

//         // Mock Chart Data if empty (for visual demo)
//         if(sales.length === 0) {
//             setSalesData([
//                 { name: 'Mon', sales: 12000 }, { name: 'Tue', sales: 19000 }, 
//                 { name: 'Wed', sales: 15000 }, { name: 'Thu', sales: 22000 }, 
//                 { name: 'Fri', sales: 30000 }, { name: 'Sat', sales: 45000 }
//             ]);
//             setCropData([
//                 { name: 'Wheat', value: 400 }, { name: 'Rice', value: 300 }, 
//                 { name: 'Mustard', value: 200 }
//             ]);
//         } else {
//              // ... processing logic (same as previous)
//              // For visual impact, let's keep the mock structure if DB is empty
//              setRecentSales(sales.slice(0, 5));
//         }

//         setIsLoading(false);
//       } catch (error) {
//         console.error(error);
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

//   return (
//     <motion.div 
//       variants={containerVar}
//       initial="hidden"
//       animate="visible"
//       className="space-y-8"
//     >
      
//       {/* 1. HERO BANNER WITH WEATHER WIDGET */}
//       <motion.div 
//         variants={itemVar}
//         className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl group"
//       >
//         {/* Background Image */}
//         <div className="absolute inset-0">
//           <img 
//             src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2071&auto=format&fit=crop" 
//             alt="Farm Landscape" 
//             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
//           />
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
//         </div>

//         {/* Content Overlay */}
//         <div className="absolute inset-0 p-8 flex flex-col md:flex-row justify-between items-end md:items-center z-10">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold mb-3 backdrop-blur-md">
//               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
//               Market Open
//             </div>
//             <h1 className="text-4xl font-extrabold text-white mb-2 text-shadow-lg">
//               Good Morning, Arthiya Ji!
//             </h1>
//             <p className="text-gray-200 text-lg max-w-lg drop-shadow-md">
//               Today's market is bullish. Wheat prices are up by <span className="text-green-400 font-bold">+2.4%</span>.
//             </p>
//             <div className="mt-6 flex gap-4">
//                <Link href="/dashboard/sales/new">
//                  <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/30 flex items-center gap-2 transition-all">
//                     <FaPlus /> New Entry
//                  </button>
//                </Link>
//             </div>
//           </div>

//           {/* Weather Widget (Mock) */}
//           <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white min-w-[180px]">
//             <div className="flex items-center gap-3 mb-2">
//                <FaCloudSun className="text-yellow-400 text-3xl" />
//                <div>
//                  <p className="text-2xl font-bold">28°C</p>
//                  <p className="text-xs text-gray-300">Sunny, Chandigarh</p>
//                </div>
//             </div>
//             <div className="flex justify-between text-xs text-gray-300 border-t border-white/10 pt-2 mt-2">
//                <span>Hum: 45%</span>
//                <span>Wind: 12km/h</span>
//             </div>
//           </div>
//         </div>
//       </motion.div>


//       {/* 2. GLOWING STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { title: 'Total Sales', value: formatCurrency(stats.sales), icon: FaRupeeSign, color: 'from-green-500 to-emerald-700', trend: '+12%' },
//           { title: 'Farmers', value: stats.farmers, icon: FaUserFriends, color: 'from-blue-500 to-indigo-700', trend: '+5' },
//           { title: 'Earnings', value: formatCurrency(stats.commission), icon: FaShoppingBag, color: 'from-amber-500 to-orange-700', trend: '+8%' },
//           { title: 'Loan Given', value: formatCurrency(stats.loans), icon: FaTractor, color: 'from-pink-500 to-rose-700', trend: 'Active' },
//         ].map((stat, i) => (
//           <motion.div 
//             key={i}
//             variants={itemVar}
//             whileHover={{ y: -5 }}
//             className="relative bg-gray-900 border border-white/5 p-1 rounded-3xl overflow-hidden group shadow-xl"
//           >
//             {/* Gradient Border Effect */}
//             <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
            
//             <div className="relative bg-gray-900/90 h-full p-6 rounded-[20px] backdrop-blur-sm">
//                <div className="flex justify-between items-start mb-4">
//                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
//                     <stat.icon />
//                  </div>
//                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
//                     {stat.trend}
//                  </span>
//                </div>
//                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
//                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
//             </div>
//           </motion.div>
//         ))}
//       </div>


//       {/* 3. CHARTS & INSIGHTS */}
//       <div className="grid lg:grid-cols-3 gap-8">
        
//         {/* Main Chart */}
//         <motion.div variants={itemVar} className="lg:col-span-2 bg-gray-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
//               <p className="text-sm text-gray-500">Income vs Commission over time</p>
//             </div>
//             <select className="bg-black/30 text-white text-sm border border-white/10 rounded-lg px-3 py-1 focus:outline-none">
//                <option>This Week</option>
//                <option>Last Month</option>
//             </select>
//           </div>
          
//           <div className="h-[320px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={salesData}>
//                 <defs>
//                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
//                     <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
//                 <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} dy={10} />
//                 <YAxis stroke="#666" tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
//                   itemStyle={{ color: '#fff' }}
//                 />
//                 <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>

//         {/* Side Panel: Top Crops */}
//         <motion.div variants={itemVar} className="bg-gray-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm flex flex-col">
//           <h3 className="text-xl font-bold text-white mb-2">Top Performing Crops</h3>
//           <p className="text-sm text-gray-500 mb-6">Based on quantity sold</p>
          
//           <div className="flex-1 min-h-[200px] relative">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={cropData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {cropData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }} />
//                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
//               </PieChart>
//             </ResponsiveContainer>
            
//             {/* Center Icon */}
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
//                <FaLeaf className="text-green-500 text-3xl opacity-50" />
//             </div>
//           </div>

//           <button className="w-full mt-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-bold transition-colors">
//              View Inventory Report
//           </button>
//         </motion.div>
//       </div>


//       {/* 4. RECENT TRANSACTIONS (Rich List) */}
//       <motion.div variants={itemVar} className="bg-gray-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
//         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
//           <div>
//             <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
//             <p className="text-sm text-gray-500">Real-time feed of sales activity</p>
//           </div>
//           <Link href="/dashboard/sales" className="text-sm text-green-400 hover:text-green-300 font-bold px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
//             View All History
//           </Link>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider font-semibold">
//                 <th className="p-6">Farmer Details</th>
//                 <th className="p-6">Crop Info</th>
//                 <th className="p-6">Weight (Qt)</th>
//                 <th className="p-6">Total Amount</th>
//                 <th className="p-6">Date</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5 text-gray-300">
//               {recentSales.length > 0 ? recentSales.map((sale, i) => (
//                 <tr key={i} className="hover:bg-white/5 transition-colors group">
                  
//                   {/* Farmer Avatar & Name */}
//                   <td className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white border-2 border-gray-700 group-hover:border-green-500 transition-colors shadow-lg">
//                         {sale.farmerId?.name?.charAt(0) || "F"}
//                       </div>
//                       <div>
//                         <p className="font-bold text-white text-base">{sale.farmerId?.name || "Unknown Farmer"}</p>
//                         <p className="text-xs text-gray-500">ID: #{sale._id.slice(-4)}</p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Crop Type with Badge */}
//                   <td className="p-6">
//                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
//                       <FaLeaf className="text-green-500" />
//                       {sale.cropType}
//                     </span>
//                   </td>

//                   <td className="p-6 font-medium">{sale.quantity}</td>

//                   <td className="p-6">
//                     <div className="flex flex-col">
//                       <span className="font-mono text-green-400 font-bold text-lg">₹{sale.totalAmount.toLocaleString()}</span>
//                       <span className="text-xs text-gray-500">Comm: ₹{sale.commission.toLocaleString()}</span>
//                     </div>
//                   </td>

//                   <td className="p-6 text-sm text-gray-500">
//                     {new Date(sale.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                    <td colSpan="5" className="p-10 text-center text-gray-500">
//                       No sales data available. Start by adding a new sale.
//                    </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//     </motion.div>
//   );
// }