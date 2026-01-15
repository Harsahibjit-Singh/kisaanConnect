import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // 1. Check for session token
  const token = request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('__Secure-next-auth.session-token')?.value ||
                request.cookies.get('token')?.value;

  // 2. Define "Guest Only" paths 
  // (Pages that logged-in users should NOT see)
  const isGuestOnlyPath = path === '/' || path === '/login' || path === '/signup' || path === '/register';

  // 3. LOGIC: If user is Logged In AND tries to access a Guest Path (like Home or Login)
  if (token && isGuestOnlyPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. LOGIC: If user is NOT Logged In AND tries to access a Protected Route
  // (We explicitly check for protected paths here to be safe)
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/myprofile');
  
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// --- CONFIGURATION ---
export const config = {
  matcher: [
    // 1. Match the Guest Paths (So middleware runs on them)
    '/',
    '/login',
    '/signup',
    '/register',
    
    // 2. Match the Protected Paths
    '/dashboard/:path*',
    '/myprofile/:path*',
  ],
};