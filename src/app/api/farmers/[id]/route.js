// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Farmer from '@/models/Farmer';

// export async function GET(request, { params }) {
//   await dbConnect();
//   try {
//     const { id } = params;
//     const farmer = await Farmer.findById(id);
//     if (!farmer) {
//       return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
//     }
//     return NextResponse.json(farmer);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   await dbConnect();
//   try {
//     const { id } = params;
//     const body = await request.json();
//     const updatedFarmer = await Farmer.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedFarmer) {
//       return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
//     }
//     return NextResponse.json(updatedFarmer);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// export async function DELETE(request, { params }) {
//   await dbConnect();
//   try {
//     const { id } = params;
//     const deletedFarmer = await Farmer.findByIdAndDelete(id);
//     if (!deletedFarmer) {
//       return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
//     }
//     return NextResponse.json({ message: 'Farmer deleted successfully' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await dbConnect();
  
  // 1. SECURITY: Get Logged in User
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    // 2. ISOLATION: Only find if it belongs to THIS logged in user
    const farmer = await Farmer.findOne({ _id: id, arthiyaId: session.user.id });

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(farmer);
  } catch (error) {
    console.error("Error fetching farmer:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    // 2. ISOLATION: Update only if it matches ID AND Owner
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { _id: id, arthiyaId: session.user.id }, // Query
      body, 
      { new: true, runValidators: true }
    );

    if (!updatedFarmer) {
      return NextResponse.json({ error: 'Farmer not found or access denied' }, { status: 404 });
    }
    return NextResponse.json(updatedFarmer);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  
  // 1. SECURITY
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    
    // 2. ISOLATION: Delete only if it matches ID AND Owner
    const deletedFarmer = await Farmer.findOneAndDelete({ 
        _id: id, 
        arthiyaId: session.user.id 
    });

    if (!deletedFarmer) {
      return NextResponse.json({ error: 'Farmer not found or access denied' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}