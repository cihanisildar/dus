import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// Extend NextAuth types to include our custom user fields
interface ExtendedUser extends NextAuthUser {
    accountStatus: string;
    currentPeriodId?: Id<"examPeriods">;
}

// Type guard to check if user is ExtendedUser
function isExtendedUser(user: NextAuthUser): user is ExtendedUser {
    return "accountStatus" in user;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("E-posta ve şifre gereklidir");
                }

                const user = await convex.query(api.users.getByEmail, {
                    email: credentials.email,
                });

                if (!user) {
                    throw new Error("Kullanıcı bulunamadı");
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error("Geçersiz şifre");
                }

                // Update last login
                await convex.mutation(api.users.updateLastLogin, {
                    id: user._id,
                });

                return {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    accountStatus: user.accountStatus,
                    currentPeriodId: user.currentPeriodId,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                // Check if user exists
                const existingUser = await convex.query(api.users.getByEmail, {
                    email: user.email!,
                });

                if (!existingUser) {
                    // Create new user with Google account
                    await convex.mutation(api.users.create, {
                        name: user.name || "Google User",
                        email: user.email!,
                        phone: "", // Will be collected later if needed
                        passwordHash: "", // No password for Google users
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user && isExtendedUser(user)) {
                token.id = user.id;
                token.accountStatus = user.accountStatus;
                token.currentPeriodId = user.currentPeriodId;
            } else if (token.email) {
                // Refresh user data from Convex on each request
                const dbUser = await convex.query(api.users.getByEmail, {
                    email: token.email as string,
                });
                if (dbUser) {
                    token.id = dbUser._id;
                    token.accountStatus = dbUser.accountStatus;
                    token.currentPeriodId = dbUser.currentPeriodId;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as ExtendedUser).id = token.id as string;
                (session.user as ExtendedUser).accountStatus = token.accountStatus as string;
                (session.user as ExtendedUser).currentPeriodId = token.currentPeriodId as Id<"examPeriods"> | undefined;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
