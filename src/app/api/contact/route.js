// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//   try {
//     const { name, email, phone, subject, message } = await req.json();

//     // 1. Configure Nodemailer Transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // You can use other services (SendGrid, AWS SES) if preferred
//       auth: {
//         user: process.env.EMAIL_USER, // Your Gmail address
//         pass: process.env.EMAIL_PASS, // Your Gmail App Password
//       },
//     });

//     // 2. Email to Admin (field2factory@gmail.com)
//     const adminMailOptions = {
//       from: `"Kisaan Connect Web" <${process.env.EMAIL_USER}>`,
//       to: 'field2factory@gmail.com', // Admin Email
//       replyTo: email,
//       subject: `New Contact Query: ${subject}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
//           <h2 style="color: #16a34a;">New Message Received</h2>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <hr />
//           <p><strong>Message:</strong></p>
//           <p style="background-color: #f9f9f9; padding: 15px;">${message}</p>
//         </div>
//       `,
//     };

//     // 3. Confirmation Email to User
//     const userMailOptions = {
//       from: `"Kisaan Connect Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `We received your message - Kisaan Connect`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #16a34a;">Hello ${name},</h2>
//           <p>Thank you for reaching out to <strong>Kisaan Connect</strong>.</p>
//           <p>We have successfully received your query regarding <strong>"${subject}"</strong>.</p>
//           <p>Our support team will review your message and get back to you within 24 hours.</p>
//           <br />
//           <p>Best Regards,</p>
//           <p><strong>Team Kisaan Connect</strong></p>
//           <p style="color: #888; font-size: 12px;">This is an automated message. Please do not reply directly to this email.</p>
//         </div>
//       `,
//     };

//     // Send both emails concurrently
//     await Promise.all([
//       transporter.sendMail(adminMailOptions),
//       transporter.sendMail(userMailOptions)
//     ]);

//     return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });

//   } catch (error) {
//     console.error('Email Error:', error);
//     return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // 1. Configure Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ---------------------------------------------------------
    // 2. EMAIL TO ADMIN (You) - Dark Theme
    // ---------------------------------------------------------
    const adminMailOptions = {
      from: `"Kisaan Connect Web" <${process.env.EMAIL_USER}>`,
      to: 'field2factory@gmail.com', // Admin receives this
      replyTo: email,
      subject: `📩 New Inquiry: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <div style="border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0; font-size: 24px;">New Contact Query</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Received via Kisaan Connect Website</p>
            </div>

            <div style="background-color: #111111; padding: 30px; border-radius: 12px; border: 1px solid #333;">
              
              <div style="margin-bottom: 20px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0;">Sender Name</p>
                <p style="color: #fff; font-size: 16px; margin: 0; font-weight: bold;">${name}</p>
              </div>

              <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="flex: 1;">
                   <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0;">Email Address</p>
                   <a href="mailto:${email}" style="color: #22c55e; font-size: 16px; margin: 0; text-decoration: none;">${email}</a>
                </div>
                <div style="flex: 1;">
                   <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0;">Phone Number</p>
                   <p style="color: #fff; font-size: 16px; margin: 0;">${phone || 'N/A'}</p>
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0;">Subject</p>
                <p style="color: #fff; font-size: 16px; margin: 0;">${subject}</p>
              </div>

              <div>
                <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0;">Message Content</p>
                <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 3px solid #22c55e;">
                  <p style="color: #d4d4d4; font-size: 15px; line-height: 1.6; margin: 0;">${message}</p>
                </div>
              </div>

            </div>
            
            <p style="color: #444; font-size: 12px; text-align: center; margin-top: 30px;">
              System generated email.
            </p>

          </div>
        </body>
        </html>
      `,
    };

    // ---------------------------------------------------------
    // 3. CONFIRMATION EMAIL TO USER - Dark Theme
    // ---------------------------------------------------------
    const userMailOptions = {
      from: `"Kisaan Connect Support" <${process.env.EMAIL_USER}>`,
      to: email, // User receives this
      subject: `We've received your message - Kisaan Connect`,
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
                      <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; font-size: 22px;">Hello ${name},</h2>
                      
                      <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for reaching out to us. We have successfully received your query regarding <strong>"${subject}"</strong>.
                      </p>

                      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
                          <p style="color: #fff; margin: 0; font-size: 14px;">
                             <strong>Our Promise:</strong><br>
                             Our support team is reviewing your message and will get back to you within 24 hours.
                          </p>
                      </div>

                      <p style="color: #a3a3a3; font-size: 15px; margin: 0;">
                        In the meantime, feel free to browse our <a href="${process.env.NEXTAUTH_URL}/services" style="color: #22c55e; text-decoration: none;">latest services</a> on the dashboard.
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
    };

    // Send both emails concurrently
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Email Error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}