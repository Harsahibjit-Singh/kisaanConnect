// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Loan from '@/models/Loan';
// import Farmer from '@/models/Farmer'; 
// import nodemailer from 'nodemailer';
// import PDFDocument from 'pdfkit'; // 1. Import PDFKit

// // --- EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // --- HELPER: GENERATE PDF IN MEMORY ---
// const generateReceiptPDF = (loan, farmer, calculations) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 50 });
//     const buffers = [];

//     // Collect data chunks
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', (err) => reject(err));

//     // --- PDF CONTENT DESIGN ---
    
//     // 1. Header
//     doc.fillColor('#22c55e').fontSize(25).text('KISAAN CONNECT', { align: 'center' });
//     doc.fillColor('#000000').fontSize(12).text('Mandi Official Loan Repayment Receipt', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(10).text(`Receipt ID: REF-${Date.now().toString().slice(-6)}`, { align: 'right' });
//     doc.text(`Date Paid: ${new Date().toLocaleDateString()}`, { align: 'right' });
    
//     doc.moveDown(2);

//     // 2. "PAID" Stamp
//     doc.save();
//     doc.rotate(-15, { origin: [100, 150] });
//     doc.fontSize(50).fillColor('red').opacity(0.2).text('PAID', 50, 150);
//     doc.restore();

//     // 3. Farmer Details Box
//     doc.rect(50, 170, 500, 75).stroke('#e0e0e0');
//     doc.fillColor('#000').fontSize(14).text('Farmer Details', 60, 180, { underline: true });
//     doc.fontSize(12).text(`Name: ${farmer.name}`, 60, 200);
//     doc.text(`Phone: ${farmer.phone}`, 60, 220);
//     if(farmer.address) doc.text(`Address: ${farmer.address}`, 300, 200);

//     // 4. Financial Breakdown Table
//     let y = 280;
//     doc.fontSize(14).text('Loan Settlement Details', 50, y);
//     y += 25;

//     // Table Header
//     doc.rect(50, y, 500, 25).fill('#f0f0f0').stroke();
//     doc.fillColor('#000').fontSize(10);
//     doc.text('Description', 60, y + 7);
//     doc.text('Value', 400, y + 7);
//     y += 25;

//     // Rows
//     const addRow = (label, value, isBold = false) => {
//       doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(label, 60, y + 7);
//       doc.text(value, 400, y + 7);
//       doc.rect(50, y, 500, 25).stroke();
//       y += 25;
//     };

//     addRow('Loan ID', loan._id.toString());
//     addRow('Issue Date', new Date(loan.date).toLocaleDateString());
//     addRow('Settlement Date', new Date().toLocaleDateString());
//     addRow('Time Elapsed (Months)', `${calculations.months} Months`);
//     addRow('Principal Amount', `Rs. ${loan.amount.toLocaleString()}`);
//     addRow('Interest Rate', `${loan.interestRate}% per month`);
//     addRow('Interest Accrued', `Rs. ${calculations.interest.toLocaleString()}`);
    
//     // Total Row
//     doc.rect(50, y, 500, 30).fill('#22c55e').stroke();
//     doc.fillColor('#fff').fontSize(12).font('Helvetica-Bold');
//     doc.text('TOTAL AMOUNT PAID', 60, y + 10);
//     doc.text(`Rs. ${calculations.total.toLocaleString()}`, 400, y + 10);

//     // 5. Footer
//     doc.moveDown(4);
//     doc.fillColor('#555').fontSize(10).font('Helvetica');
//     doc.text('This is a computer-generated receipt and requires no signature.', { align: 'center' });
//     doc.text('Thank you for banking with Kisaan Connect.', { align: 'center' });

//     doc.end(); // Finalize PDF
//   });
// };

// // --- API ROUTES ---

// export async function GET(request, { params }) {
//   await connectDB();
//   const { id } = await params; 

//   try {
//     const loan = await Loan.findById(id).populate('farmerId', 'name phone address');
//     if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json(loan);
//   } catch (error) {
//     return NextResponse.json({ error: 'DB Error' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const body = await request.json();
    
//     // 1. Update Loan
//     const updatedLoan = await Loan.findByIdAndUpdate(id, body, { new: true })
//       .populate('farmerId', 'name email phone address'); 
    
//     if (!updatedLoan) {
//       return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     }

//     // 2. IF PAID: Calculate Interest, Generate PDF, Send Email
//     if (body.status === 'Paid') {
//       const farmer = updatedLoan.farmerId;

