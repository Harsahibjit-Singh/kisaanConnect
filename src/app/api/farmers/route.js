// // import { NextResponse } from 'next/server';
// // import dbConnect from '@/lib/mongodb';
// // import Farmer from '@/models/Farmer';

// // export async function GET() {
// //   await dbConnect();
// //   try {
// //     const farmers = await Farmer.find({}).sort({ createdAt: -1 });
// //     return NextResponse.json(farmers);
// //   } catch (error) {
// //     return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
// //   }
// // }

// // export async function POST(req) {
// //   await dbConnect();
// //   try {
// //     const body = await req.json();

// //     // --- UNIQUENESS CHECK ---
// //     const existingFarmer = await Farmer.findOne({ aadhar: body.aadhar });
// //     if (existingFarmer) {
// //       return NextResponse.json(
// //         { error: `Farmer with Aadhaar ${body.aadhar} already exists.` },
// //         { status: 409 } // 409 Conflict
// //       );
// //     }

// //     const farmer = await Farmer.create(body);
// //     return NextResponse.json(farmer, { status: 201 });
// //   } catch (error) {
// //     // Handle Mongoose duplicate key error (fallback)
// //     if (error.code === 11000) {
// //         const field = Object.keys(error.keyPattern)[0];
// //         return NextResponse.json({ error: `${field.toUpperCase()} already exists.` }, { status: 409 });
// //     }
// //     return NextResponse.json({ error: error.message }, { status: 400 });
// //   }
// // }


// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
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

// export async function GET() {
//   await dbConnect();
//   try {
//     const farmers = await Farmer.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(farmers);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const body = await req.json();

//     // --- 1. DUPLICATE CHECK ---
//     const existingFarmer = await Farmer.findOne({ aadhar: body.aadhar });
//     if (existingFarmer) {
//       return NextResponse.json(
//         { error: `Farmer with Aadhaar ${body.aadhar} already exists.` },
//         { status: 409 }
//       );
//     }

//     // --- 2. CREATE FARMER ---
//     const farmer = await Farmer.create(body);

//     // --- 3. SEND WELCOME EMAIL ---
//     // Check if email exists before trying to send
//     if (farmer.email) {
//       try {
//         await transporter.sendMail({
//           from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//           to: farmer.email,
//           subject: "🎉 Welcome to Kisaan Connect - Account Created",
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
//               <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
//                 <h1 style="margin: 0; font-size: 24px;">Welcome Aboard!</h1>
//               </div>
//               <div style="padding: 20px; color: #333;">
//                 <p>Dear <strong>${farmer.name}</strong>,</p>
//                 <p>Your farmer profile has been successfully created in the Kisaan Connect Mandi System.</p>
                
//                 <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                   <h3 style="margin-top: 0; color: #16a34a;">Profile Details</h3>
//                   <table style="width: 100%; border-collapse: collapse;">
//                     <tr>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Farmer ID</strong></td>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${farmer._id}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td>
//                       <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${farmer.phone}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 8px 0;"><strong>Aadhaar (Last 4)</strong></td>
//                       <td style="padding: 8px 0; text-align: right;">xxxx-xxxx-${farmer.aadhar.slice(-4)}</td>
//                     </tr>
//                   </table>
//                 </div>

//                 <p>You can now avail Mandi services including sales tracking and loan facilities.</p>
                
//                 <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
//                 <p style="font-size: 12px; color: #888; text-align: center;">Kisaan Connect Mandi System</p>
//               </div>
//             </div>
//           `,
//         });
//         console.log(`Welcome email sent to ${farmer.email}`);
//       } catch (emailError) {
//         console.error("Failed to send welcome email:", emailError);
//         // Note: We don't return an error to the client here because the account was created successfully.
//       }
//     } else {
//         console.log("No email provided for this farmer, skipping welcome email.");
//     }

//     return NextResponse.json(farmer, { status: 201 });

//   } catch (error) {
//     // Handle Mongoose duplicate key error (fallback)
//     if (error.code === 11000) {
//         const field = Object.keys(error.keyPattern)[0];
//         return NextResponse.json({ error: `${field.toUpperCase()} already exists.` }, { status: 409 });
//     }
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }



import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import nodemailer from 'nodemailer';
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function GET(req) {
  await dbConnect();

  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. ISOLATION: Only fetch farmers belonging to THIS Arthiya
    const farmers = await Farmer.find({ arthiyaId: session.user.id })
                                .sort({ createdAt: -1 });
                                
    return NextResponse.json(farmers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  
  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 2. DUPLICATE CHECK (SCOPED)
    // Only check if THIS Arthiya has already added this Aadhar
    const existingFarmer = await Farmer.findOne({ 
        aadhar: body.aadhar,
        arthiyaId: session.user.id 
    });

    if (existingFarmer) {
      return NextResponse.json(
        { error: `You have already registered a farmer with Aadhaar ${body.aadhar}.` },
        { status: 409 }
      );
    }

    // 3. CREATE FARMER WITH OWNERSHIP
    const farmerData = {
        ...body,
        arthiyaId: session.user.id // <--- Link to logged in user
    };

    const farmer = await Farmer.create(farmerData);

    // 4. SEND WELCOME EMAIL (If email exists)
    if (farmer.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Premium Dark Welcome Template for Farmers
        const mailOptions = {
          from: `"Kisaan Connect Mandi" <${process.env.EMAIL_USER}>`,
          to: farmer.email,
          subject: "🎉 Welcome to Kisaan Connect Mandi",
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
                          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Welcome Aboard, ${farmer.name}!</h2>
                          
                          <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Your farmer profile has been successfully created in the Kisaan Connect Mandi System. You are now linked to our digital network.
                          </p>

                          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #333; margin-bottom: 30px;">
                             <h3 style="color: #22c55e; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">Registered Profile</h3>
                             
                             <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Farmer ID</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${farmer._id.toString().slice(-6).toUpperCase()}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Phone Number</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${farmer.phone}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px; padding-bottom: 10px;">Village/City</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right; padding-bottom: 10px;">${farmer.village || 'N/A'}</td>
                                </tr>
                                <tr>
                                   <td style="color: #888; font-size: 14px;">Aadhaar (Last 4)</td>
                                   <td style="color: #fff; font-size: 14px; text-align: right;">xxxx-xxxx-${farmer.aadhar.slice(-4)}</td>
                                </tr>
                             </table>
                          </div>

                          <p style="color: #a3a3a3; font-size: 15px; margin: 0;">
                            You can now avail all Mandi services including sales tracking, instant receipts, and loan facilities directly through your Arthiya.
                          </p>

                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="padding-top: 30px; padding-bottom: 40px;">
                           <p style="color: #444444; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.
                          </p>
                          <p style="color: #444444; font-size: 12px; margin: 5px 0 0 0;">
                            Digital Mandi System
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
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return NextResponse.json(farmer, { status: 201 });

  } catch (error) {
    // 5. HANDLE MONGODB DUPLICATE ERROR
    // This catches race conditions where logic check passed but DB constraint failed
    if (error.code === 11000) {
        // If it was the compound index (aadhar + arthiyaId)
        if (error.keyPattern?.aadhar) {
            return NextResponse.json({ error: `You have already registered a farmer with this Aadhaar.` }, { status: 409 });
        }
        const field = Object.keys(error.keyPattern)[0];
        return NextResponse.json({ error: `${field.toUpperCase()} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}