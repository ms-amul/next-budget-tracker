import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '@/lib/mongo';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      await connectMongo();
      console.log(session);
      const user = await User.findOne({ email: session.user.email });
      token = user ? user._id.toString() : null;
      return session;
    },
    async signIn({ profile }) {
      await connectMongo();
      const user = await User.findOne({ email: profile.email });
      if (!user) {
        await User.create({
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