//       if (farmer && farmer.email) {
        
//         // --- A. RE-CALCULATE INTEREST (Server Side for Accuracy) ---
//         const startDate = new Date(updatedLoan.date);
//         const today = new Date();
//         const diffTime = Math.abs(today - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//         const diffMonths = Math.max((diffDays / 30), 0.1).toFixed(1); 

//         const p = updatedLoan.amount;
//         const r = updatedLoan.interestRate;
//         const interest = Math.round((p * r * diffMonths) / 100);
//         const total = p + interest;

//         const calculations = { months: diffMonths, interest, total };

//         // --- B. GENERATE PDF ---
//         try {
//           const pdfBuffer = await generateReceiptPDF(updatedLoan, farmer, calculations);

//           // --- C. SEND EMAIL WITH ATTACHMENT ---
//           await transporter.sendMail({
//             from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//             to: farmer.email,
//             subject: "✅ Payment Receipt - Loan Cleared",
//             html: `
//               <h3>Loan Payment Confirmation</h3>
//               <p>Dear ${farmer.name},</p>
//               <p>Your loan (ID: ${updatedLoan._id}) has been successfully marked as <strong>PAID</strong>.</p>
//               <p>Please find the official receipt attached to this email containing all financial details.</p>
//               <br/>
//               <p><strong>Summary:</strong></p>
//               <ul>
//                 <li>Principal: ₹${p}</li>
//                 <li>Interest: ₹${interest}</li>
//                 <li><strong>Total Paid: ₹${total}</strong></li>
//               </ul>
//               <br/>
//               <p>Regards,<br>Kisaan Connect Team</p>
//             `,
//             attachments: [
//               {
//                 filename: `Receipt_${updatedLoan._id}.pdf`,
//                 content: pdfBuffer,
//                 contentType: 'application/pdf',
//               },
//             ],
//           });
//           console.log(`Receipt sent to ${farmer.email}`);
//         } catch (emailError) {
//           console.error("Email/PDF Generation Failed:", emailError);
//         }
//       }
//     }

//     return NextResponse.json(updatedLoan);
//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const deletedLoan = await Loan.findByIdAndDelete(id);
//     if (!deletedLoan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json({ message: 'Loan deleted' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Loan from '@/models/Loan';
// import Farmer from '@/models/Farmer'; 
// import nodemailer from 'nodemailer';
// import PDFDocument from 'pdfkit'; 
// import path from 'path'; // 1. Import path

// // --- EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // --- HELPER: GENERATE PDF IN MEMORY ---
// const generateReceiptPDF = (loan, farmer, calculations) => {
//   return new Promise((resolve, reject) => {
    
//     // 2. Resolve the path to your custom font
//     // process.cwd() gets the root directory of your project
//     const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');

//     // 3. Initialize PDF with the custom font
//     // This prevents it from looking for 'Helvetica.afm' in node_modules
//     const doc = new PDFDocument({ 
//       margin: 50, 
//       font: fontPath 
//     });

//     const buffers = [];

//     // Collect data chunks
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', (err) => reject(err));

//     // --- PDF CONTENT DESIGN (Using standard font methods) ---
//     // Note: When using a custom font, you don't need to specify .font('Helvetica') later.
//     // Just use .fontSize() and .text().
    
//     // 1. Header
//     doc.fillColor('#22c55e').fontSize(25).text('KISAAN CONNECT', { align: 'center' });
//     doc.fillColor('#000000').fontSize(12).text('Mandi Official Loan Repayment Receipt', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(10).text(`Receipt ID: REF-${Date.now().toString().slice(-6)}`, { align: 'right' });
//     doc.text(`Date Paid: ${new Date().toLocaleDateString()}`, { align: 'right' });
    
//     doc.moveDown(2);

//     // 2. "PAID" Stamp
//     doc.save();
//     doc.rotate(-15, { origin: [100, 150] });
//     doc.fontSize(50).fillColor('red').opacity(0.2).text('PAID', 50, 150);
//     doc.restore();

//     // 3. Farmer Details Box
//     doc.rect(50, 170, 500, 75).stroke('#e0e0e0');
//     doc.fillColor('#000').opacity(1).fontSize(14).text('Farmer Details', 60, 180, { underline: true });
//     doc.fontSize(12).text(`Name: ${farmer.name}`, 60, 200);
//     doc.text(`Phone: ${farmer.phone}`, 60, 220);
//     if(farmer.address) doc.text(`Address: ${farmer.address}`, 300, 200);

