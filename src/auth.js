import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Ensure database connection
        await connectDB();

        // Validate credentials input
        if (!credentials || !credentials.email || !credentials.password) {
          console.error('Authorize Error: Missing credentials');
          return null; // Return null for invalid input
        }

        try {
          // Find user by email, ensuring password field is selected
          const user = await User.findOne({ email: credentials.email }).select('+password');

          // Check if user exists
          if (!user) {
            console.log(`Authorize Info: No user found for email: ${credentials.email}`);
            return null; // Return null if user not found
          }

          // Check if password is correct
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            console.log(`Authorize Info: Incorrect password for email: ${credentials.email}`);
            return null; // Return null for incorrect password
          }

          // Return essential user data for the session/token
          // Do NOT return the password hash
          console.log(`Authorize Success: User authenticated: ${credentials.email}`);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorize Error:', error);
          return null; // Return null on unexpected errors
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (on sign in), persist id and role to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token; // Return the token
    },
    async session({ session, token }) {
      // Add custom properties (id, role) from token to the session's user object
      if (token && session.user) {
        session.user.id = token.id; // Add id from token
        session.user.role = token.role; // Add role from token
      }
      return session; // Return the session
    }
  },
  pages: {
    signIn: '/login', // Redirect users to /login page for sign-in
    error: '/login', // Redirect users to /login page on errors (e.g., invalid credentials)
  },
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session strategy
  },
  // The secret is automatically inferred from the NEXTAUTH_SECRET env variable in v5
  // trustHost: true, // Consider adding this for deployment environments like Vercel
}); 