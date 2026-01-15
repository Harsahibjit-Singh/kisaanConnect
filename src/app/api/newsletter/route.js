// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Newsletter from '@/models/Newsletter';
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: 'Email is required' }, { status: 400 });
//     }

//     // 1. Check if already subscribed
//     const existingSubscriber = await Newsletter.findOne({ email });
//     if (existingSubscriber) {
//       return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 });
//     }

//     // 2. Save to Database
//     await Newsletter.create({ email });

//     // 3. Send Confirmation Email
//     try {
//       await transporter.sendMail({
//         from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "🌱 Welcome to Kisaan Connect Newsletter",
//         html: `
//           <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
//             <h2 style="color: #16a34a;">Welcome to the Family!</h2>
//             <p>Thank you for subscribing to the Kisaan Connect newsletter.</p>
//             <p>You will now receive daily market rates, agricultural updates, and platform news directly in your inbox.</p>
//             <br/>
//             <p>Regards,<br/>Team Kisaan Connect</p>
//           </div>
//         `,
//       });
//     } catch (emailError) {
//       console.error("Newsletter email failed:", emailError);
//       // We don't fail the request if email fails, as DB save was successful
//     }

//     return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  await connectDB();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 });
    }

    // 2. Save to Database
    await Newsletter.create({ email });

    // 3. Send Confirmation Email
    try {
      // Premium Dark Theme Newsletter Welcome
      await transporter.sendMail({
        from: `"Kisaan Connect Updates" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🌱 Welcome to the Kisaan Connect Family",
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
                          
                          <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 25px; margin-bottom: 25px;">
                             <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to the Family!</h2>
                             <p style="color: #22c55e; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">Subscription Active</p>
                          </div>
                          
                          <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for subscribing to the Kisaan Connect newsletter. You have joined a community dedicated to modernizing agriculture.
                          </p>

                          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 30px;">
                             <p style="color: #fff; font-size: 15px; margin: 0 0 10px 0; font-weight: bold;">What to expect:</p>
                             <ul style="color: #d4d4d4; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Daily Mandi Market Rates</li>
                                <li>Weather Alerts & Crop Advisories</li>
                                <li>Platform Updates & Feature Releases</li>
                             </ul>
                          </div>

                          <p style="color: #a3a3a3; font-size: 15px; line-height: 1.6; margin: 0;">
                            Stay tuned for our next update. We promise to keep your inbox green and growing!
                          </p>

                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="padding-top: 30px; padding-bottom: 40px;">
                           <p style="color: #444444; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.
                          </p>
                          <p style="color: #444444; font-size: 12px; margin: 5px 0 0 0;">
                            <a href="#" style="color: #666; text-decoration: none;">Unsubscribe</a>
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
      });
    } catch (emailError) {
      console.error("Newsletter email failed:", emailError);
      // We don't fail the request if email fails, as DB save was successful
    }

    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}