//     // 4. Financial Breakdown Table
//     let y = 280;
//     doc.fontSize(14).text('Loan Settlement Details', 50, y);
//     y += 25;

//     // Table Header
//     doc.rect(50, y, 500, 25).fill('#f0f0f0').stroke();
//     doc.fillColor('#000').fontSize(10);
//     doc.text('Description', 60, y + 7);
//     doc.text('Value', 400, y + 7);
//     y += 25;

//     // Rows
//     const addRow = (label, value) => {
//       doc.text(label, 60, y + 7);
//       doc.text(value, 400, y + 7);
//       doc.rect(50, y, 500, 25).stroke();
//       y += 25;
//     };

//     addRow('Loan ID', loan._id.toString());
//     addRow('Issue Date', new Date(loan.date).toLocaleDateString());
//     addRow('Settlement Date', new Date().toLocaleDateString());
//     addRow('Time Elapsed (Months)', `${calculations.months} Months`);
//     addRow('Principal Amount', `Rs. ${loan.amount.toLocaleString()}`);
//     addRow('Interest Rate', `${loan.interestRate}% per month`);
//     addRow('Interest Accrued', `Rs. ${calculations.interest.toLocaleString()}`);
    
//     // Total Row
//     doc.rect(50, y, 500, 30).fill('#22c55e').stroke();
//     doc.fillColor('#fff').fontSize(12);
//     doc.text('TOTAL AMOUNT PAID', 60, y + 10);
//     doc.text(`Rs. ${calculations.total.toLocaleString()}`, 400, y + 10);

//     // 5. Footer
//     doc.moveDown(4);
//     doc.fillColor('#555').fontSize(10);
//     doc.text('This is a computer-generated receipt and requires no signature.', { align: 'center' });
//     doc.text('Thank you for banking with Kisaan Connect.', { align: 'center' });

//     doc.end(); // Finalize PDF
//   });
// };

// // --- API ROUTES ---

// export async function GET(request, { params }) {
//   await connectDB();
//   const { id } = await params; 

//   try {
//     const loan = await Loan.findById(id).populate('farmerId', 'name phone address');
//     if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json(loan);
//   } catch (error) {
//     return NextResponse.json({ error: 'DB Error' }, { status: 500 });
//   }
// }


// export async function PUT(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const body = await request.json();
    
//     // 1. FETCH EXISTING LOAN
//     const oldLoan = await Loan.findById(id).populate('farmerId', 'name email phone');
//     if (!oldLoan) {
//         return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     }

//     let updateData = {};
//     let emailType = null;
//     let paymentDetails = {};

//     // --- SCENARIO A: PARTIAL PAYMENT (Logic Correction) ---
//     if (body.action === 'partial_payment') {
//         const payAmount = Number(body.paymentAmount);
        
//         // A. Calculate Interest accrued till TODAY
//         const startDate = new Date(oldLoan.date);
//         const today = new Date();
//         const diffTime = Math.abs(today - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//         // Ensure at least 1 day counts to avoid division by zero or negative
//         const diffMonths = (diffDays / 30).toFixed(2); 

//         const p = oldLoan.amount;
//         const r = oldLoan.interestRate;
//         const accruedInterest = Math.round((p * r * diffMonths) / 100);
        
//         const totalDueNow = p + accruedInterest;
        
//         // B. Calculate New Principal (Refinancing Logic)
//         // New Principal = (Old Principal + Interest) - Payment
//         const newPrincipal = totalDueNow - payAmount;

//         // Validation
//         if (newPrincipal < 0) {
//             return NextResponse.json({ error: 'Payment exceeds total due amount' }, { status: 400 });
//         }

//         // C. Prepare Update Data
//         const newNote = `\n[${today.toLocaleDateString()}] Partial Payment: ₹${payAmount}. (Old Principal: ₹${p}, Interest Accrued: ₹${accruedInterest}). New Balance: ₹${newPrincipal}.`;

//         updateData = {
//             amount: newPrincipal, // Update to new balance
//             date: today,          // RESET DATE TO TODAY (So interest starts fresh)
//             notes: (oldLoan.notes || '') + newNote,
//             status: newPrincipal === 0 ? 'Paid' : 'Pending'
//         };

//         emailType = 'PARTIAL';
//         paymentDetails = { payAmount, accruedInterest, totalDueNow, newPrincipal, oldDate: startDate };
//     } 
    
