// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Arthiya from '@/models/Arthiya';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password } = await req.json();

//     const existingUser = await Arthiya.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await Arthiya.create({ name, email, password: hashedPassword });

//     return NextResponse.json({ message: 'Arthiya registered successfully', user }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Arthiya from '@/models/Arthiya';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    // 1. Check if user exists
    const existingUser = await Arthiya.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Create User
    const user = await Arthiya.create({ name, email, password: hashedPassword });

    // ---------------------------------------------------------
    // 4. SEND WELCOME EMAIL
    // ---------------------------------------------------------
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Premium Dark Theme Welcome Template
        const mailOptions = {
            from: `"Kisaan Connect Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🌱 Welcome to Kisaan Connect!',
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
                            <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Welcome Aboard, ${name}!</h2>
                            
                            <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                              Thank you for joining Kisaan Connect. We are thrilled to have you as part of India's most advanced digital agriculture ecosystem.
                            </p>

                            <div style="background-color: #0A0A0A; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                <p style="color: #fff; margin: 0; font-size: 14px;">
                                    <strong>Your Role:</strong> Arthiya (Commission Agent)<br>
                                    <strong>Access:</strong> Full Dashboard Control
                                </p>
                            </div>

                            <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                              You can now manage your farmers, track sales, and oversee loans directly from your dashboard.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td align="center">
                                  <a href="${process.env.NEXTAUTH_URL}/login" style="background-color: #22c55e; color: #000000; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">
                                    Login to Dashboard
                                  </a>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding-top: 30px; padding-bottom: 40px;">
                             <p style="color: #444444; font-size: 12px; margin: 0;">
                              &copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.
                            </p>
                            <p style="color: #444444; font-size: 12px; margin: 5px 0 0 0;">
                              Empowering Indian Agriculture
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

        // Send email (don't await strictly to keep signup fast, or await if you want to ensure delivery)
        await transporter.sendMail(mailOptions);

    } catch (emailError) {
        console.error("Welcome email failed:", emailError);
        // We do not fail the registration if email fails
    }

    return NextResponse.json({ message: 'Arthiya registered successfully', user }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}