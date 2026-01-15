// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Loan from '@/models/Loan';
// import Farmer from '@/models/Farmer'; 
// import nodemailer from 'nodemailer'; // 1. Import Nodemailer

// // --- EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // --- FIXED GET FUNCTION (Now supports filtering) ---
// export async function GET(request) {
//   await dbConnect();

//   // 1. Get Query Parameters from URL
//   const { searchParams } = new URL(request.url);
//   const farmerId = searchParams.get('farmerId');
//   const status = searchParams.get('status');

//   // 2. Build Query Object dynamically
//   let query = {};
//   if (farmerId) query.farmerId = farmerId; // Filter by Farmer ID
//   if (status) query.status = status;       // Filter by Status (e.g. 'Pending')

//   try {
//     // 3. Find with the specific query
//     const loans = await Loan.find(query)
//       .populate('farmerId', 'name')
//       .sort({ date: -1 });
      
//     return NextResponse.json(loans);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const body = await req.json();
    
//     // 1. Create the Loan
//     const loan = await Loan.create(body);

//     // 2. Populate Farmer Data (Required to get the email address)
//     // We populate specific fields: name, email, phone
//     await loan.populate('farmerId', 'name email phone');

//     const farmer = loan.farmerId;

//     // 3. SEND EMAIL: If Farmer has an email address
//     if (farmer && farmer.email) {
//       try {
//         await transporter.sendMail({
//           from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//           to: farmer.email,
//           subject: "✅ Loan Sanctioned - Kisaan Connect",
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
//               <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
//                 <h1 style="margin: 0; font-size: 24px;">Loan Sanctioned</h1>
//               </div>
//               <div style="padding: 20px; color: #333;">
//                 <p>Dear <strong>${farmer.name}</strong>,</p>
//                 <p>We are pleased to inform you that your loan request has been successfully processed and sanctioned.</p>
                
//                 <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                   <table style="width: 100%; border-collapse: collapse;">
//                     <tr>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Loan ID</strong></td>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${loan._id}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Principal Amount</strong></td>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 18px; font-weight: bold;">₹ ${loan.amount}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Interest Rate</strong></td>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${loan.interestRate}% / month</td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 8px 0;"><strong>Date</strong></td>
//                       <td style="padding: 8px 0; text-align: right;">${new Date(loan.date).toLocaleDateString()}</td>
//                     </tr>
//                   </table>
//                 </div>

//                 <p style="font-size: 14px; line-height: 1.5;">
//                   <strong>Note:</strong> Interest will be calculated monthly on the principal amount. Please ensure timely repayment.
//                 </p>
                
//                 <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
//                 <p style="font-size: 12px; color: #888; text-align: center;">Kisaan Connect Mandi System</p>
//               </div>
//             </div>
//           `,
//         });
//         console.log(`Loan creation email sent to ${farmer.email}`);
//       } catch (emailError) {
//         console.error("Failed to send loan creation email:", emailError);
//         // We do not throw error here, so the loan is still created even if email fails
//       }
//     } else {
//         console.log("No email found for this farmer, skipping notification.");
//     }

//     return NextResponse.json(loan, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Loan from '@/models/Loan';
import Farmer from '@/models/Farmer'; 
import nodemailer from 'nodemailer';
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- GET FUNCTION (Supports Filtering & Isolation) ---
export async function GET(request) {
  await dbConnect();

  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Get Query Parameters
  const { searchParams } = new URL(request.url);
  const farmerId = searchParams.get('farmerId');
  const status = searchParams.get('status');

  // 3. Build Query (ISOLATION ENFORCED HERE)
  let query = { arthiyaId: session.user.id }; // Base query: Only show my loans
  
  if (farmerId) query.farmerId = farmerId; 
  if (status) query.status = status;       

  try {
    // 4. Fetch Loans
    const loans = await Loan.find(query)
      .populate('farmerId', 'name')
      .sort({ date: -1 });
      
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}

// --- POST FUNCTION (Create Loan & Send Dark Theme Email) ---
export async function POST(req) {
  await dbConnect();

  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await req.json();
    
    // 2. Create the Loan (WITH OWNERSHIP)
    const loan = await Loan.create({
        ...body,
        arthiyaId: session.user.id // <--- Link to logged in user
    });

    // 3. Populate Farmer Data to get email
    await loan.populate('farmerId', 'name email phone');
    const farmer = loan.farmerId;

    // 4. SEND EMAIL
    if (farmer && farmer.email) {
      try {
        // Premium Dark Theme Template for Loan Sanction
        const mailOptions = {
          from: `"Kisaan Connect Accounts" <${process.env.EMAIL_USER}>`,
          to: farmer.email,
          subject: "✅ Loan Sanctioned - Kisaan Connect",
          html: `
            <!DOCTYPE html>
            <html>
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
                        <td style="background-color: #111111; padding: 40px; border-radius: 16px; border: 1px solid #333333; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                          
                          <div style="border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 25px; text-align: center;">
                             <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Loan Application Approved</h2>
                             <p style="color: #22c55e; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">Sanction Successful</p>
                          </div>

                          <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 20px;">Dear <strong>${farmer.name}</strong>,</p>
                          
                          <p style="color: #a3a3a3; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                             We are pleased to inform you that your loan request has been processed. The funds have been allocated to your account.
                          </p>

                          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #333; margin-bottom: 30px;">
                             <h3 style="color: #fff; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">Loan Details</h3>
                             
                             <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Loan ID</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${loan._id.toString().slice(-6).toUpperCase()}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Sanction Date</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${new Date(loan.date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Interest Rate</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${loan.interestRate}% / month</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-top: 10px; border-top: 1px solid #333;">Principal Amount</td>
                                   <td style="color: #22c55e; font-size: 18px; font-weight: bold; text-align: right; padding-top: 10px; border-top: 1px solid #333;">₹ ${loan.amount.toLocaleString()}</td>
                                </tr>
                             </table>
                          </div>

                          <p style="color: #666; font-size: 13px; line-height: 1.5; margin: 0;">
                             <strong>Note:</strong> Interest is calculated monthly. You can track your loan status or make repayments through your Mandi Dashboard.
                          </p>

                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="padding-top: 30px; padding-bottom: 40px;">
                           <p style="color: #444444; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.
                          </p>
                          <p style="color: #444444; font-size: 12px; margin: 5px 0 0 0;">
                            Chandigarh, India
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Loan creation email sent to ${farmer.email}`);
      } catch (emailError) {
        console.error("Failed to send loan creation email:", emailError);
      }
    } else {
        console.log("No email found for this farmer, skipping notification.");
    }

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}