//     // --- SCENARIO B: FULL STATUS UPDATE (e.g., Marking Paid manually) ---
//     else {
//         updateData = { ...body };
//         if (body.status === 'Paid') emailType = 'FULL';
//     }

//     // 2. PERFORM UPDATE
//     const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, { new: true })
//         .populate('farmerId', 'name email phone');

//     // 3. SEND EMAIL
//     const farmer = updatedLoan.farmerId;
//     if (farmer && farmer.email && emailType) {
//         try {
//             if (emailType === 'PARTIAL') {
//                 await transporter.sendMail({
//                     from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//                     to: farmer.email,
//                     subject: "💰 Partial Payment Receipt - Interest Updated",
//                     html: `
//                       <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//                         <h2 style="color: #2563eb;">Payment Received</h2>
//                         <p>Dear ${farmer.name},</p>
//                         <p>We received a partial payment. Your loan balance has been adjusted.</p>
                        
//                         <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//                           <tr><td style="padding: 8px; border: 1px solid #ddd;">Previous Principal:</td><td style="padding: 8px; border: 1px solid #ddd;">₹ ${oldLoan.amount}</td></tr>
//                           <tr><td style="padding: 8px; border: 1px solid #ddd;">Interest Accrued (till today):</td><td style="padding: 8px; border: 1px solid #ddd;">₹ ${paymentDetails.accruedInterest}</td></tr>
//                           <tr style="background-color: #f0fdf4;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Paid:</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #166534;">₹ ${paymentDetails.payAmount}</td></tr>
//                           <tr style="background-color: #fff7ed;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>New Principal Balance:</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #c2410c;">₹ ${paymentDetails.newPrincipal}</td></tr>
//                         </table>
//                         <p style="font-size: 12px; color: #666; margin-top: 15px;">*Note: The loan date has been reset to today. Future interest will be calculated on the new principal of ₹${paymentDetails.newPrincipal}.</p>
//                       </div>
//                     `
//                 });
//             } else if (emailType === 'FULL') {
//                  // ... (Your existing Full Payment Email Logic) ...
//                  await transporter.sendMail({
//                     from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//                     to: farmer.email,
//                     subject: "✅ Loan Fully Paid",
//                     html: `<p>Dear ${farmer.name}, Your loan is fully cleared.</p>`
//                  });
//             }
//         } catch (e) {
//             console.error("Email failed", e);
//         }
//     }

//     return NextResponse.json(updatedLoan);
//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
// export async function DELETE(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const deletedLoan = await Loan.findByIdAndDelete(id);
//     if (!deletedLoan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json({ message: 'Loan deleted' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Loan from '@/models/Loan';
// import Farmer from '@/models/Farmer'; 
// import nodemailer from 'nodemailer';
// import PDFDocument from 'pdfkit'; 

// // --- 1. EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // --- 2. ROBUST PDF GENERATOR (No Custom Fonts Needed) ---
// const generateTransactionPDF = (type, loan, farmer, details) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create PDF stream
//       const doc = new PDFDocument({ margin: 50 });
//       const buffers = [];

//       doc.on('data', buffers.push.bind(buffers));
//       doc.on('end', () => resolve(Buffer.concat(buffers)));
//       doc.on('error', (err) => reject(err));

//       // --- HEADER ---
//       doc.fontSize(20).fillColor('#16a34a').text('KISAAN CONNECT MANDI', { align: 'center' });
//       doc.fontSize(10).fillColor('black').text('Official Transaction Receipt', { align: 'center' });
//       doc.moveDown();

//       // --- RECEIPT META ---
//       doc.fontSize(10).text(`Receipt #: TRX-${Date.now().toString().slice(-6)}`, { align: 'right' });
//       doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
//       doc.moveDown();

//       // --- TYPE BADGE ---
//       doc.save();
//       doc.fontSize(14).fillColor(type === 'FULL' ? '#16a34a' : '#ea580c')
//          .text(type === 'FULL' ? 'LOAN SETTLED' : 'PARTIAL PAYMENT', { align: 'center', underline: true });
//       doc.restore();
//       doc.moveDown();

//       // --- FARMER DETAILS ---
//       doc.rect(50, doc.y, 500, 60).stroke('#ddd');
//       let y = doc.y + 10;
//       doc.fontSize(12).text(`Farmer: ${farmer.name}`, 60, y);
//       doc.fontSize(10).text(`Phone: ${farmer.phone}`, 60, y + 20);
//       doc.moveDown(4);

