import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';


export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {
        jwt({ token, user }) {

            if (user) {
                token.data = user;
            }

            return token;
        },
        session({ session }) {
            return session;
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                const user = await prisma?.user.findUnique({
                    where: {
                        email
                    }
                });

                if (!user) return null;

                if (!bcryptjs.compareSync(password, user.password))
                    return null;

                const { password: _, ...rest } = user;

                console.log(rest);

                return rest;
            },
        }),
    ]
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);