import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Arthiya from '@/models/Arthiya';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await dbConnect();
  
  try {
    const { email } = await req.json();

    const user = await Arthiya.findOne({ email });
    if (!user) {
      // For security, standard practice is to respond with success even if email doesn't exist
      // to prevent email enumeration, but for now we return 404 as requested.
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // 1. Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // 2. Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 4. Prepare Email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- PREMIUM DARK THEME EMAIL TEMPLATE ---
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto;">
                
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <h1 style="color: #22c55e; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -1px;">
                      Kisaan<span style="color: #ffffff;">Connect</span>
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #111111; padding: 40px; border-radius: 16px; border: 1px solid #333333; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; font-size: 22px;">Reset Your Password</h2>
                    
                    <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      We received a request to reset the password for your Kisaan Connect account. Click the button below to set a new password.
                    </p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="background-color: #22c55e; color: #000000; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-top: 40px; margin-bottom: 0; text-align: center;">
                      If you did not request this, please ignore this email.<br>
                      This link will expire in 10 minutes.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top: 30px; padding-bottom: 40px;">
                    <p style="color: #444444; font-size: 12px; margin: 0;">
                      &copy; ${new Date().getFullYear()} Kisaan Connect Pvt Ltd. All rights reserved.
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
    `;

    await transporter.sendMail({
      from: `"Kisaan Connect Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔒 Reset Your Kisaan Connect Password',
      html: message,
    });

    return NextResponse.json({ message: 'Email sent' });

  } catch (error) {
    console.error("Forgot PW Error:", error);
    return NextResponse.json({ error: 'Email could not be sent' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Arthiya from '@/models/Arthiya';
// import crypto from 'crypto';
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const { email } = await req.json();

//     const user = await Arthiya.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: 'Email not found' }, { status: 404 });
//     }

//     // 1. Generate & Hash Token
//     const resetToken = crypto.randomBytes(20).toString('hex');
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     // 2. Set fields manually
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins from now
    
//     // 3. FORCE SAVE
//     const savedUser = await user.save();

//     // ============================================================
//     // 🔍 DIAGNOSTIC SELF-CHECK (Start)
//     // ============================================================
//     console.log("--- DIAGNOSTIC CHECK ---");
//     console.log("1. Generated Token:", resetToken);
//     console.log("2. Hashed Token:", hashedToken);
    
//     // Check if the saved object in memory has the token
//     if (!savedUser.resetPasswordToken) {
//         console.error("❌ ERROR: Mongoose ignored the token field. Check your Schema!");
//         return NextResponse.json({ error: 'CRITICAL: Database Schema missing resetPasswordToken field' }, { status: 500 });
//     }

//     // Check if we can actually find it in the DB immediately
//     const verifyDb = await Arthiya.findOne({ resetPasswordToken: hashedToken });
//     if (!verifyDb) {
//         console.error("❌ ERROR: Token was not persisted to DB.");
//         return NextResponse.json({ error: 'CRITICAL: Token not saved to DB' }, { status: 500 });
//     }
//     console.log("✅ SUCCESS: Token verified in Database.");
//     // ============================================================
//     // 🔍 DIAGNOSTIC SELF-CHECK (End)
//     // ============================================================

//     // 4. Send Email (Only if DB check passed)
//     const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const message = `
//       <!DOCTYPE html>
//       <html>
//       <body style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px;">
//         <h1 style="color: #22c55e;">Password Reset</h1>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}" style="background-color: #22c55e; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
//         <p style="color: #666; margin-top: 20px;">Link expires in 10 minutes.</p>
//       </body>
//       </html>
//     `;

//     await transporter.sendMail({
//       from: `"Kisaan Connect Security" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: '🔒 Reset Your Kisaan Connect Password',
//       html: message,
//     });

//     return NextResponse.json({ message: 'Email sent' });

//   } catch (error) {
//     console.error("Forgot PW Error:", error);
//     return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
//   }
// }