//       // --- TRANSACTION TABLE ---
//       const startY = doc.y;
//       doc.fontSize(10).font('Helvetica-Bold');
      
//       // Draw Header
//       doc.rect(50, startY, 500, 20).fill('#f3f4f6').stroke();
//       doc.fillColor('black').text('Description', 60, startY + 5);
//       doc.text('Amount', 400, startY + 5);

//       // Helper to add rows
//       let rowY = startY + 20;
//       const addRow = (label, value, isBold = false) => {
//         doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica');
//         doc.text(label, 60, rowY + 5);
//         doc.text(value, 400, rowY + 5);
//         doc.rect(50, rowY, 500, 20).stroke();
//         rowY += 20;
//       };

//       if (type === 'PARTIAL') {
//         addRow('Previous Principal', `Rs. ${details.oldPrincipal.toLocaleString()}`);
//         addRow('Interest Accrued (Till Date)', `Rs. ${details.accruedInterest.toLocaleString()}`);
//         addRow('Total Due Before Payment', `Rs. ${details.totalDue.toLocaleString()}`);
//         addRow('PAYMENT RECEIVED', `Rs. ${details.payAmount.toLocaleString()}`, true);
        
//         // Highlight New Balance
//         doc.rect(50, rowY, 500, 20).fill('#fff7ed').stroke();
//         doc.fillColor('#c2410c').text('New Outstanding Balance', 60, rowY + 5);
//         doc.text(`Rs. ${details.newPrincipal.toLocaleString()}`, 400, rowY + 5);
//       } else {
//         // FULL PAYMENT
//         addRow('Principal Amount', `Rs. ${loan.amount.toLocaleString()}`);
//         addRow('Interest Calculated', `Rs. ${details.accruedInterest.toLocaleString()}`);
        
//         // Highlight Total Paid
//         doc.rect(50, rowY, 500, 25).fill('#dcfce7').stroke();
//         doc.fillColor('#15803d').fontSize(12).text('TOTAL AMOUNT PAID', 60, rowY + 7);
//         doc.text(`Rs. ${details.totalPaid.toLocaleString()}`, 400, rowY + 7);
//       }

//       // --- FOOTER ---
//       doc.fontSize(10).fillColor('black');
//       doc.moveDown(4);
//       doc.text('Authorized Signature', { align: 'right' });
//       doc.moveDown(2);
//       doc.fontSize(8).text('System Generated Receipt. Kisaan Connect Mandi.', { align: 'center' });

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// };


// // --- API FUNCTIONS ---

// export async function GET(request, { params }) {
//   await connectDB();
//   // Safe param access for Next.js 15
//   const { id } = await params; 

//   try {
//     const loan = await Loan.findById(id).populate('farmerId', 'name phone address');
//     if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json(loan);
//   } catch (error) {
//     return NextResponse.json({ error: 'DB Error' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const body = await request.json();
    
//     // 1. Fetch Existing Loan
//     const oldLoan = await Loan.findById(id).populate('farmerId', 'name email phone');
//     if (!oldLoan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });

//     let updateData = {};
//     let emailContext = null; // Stores data needed for PDF/Email

//     // --- LOGIC A: PARTIAL PAYMENT (Refinancing) ---
//     if (body.action === 'partial_payment') {
//         const payAmount = Number(body.paymentAmount);
        
//         // Calc Interest
//         const startDate = new Date(oldLoan.date);
//         const today = new Date();
//         const diffTime = Math.abs(today - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//         const diffMonths = Math.max((diffDays / 30), 0.1); 

//         const p = oldLoan.amount;
//         const r = oldLoan.interestRate;
//         const accruedInterest = Math.round((p * r * diffMonths) / 100);
//         const totalDue = p + accruedInterest;
//         const newPrincipal = totalDue - payAmount;

//         if (newPrincipal < 0) return NextResponse.json({ error: 'Payment exceeds due amount' }, { status: 400 });

//         updateData = {
//             amount: newPrincipal,
//             date: today, // Reset date to today
//             notes: (oldLoan.notes || '') + `\n[${today.toLocaleDateString()}] Paid ₹${payAmount}. Refinanced: ₹${newPrincipal}.`,
//             status: newPrincipal === 0 ? 'Paid' : 'Pending'
//         };

