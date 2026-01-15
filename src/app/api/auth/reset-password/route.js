// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Arthiya from '@/models/Arthiya';
// import crypto from 'crypto';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const body = await req.json();
//     const { token, password } = body;

//     // 1. STRICT VALIDATION: Prevent crashes
//     if (!token || typeof token !== 'string') {
//         return NextResponse.json({ error: 'Missing or invalid token' }, { status: 400 });
//     }

//     if (!password || password.length < 6) {
//         return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
//     }

//     // 2. Hash the incoming token to match DB
//     const resetPasswordToken = crypto
//       .createHash('sha256')
//       .update(token)
//       .digest('hex');

//     // 3. Find user with matching token AND non-expired time
//     const user = await Arthiya.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() }, 
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
//     }

//     // 4. Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // 5. Clear reset fields (Token consumed)
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     return NextResponse.json({ message: 'Password reset successful' });

//   } catch (error) {
//     console.error("Reset Password API Error:", error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Arthiya from '@/models/Arthiya';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { token, password } = body;

    console.log("--- RESET ATTEMPT ---");
    console.log("Token Received:", token ? "YES (Length: " + token.length + ")" : "NO");

    // 1. STRICT VALIDATION: Return error if token is missing
    // This PREVENTS the "Received undefined" crash
    if (!token || typeof token !== 'string') {
        return NextResponse.json({ error: 'Missing or invalid token' }, { status: 400 });
    }

    if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // 2. Hash the incoming token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Find user
    const user = await Arthiya.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // 4. Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Clear fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    console.log("--- RESET SUCCESS ---");
    return NextResponse.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}











// issues 