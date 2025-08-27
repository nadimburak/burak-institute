import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel from '@/models/User';
import connectDB from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials){
                await connectDB();

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                const user = await UserModel.findOne({ email: credentials.email.toLowerCase()})
                    .select('+password')
                    .exec();

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await user.comparePassword(credentials.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }
                const userId = String(user._id)

                return {
                    id: userId,
                    email: user.email,
                    name: user.name,
                };
            }
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
        error: '/auth/error',
    }as any,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};