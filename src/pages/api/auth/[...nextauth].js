import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '../../../lib/mongodb';
import { User } from '../../../lib/models';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId:     process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user || !user.password) throw new Error('Invalid credentials');
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error('Invalid credentials');
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, subscriptionTier: user.subscriptionTier };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'credentials') return true;
      await connectDB();
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await User.create({
          name: user.name, email: user.email, image: user.image,
          provider: account.provider, providerId: account.providerAccountId,
          role: 'collector', isVerified: true,
        });
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role             = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.id               = user.id;
      }
      // Always refresh role/tier from DB on token update
      if (trigger === 'update' || !token.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.role             = dbUser.role;
          token.subscriptionTier = dbUser.subscriptionTier;
          token.id               = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role             = token.role || 'collector';
      session.user.subscriptionTier = token.subscriptionTier || 'free';
      session.user.id               = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error:  '/auth/error',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
