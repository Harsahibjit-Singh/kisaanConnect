import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import Arthiya from '@/models/Arthiya';
import bcrypt from 'bcryptjs';

// 1. Export authOptions separately so other APIs can use it
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await Arthiya.findOne({ email: credentials.email });
        
        if (!user || !user.password) { // If user has no password (e.g. google only), fail
          throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return { id: user._id, name: user.name, email: user.email };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        await dbConnect();
        try {
          const existingUser = await Arthiya.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user if they don't exist
            await Arthiya.create({
              name: user.name,
              email: user.email,
              googleId: account.providerAccountId,
            });
          } else if (!existingUser.googleId) {
            // Link Google account to existing email account
            existingUser.googleId = account.providerAccountId;
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.log("Error checking if user exists: ", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      // Add user ID to session
      await dbConnect();
      const sessionUser = await Arthiya.findOne({ email: session.user.email });
      if (sessionUser) {
          session.user.id = sessionUser._id.toString();
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Pass authOptions to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };