import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Arthiya from '@/models/Arthiya';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// --- GET: Fetch Profile Data ---
export async function GET(req) {
  await dbConnect();
  
  // 1. Get current user session
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Find user by ID (Faster than email)
    const user = await Arthiya.findById(session.user.id).select('-password'); 

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT: Update Profile Data ---
export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Prevent updating sensitive fields
    delete body.email; 
    delete body.password;
    delete body._id;
    delete body.googleId;

    // Update user using ID
    const updatedUser = await Arthiya.findByIdAndUpdate(
      session.user.id,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}