//         emailContext = {
//             type: 'PARTIAL',
//             oldPrincipal: p,
//             accruedInterest,
//             totalDue,
//             payAmount,
//             newPrincipal
//         };
//     } 
//     // --- LOGIC B: FULL PAYMENT (Mark as Paid) ---
//     else if (body.status === 'Paid') {
//         updateData = { status: 'Paid', notes: (oldLoan.notes || '') + '\n[Settled] Marked as Paid.' };
        
//         // Calculate final numbers for the receipt
//         const startDate = new Date(oldLoan.date);
//         const diffTime = Math.abs(new Date() - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         const diffMonths = Math.max((diffDays / 30), 0.1);
//         const interest = Math.round((oldLoan.amount * oldLoan.interestRate * diffMonths) / 100);

//         emailContext = {
//             type: 'FULL',
//             accruedInterest: interest,
//             totalPaid: oldLoan.amount + interest
//         };
//     } 
//     // --- LOGIC C: SIMPLE UPDATE ---
//     else {
//         updateData = { ...body };
//     }

//     // 2. Perform Update
//     const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, { new: true })
//         .populate('farmerId', 'name email phone');

//     // 3. Generate PDF & Send Email
//     if (emailContext && updatedLoan.farmerId?.email) {
//         try {
//             const pdfBuffer = await generateTransactionPDF(
//                 emailContext.type, 
//                 updatedLoan, 
//                 updatedLoan.farmerId, 
//                 emailContext
//             );

//             const subject = emailContext.type === 'FULL' 
//                 ? "✅ Loan Settled Successfully - Receipt" 
//                 : "💰 Payment Received - Loan Update";

//             const htmlBody = emailContext.type === 'FULL'
//                 ? `<p>Dear ${updatedLoan.farmerId.name}, your loan has been fully settled. Please find the receipt attached.</p>`
//                 : `<p>Dear ${updatedLoan.farmerId.name}, we received a payment of ₹${emailContext.payAmount}. Your new loan balance is ₹${emailContext.newPrincipal}. See attachment for details.</p>`;

//             await transporter.sendMail({
//                 from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//                 to: updatedLoan.farmerId.email,
//                 subject: subject,
//                 html: htmlBody,
//                 attachments: [
//                     {
//                         filename: `Receipt_${updatedLoan._id}.pdf`,
//                         content: pdfBuffer,
//                         contentType: 'application/pdf',
//                     },
//                 ],
//             });
//             console.log(`Receipt sent to ${updatedLoan.farmerId.email}`);
//         } catch (err) {
//             console.error("Email generation failed:", err);
//         }
//     }

//     return NextResponse.json(updatedLoan);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(request, { params }) {
//   await connectDB();
//   const { id } = await params;
  
