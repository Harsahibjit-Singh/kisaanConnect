// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Sale from '@/models/Sale';
// import Farmer from '@/models/Farmer';
// import nodemailer from 'nodemailer';

// // --- EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // e.g., field2factory@gmail.com
//     pass: process.env.EMAIL_PASS, // Your App Password
//   },
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     // 1. Destructure pdfData (Base64 string) from the request
//     const { farmerId, cropType, quantity, price, commissionRate, pdfData } = await req.json();
    
//     // 2. Database Logic
//     const totalAmount = quantity * price;
//     const commission = totalAmount * (commissionRate / 100);

//     const sale = await Sale.create({
//       farmerId,
//       cropType,
//       quantity,
//       price,
//       totalAmount,
//       commission,
//       date: new Date()
//     });

//     // 3. Fetch Farmer Email
//     const farmer = await Farmer.findById(farmerId);
    
//     // 4. Send Email if Farmer has an email address
//     if (farmer && farmer.email && pdfData) {
//       // Remove the data:application/pdf;base64, prefix if present
//       const base64Content = pdfData.split(',')[1];

//       await transporter.sendMail({
//         from: `"Kisaan Connect Mandi" <${process.env.EMAIL_USER}>`,
//         to: farmer.email,
//         subject: `J-Form Receipt - ${new Date().toLocaleDateString()}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; padding: 20px;">
//             <h2 style="color: #16a34a;">Sale Confirmation</h2>
//             <p>Dear ${farmer.name},</p>
//             <p>Your produce (<strong>${cropType}</strong>, ${quantity} Qt) has been successfully auctioned.</p>
//             <p>Please find the attached J-Form (PDF) for your records.</p>
//             <br/>
//             <p>Regards,<br/><strong>Kisaan Connect Team</strong></p>
//           </div>
//         `,
//         attachments: [
//           {
//             filename: `J-Form-${sale._id}.pdf`,
//             content: base64Content,
//             encoding: 'base64',
//           },
//         ],
//       });
//     }

//     return NextResponse.json(sale, { status: 201 });
//   } catch (error) {
//     console.error("Sale Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// // ... GET method remains the same ...
// export async function GET(req) {
//   await dbConnect();
//   const { searchParams } = new URL(req.url);
//   const farmerId = searchParams.get('farmerId');
//   let query = {};
//   if (farmerId) query.farmerId = farmerId;
//   try {
//     const sales = await Sale.find(query).populate('farmerId', 'name phone').sort({ date: -1 });
//     return NextResponse.json(sales);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
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

export async function POST(req) {
  await dbConnect();

  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    // 2. Destructure Data
    const { farmerId, cropType, quantity, price, commissionRate, pdfData } = await req.json();
    
    // 3. Calculations
    const totalAmount = quantity * price;
    const commission = totalAmount * (commissionRate / 100);

    // 4. Create Sale (WITH OWNERSHIP)
    const sale = await Sale.create({
      arthiyaId: session.user.id, // <--- Link to logged in user
      farmerId,
      cropType,
      quantity,
      price,
      totalAmount,
      commission,
      date: new Date()
    });

    // 5. Fetch Farmer Details for Email
    const farmer = await Farmer.findById(farmerId);
    
    // 6. Send Email if possible
    if (farmer && farmer.email && pdfData) {
      try {
        // Clean Base64 string for attachment
        const base64Content = pdfData.includes('base64,') ? pdfData.split(',')[1] : pdfData;
        
        // --- PREMIUM DARK THEME TEMPLATE ---
        const mailOptions = {
          from: `"Kisaan Connect Mandi" <${process.env.EMAIL_USER}>`,
          to: farmer.email,
          subject: `📄 J-Form Issued: ${cropType} Sale`,
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
                          
                          <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 25px;">
                             <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Sale Confirmation</h2>
                             <p style="color: #22c55e; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">J-Form Generated</p>
                          </div>

                          <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 20px;">Dear <strong>${farmer.name}</strong>,</p>
                          
                          <p style="color: #d4d4d4; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                             Your produce has been successfully auctioned at the Mandi. The official J-Form for this transaction is attached to this email.
                          </p>

                          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #333; margin-bottom: 30px;">
                             <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Crop</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px; font-weight: bold;">${cropType}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Weight</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${quantity} Qt</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Rate</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">₹${price} / Qt</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-top: 10px; border-top: 1px solid #333;">Total Amount</td>
                                   <td style="color: #22c55e; font-size: 18px; font-weight: bold; text-align: right; padding-top: 10px; border-top: 1px solid #333;">₹${totalAmount.toLocaleString()}</td>
                                </tr>
                             </table>
                          </div>

                          <p style="color: #666; font-size: 13px; text-align: center; margin: 0;">
                             Please download the attached PDF for your legal records.
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
          `,
          attachments: [
            {
              filename: `J-Form-${sale._id}.pdf`,
              content: base64Content,
              encoding: 'base64',
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`J-Form sent to ${farmer.email}`);

      } catch (emailError) {
        console.error("Failed to send J-Form email:", emailError);
        // We log but do not fail the request, as the Sale is already saved
      }
    }

    return NextResponse.json(sale, { status: 201 });

  } catch (error) {
    console.error("Sale Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- GET Method (ISOLATED) ---
export async function GET(req) {
  await dbConnect();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const farmerId = searchParams.get('farmerId');
  
  // 2. ISOLATION: Only find sales for this Arthiya
  let query = { arthiyaId: session.user.id };
  
  if (farmerId) query.farmerId = farmerId;
  
  try {
    const sales = await Sale.find(query).populate('farmerId', 'name phone').sort({ date: -1 });
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}