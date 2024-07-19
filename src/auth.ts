import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { z, ZodError } from "zod";
import { randomBytes, randomUUID } from "crypto";
import { JWTEncodeParams, encode } from "next-auth/jwt";
import prisma from "./lib/prisma";
import Google from "next-auth/providers/google";
import { Prisma } from "@prisma/client";
import { FormLoginSchema } from "./lib/validate";

class InvalidCredentials extends CredentialsSignin {
    constructor(code: any) {
        super();
        this.code = code;
        this.message = code;
    }
}

// class InvalidCredentials extends AuthError {
//     public readonly kind = 'signIn';

//     constructor(code: any) {
//         super('Invalid credentials');
//         this.type = code;
//     }
// }

const adapter = PrismaAdapter(prisma);
export const {
    handlers,
    signIn,
    signOut,
    auth
} = NextAuth({
    adapter: adapter as Adapter,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: { params: { access_type: "offline", prompt: "consent" } },
        }),
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                try {
                    const result = await FormLoginSchema.parseAsync(credentials);

                    const { email, password } = result;

                    const user = await prisma.user.findUnique({ where: { email: email } });

                    if (!user || !user.password) {
                        throw new InvalidCredentials("User account does not exist");
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (!passwordsMatch) {
                        throw new InvalidCredentials("Password is not correct");
                    }

                    return user as any;
                } catch (error) {
                    if (
                        error instanceof Prisma?.PrismaClientInitializationError ||
                        error instanceof Prisma?.PrismaClientKnownRequestError
                    ) {
                        throw new InvalidCredentials(
                            "System error. Please contact support"
                        );
                    }

                    if (error instanceof ZodError) {
                        throw new InvalidCredentials(error.errors[0].message);
                    }

                    throw error;
                }
            },
        }),
    ],
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async jwt({ token, user, account }: { token: any, user: any, account: any }) {
            if (account?.provider === "credentials") {
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                const sessionToken = randomUUID();

                const session = await adapter.createSession!({
                    userId: user.id!,
                    sessionToken,
                    expires,
                });

                token.sessionId = session.sessionToken;
            }
            return token;
        },
        async session({ session, user }: { session: any, user: any }) {
            if (session && user) {
                const [googleAccount] = await prisma.account.findMany({
                    where: { userId: user.id, provider: "google" },
                })
                if (googleAccount && (googleAccount.expires_at) && (googleAccount.expires_at * 1000 < Date.now())) {
                    try {
                        const response = await fetch("https://oauth2.googleapis.com/token", {
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams({
                                client_id: process.env.AUTH_GOOGLE_ID!,
                                client_secret: process.env.AUTH_GOOGLE_SECRET!,
                                grant_type: "refresh_token",
                                refresh_token: googleAccount.refresh_token,
                            }),
                            method: "POST",
                        })

                        const responseTokens = await response.json()

                        if (!response.ok) throw responseTokens

                        await prisma.account.update({
                            data: {
                                access_token: responseTokens.access_token,
                                expires_at: Math.floor(
                                    Date.now() / 1000 + responseTokens.expires_in
                                ),
                                refresh_token:
                                    responseTokens.refresh_token ?? googleAccount.refresh_token,
                            },
                            where: {
                                provider_providerAccountId: {
                                    provider: "google",
                                    providerAccountId: googleAccount.providerAccountId,
                                },
                            },
                        })
                    } catch (error) {
                        console.error("Error refreshing access token", error)
                        session.error = "RefreshAccessTokenError"
                    }
                }

                return {
                    ...session,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role
                    }
                };
            }
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`

            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    secret: process.env.NEXT_AUTH_SECRET,
    jwt: {
        maxAge: 24 * 60 * 60 * 1000,
        async encode(arg: JWTEncodeParams) {
            return (arg.token?.sessionId as string) ?? encode(arg);
        },
    },
    experimental: {
        enableWebAuthn: true,
    },
    session: {
        strategy: 'database',
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 24 * 60 * 60, // 24 hours
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        }
    },
    cookies: {
        sessionToken: {
            name: `authjs.session-token`,
            options: {
                httpOnly: true,
                // sameSite: "strict",
                // path: "/",
                secure: false
            }
        }
    },
    trustHost: true,
    events: {
        async signOut(message) {
            if ("session" in message && message.session?.sessionToken) {
                await prisma.session.deleteMany({
                    where: {
                        sessionToken: message.session?.sessionToken,
                    },
                });
            }
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/",
        error: '/login',
    }
});