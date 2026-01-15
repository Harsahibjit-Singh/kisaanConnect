// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Arthiya from '@/models/Arthiya';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { email, password } = await req.json();

//     const user = await Arthiya.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
//     }

//     // In a real app, you would set a secure HTTP-only cookie here.
//     // For this scope, we return the user info to store in Client State/LocalStorage.
//     return NextResponse.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } }, { status: 200 });
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
    const { email, password } = await req.json();

    // 1. Check User
    const user = await Arthiya.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 3. SEND LOGIN ALERT EMAIL (New Addition)
    // ---------------------------------------------------------
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Premium Dark Theme Template for Login Alert
        const mailOptions = {
            from: `"Kisaan Connect Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🚨 New Login Detected - Kisaan Connect',
            html: `
              <!DOCTYPE html>
              <html>
              <body style="margin: 0; padding: 0; background-color: #000000; font-family: sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000;">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto;">
                        
                        <tr>
                          <td align="center" style="padding-bottom: 30px;">
                            <h1 style="color: #22c55e; margin: 0; font-size: 24px; letter-spacing: -1px;">
                              Kisaan<span style="color: #ffffff;">Connect</span>
                            </h1>
                          </td>
                        </tr>

                        <tr>
                          <td style="background-color: #111111; padding: 40px; border-radius: 16px; border: 1px solid #333333;">
                            <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">New Login Detected</h2>
                            
                            <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                              Hello <strong>${user.name}</strong>,<br/><br/>
                              We noticed a new login to your Kisaan Connect account.
                            </p>

                            <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0;">
                                <p style="color: #fff; margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${loginTime}</p>
                                <p style="color: #fff; margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Success</p>
                            </div>

                            <p style="color: #a3a3a3; font-size: 14px; margin-top: 30px;">
                              If this was you, you can safely ignore this email.<br/>
                              <span style="color: #ef4444;">If you did not authorize this login, please change your password immediately.</span>
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding-top: 30px;">
                            <p style="color: #555555; font-size: 12px;">&copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd.</p>
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

        // Send email without blocking the response if it fails
        await transporter.sendMail(mailOptions);

    } catch (emailError) {
        console.error("Failed to send login email:", emailError);
        // We continue execution so the user can still login even if email fails
    }

    // ---------------------------------------------------------
    // 4. Return Success Response
    // ---------------------------------------------------------
    return NextResponse.json({ 
        message: 'Login successful', 
        user: { id: user._id, name: user.name, email: user.email } 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}