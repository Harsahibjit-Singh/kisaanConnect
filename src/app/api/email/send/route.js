// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//   try {
//     const { farmerName, farmerEmail, cropType, quantity, price, totalAmount, date } = await req.json();

//     if (!farmerEmail) {
//       return NextResponse.json({ message: 'No email provided for this farmer, skipped sending.' }, { status: 200 });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // or your SMTP host
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Kisaan Connect" <${process.env.EMAIL_USER}>`,
//       to: farmerEmail,
//       subject: `Sale Receipt - ${cropType}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
//           <h2 style="color: #16a34a;">Kisaan Connect - Sale Receipt</h2>
//           <p>Dear <strong>${farmerName}</strong>,</p>
//           <p>Your produce has been successfully sold at the Mandi. Here are the details:</p>
          
//           <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//             <tr style="background-color: #f3f4f6;">
//               <th style="padding: 8px; text-align: left;">Item</th>
//               <th style="padding: 8px; text-align: right;">Value</th>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;">Crop</td>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${cropType}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;">Quantity</td>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${quantity} kg</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;">Rate</td>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${price}/kg</td>
//             </tr>
//             <tr style="font-weight: bold; font-size: 1.1em;">
//               <td style="padding: 8px;">Total Earned</td>
//               <td style="padding: 8px; text-align: right;">₹${totalAmount}</td>
//             </tr>
//           </table>

//           <p style="margin-top: 20px; font-size: 0.9em; color: #666;">Date: ${new Date(date).toLocaleDateString()}</p>
//           <p style="text-align: center; margin-top: 30px; color: #888;">Thank you for trusting Kisaan Connect.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

//   } catch (error) {
//     console.error('Email error:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { farmerName, farmerEmail, cropType, quantity, price, totalAmount, date } = await req.json();

    // 1. Skip if no email is provided (no error, just skip)
    if (!farmerEmail) {
      return NextResponse.json({ message: 'No email provided for this farmer, skipped sending.' }, { status: 200 });
    }

    // 2. Configure Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Prepare Receipt Date
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // ---------------------------------------------------------
    // 4. PREMIUM DARK RECEIPT TEMPLATE
    // ---------------------------------------------------------
    const mailOptions = {
      from: `"Kisaan Connect Accounts" <${process.env.EMAIL_USER}>`,
      to: farmerEmail,
      subject: `✅ Sale Receipt: ₹${totalAmount} - ${cropType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
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
                        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Sale Confirmation</h2>
                        <p style="color: #22c55e; margin: 10px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                          Transaction Successful
                        </p>
                      </div>

                      <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 20px;">
                        Dear <strong>${farmerName}</strong>,
                      </p>
                      <p style="color: #a3a3a3; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                        Your produce has been successfully sold at the Mandi. Below is the digital receipt for your records.
                      </p>

                      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
                        
                        <tr>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #888; font-size: 14px;">Crop Type</td>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: right; font-weight: bold;">${cropType}</td>
                        </tr>

                        <tr>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #888; font-size: 14px;">Quantity Sold</td>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: right;">${quantity} kg</td>
                        </tr>

                        <tr>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #888; font-size: 14px;">Market Rate</td>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: right;">₹${price} / kg</td>
                        </tr>

                        <tr>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #888; font-size: 14px;">Date</td>
                          <td style="padding: 15px 20px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: right;">${formattedDate}</td>
                        </tr>

                        <tr>
                          <td style="padding: 20px; background-color: #22c55e; color: #000; font-size: 16px; font-weight: bold;">Total Earnings</td>
                          <td style="padding: 20px; background-color: #22c55e; color: #000; font-size: 20px; font-weight: bold; text-align: right;">₹${totalAmount.toLocaleString('en-IN')}</td>
                        </tr>

                      </table>

                      <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
                        This is a system generated receipt. No signature required.
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

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}