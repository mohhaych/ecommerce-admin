import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Add other providers as needed
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add more providers as needed
  ],
  // Additional NextAuth.js configurations can go here
  adapter: MongoDBAdapter(client),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