//   try {
//     const deletedLoan = await Loan.findByIdAndDelete(id);
//     if (!deletedLoan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
//     return NextResponse.json({ message: 'Loan deleted' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Loan from '@/models/Loan';
import Farmer from '@/models/Farmer'; 
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit'; 
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// --- 1. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- 2. PDF GENERATOR (Unchanged) ---
const generateTransactionPDF = (type, loan, farmer, details) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // HEADER
      doc.fontSize(20).fillColor('#16a34a').text('KISAAN CONNECT MANDI', { align: 'center' });
      doc.fontSize(10).fillColor('black').text('Official Transaction Receipt', { align: 'center' });
      doc.moveDown();

      // RECEIPT META
      doc.fontSize(10).text(`Receipt #: TRX-${Date.now().toString().slice(-6)}`, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // TYPE BADGE
      doc.save();
      doc.fontSize(14).fillColor(type === 'FULL' ? '#16a34a' : '#ea580c')
          .text(type === 'FULL' ? 'LOAN SETTLED' : 'PARTIAL PAYMENT', { align: 'center', underline: true });
      doc.restore();
      doc.moveDown();

      // FARMER DETAILS
      doc.rect(50, doc.y, 500, 60).stroke('#ddd');
      let y = doc.y + 10;
      doc.fontSize(12).text(`Farmer: ${farmer.name}`, 60, y);
      doc.fontSize(10).text(`Phone: ${farmer.phone}`, 60, y + 20);
      doc.moveDown(4);

      // TRANSACTION TABLE
      const startY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.rect(50, startY, 500, 20).fill('#f3f4f6').stroke();
      doc.fillColor('black').text('Description', 60, startY + 5);
      doc.text('Amount', 400, startY + 5);

      let rowY = startY + 20;
      const addRow = (label, value, isBold = false) => {
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica');
        doc.text(label, 60, rowY + 5);
        doc.text(value, 400, rowY + 5);
        doc.rect(50, rowY, 500, 20).stroke();
        rowY += 20;
      };

      if (type === 'PARTIAL') {
        addRow('Previous Principal', `Rs. ${details.oldPrincipal.toLocaleString()}`);
        addRow('Interest Accrued (Till Date)', `Rs. ${details.accruedInterest.toLocaleString()}`);
        addRow('Total Due Before Payment', `Rs. ${details.totalDue.toLocaleString()}`);
        addRow('PAYMENT RECEIVED', `Rs. ${details.payAmount.toLocaleString()}`, true);
        
        doc.rect(50, rowY, 500, 20).fill('#fff7ed').stroke();
        doc.fillColor('#c2410c').text('New Outstanding Balance', 60, rowY + 5);
        doc.text(`Rs. ${details.newPrincipal.toLocaleString()}`, 400, rowY + 5);
      } else {
        addRow('Principal Amount', `Rs. ${loan.amount.toLocaleString()}`);
        addRow('Interest Calculated', `Rs. ${details.accruedInterest.toLocaleString()}`);
        
        doc.rect(50, rowY, 500, 25).fill('#dcfce7').stroke();
        doc.fillColor('#15803d').fontSize(12).text('TOTAL AMOUNT PAID', 60, rowY + 7);
        doc.text(`Rs. ${details.totalPaid.toLocaleString()}`, 400, rowY + 7);
      }

      // FOOTER
      doc.fontSize(10).fillColor('black');
      doc.moveDown(4);
      doc.text('Authorized Signature', { align: 'right' });
      doc.moveDown(2);
      doc.fontSize(8).text('System Generated Receipt. Kisaan Connect Mandi.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// --- API FUNCTIONS ---

export async function GET(request, { params }) {
  await connectDB();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params; 

  try {
    // 2. ISOLATION: Fetch only if it belongs to logged in user
    const loan = await Loan.findOne({ _id: id, arthiyaId: session.user.id })
                           .populate('farmerId', 'name phone address');
                           
    if (!loan) return NextResponse.json({ error: 'Loan not found or access denied' }, { status: 404 });
    return NextResponse.json(loan);
  } catch (error) {
    return NextResponse.json({ error: 'DB Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  
  try {
    const body = await request.json();
    
    // 2. ISOLATION: Fetch Existing Loan specific to this user
    const oldLoan = await Loan.findOne({ _id: id, arthiyaId: session.user.id })
                              .populate('farmerId', 'name email phone');

    if (!oldLoan) return NextResponse.json({ error: 'Loan not found or access denied' }, { status: 404 });

    let updateData = {};
    let emailContext = null; 

    // --- LOGIC A: PARTIAL PAYMENT ---
    if (body.action === 'partial_payment') {
        const payAmount = Number(body.paymentAmount);
        
        // Calc Interest
        const startDate = new Date(oldLoan.date);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const diffMonths = Math.max((diffDays / 30), 0.1); 

        const p = oldLoan.amount;
        const r = oldLoan.interestRate;
        const accruedInterest = Math.round((p * r * diffMonths) / 100);
        const totalDue = p + accruedInterest;
        const newPrincipal = totalDue - payAmount;

        if (newPrincipal < 0) return NextResponse.json({ error: 'Payment exceeds due amount' }, { status: 400 });

        updateData = {
            amount: newPrincipal,
            date: today,
            notes: (oldLoan.notes || '') + `\n[${today.toLocaleDateString()}] Paid ₹${payAmount}. Refinanced: ₹${newPrincipal}.`,
            status: newPrincipal === 0 ? 'Paid' : 'Pending'
        };

        emailContext = {
            type: 'PARTIAL',
            oldPrincipal: p,
            accruedInterest,
            totalDue,
            payAmount,
            newPrincipal
        };
    } 
    // --- LOGIC B: FULL PAYMENT ---
    else if (body.status === 'Paid') {
        updateData = { status: 'Paid', notes: (oldLoan.notes || '') + '\n[Settled] Marked as Paid.' };
        
        const startDate = new Date(oldLoan.date);
        const diffTime = Math.abs(new Date() - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.max((diffDays / 30), 0.1);
        const interest = Math.round((oldLoan.amount * oldLoan.interestRate * diffMonths) / 100);

        emailContext = {
            type: 'FULL',
            accruedInterest: interest,
            totalPaid: oldLoan.amount + interest
        };
    } 
    // --- LOGIC C: SIMPLE UPDATE ---
    else {
        updateData = { ...body };
    }

    // 3. Perform Update (Ensuring ownership again for safety)
    const updatedLoan = await Loan.findOneAndUpdate(
        { _id: id, arthiyaId: session.user.id }, 
        updateData, 
        { new: true }
    ).populate('farmerId', 'name email phone');

    // 4. Generate PDF & Send Email
    if (emailContext && updatedLoan.farmerId?.email) {
        try {
            const pdfBuffer = await generateTransactionPDF(
                emailContext.type, 
                updatedLoan, 
                updatedLoan.farmerId, 
                emailContext
            );

            const subject = emailContext.type === 'FULL' 
                ? "✅ Loan Settled Successfully - Receipt" 
                : "💰 Payment Received - Loan Update";

            // --- PREMIUM EMAIL TEMPLATE ---
            const mailBody = `
              <!DOCTYPE html>
              <html>
              <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
              <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000;">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto;">
                        
                        <tr>
                          <td align="center" style="padding-bottom: 30px;">
                            <h1 style="color: #22c55e; margin: 0; font-size: 28px; letter-spacing: -1px;">
                              Kisaan<span style="color: #ffffff;">Connect</span>
                            </h1>
                          </td>
                        </tr>

                        <tr>
                          <td style="background-color: #111111; padding: 40px; border-radius: 16px; border: 1px solid #333333;">
                            
                            <div style="border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 25px; text-align: center;">
                              <h2 style="color: #ffffff; margin: 0; font-size: 22px;">
                                ${emailContext.type === 'FULL' ? 'Loan Fully Settled' : 'Payment Received'}
                              </h2>
                              <p style="color: #22c55e; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">Transaction ID: TRX-${Date.now().toString().slice(-6)}</p>
                            </div>

                            <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 20px;">Dear <strong>${updatedLoan.farmerId.name}</strong>,</p>
                            
                            <p style="color: #d4d4d4; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                              ${emailContext.type === 'FULL' 
                                ? 'Congratulations! Your loan account has been fully settled. No further dues remain against this account.' 
                                : `We have received a payment of <span style="color:#22c55e; font-weight:bold;">₹${emailContext.payAmount.toLocaleString()}</span> towards your outstanding loan.`}
                            </p>

                            <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 30px;">
                                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                  ${emailContext.type === 'PARTIAL' ? `
                                    <tr>
                                      <td style="color: #888; padding: 8px 0;">Amount Paid</td>
                                      <td style="color: #fff; text-align: right; padding: 8px 0; font-weight: bold;">₹${emailContext.payAmount.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                      <td style="color: #888; padding: 8px 0;">New Balance</td>
                                      <td style="color: #ea580c; text-align: right; padding: 8px 0; font-weight: bold;">₹${emailContext.newPrincipal.toLocaleString()}</td>
                                    </tr>
                                  ` : `
                                    <tr>
                                      <td style="color: #888; padding: 8px 0;">Total Paid</td>
                                      <td style="color: #fff; text-align: right; padding: 8px 0; font-weight: bold;">₹${emailContext.totalPaid.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                      <td style="color: #888; padding: 8px 0;">Status</td>
                                      <td style="color: #22c55e; text-align: right; padding: 8px 0; font-weight: bold;">CLOSED</td>
                                    </tr>
                                  `}
                                </table>
                            </div>

                            <p style="color: #a3a3a3; font-size: 14px; text-align: center;">
                              Please find the official PDF receipt attached to this email.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding-top: 30px;">
                             <p style="color: #444; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.</p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `;

            await transporter.sendMail({
                from: `"Kisaan Connect Loans" <${process.env.EMAIL_USER}>`,
                to: updatedLoan.farmerId.email,
                subject: subject,
                html: mailBody,
                attachments: [
                    {
                        filename: `Receipt_${updatedLoan._id}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                ],
            });
            console.log(`Receipt sent to ${updatedLoan.farmerId.email}`);
        } catch (err) {
            console.error("Email generation failed:", err);
        }
    }

    return NextResponse.json(updatedLoan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  
  try {
    // 2. ISOLATION: Delete only if matched
    const deletedLoan = await Loan.findOneAndDelete({ _id: id, arthiyaId: session.user.id });

    if (!deletedLoan) return NextResponse.json({ error: 'Loan not found or access denied' }, { status: 404 });
    return NextResponse.json({ message: 'Loan deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}