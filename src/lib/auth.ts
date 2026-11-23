import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { bearer } from "better-auth/plugins/bearer";
import { emailOTP } from "better-auth/plugins/email-otp";
import { jwt } from "better-auth/plugins/jwt";
import { twoFactor } from "better-auth/plugins/two-factor";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { authSettings } from "./auth-settings";
import {
  AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS,
  sendAuthEmail,
  sendAuthOtpEmail,
} from "./auth-email";
import prisma from "./prisma";

export const auth = betterAuth({
  appName: "Meet.AI",
  baseURL: authSettings.baseURL,
  secret: authSettings.secret,
  trustedOrigins: authSettings.trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: authSettings.socialProviders,
  user: {
    validateUserInfo: async ({ user, source }) => {
      if (!source.oauth || !user.email) {
        return;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { twoFactorEnabled: true },
      });

      if (existingUser?.twoFactorEnabled) {
        return {
          error: "two_factor_required",
          errorDescription:
            "This account uses two-factor authentication. Sign in with email and password.",
        };
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 30,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      after(() =>
        sendAuthEmail({
          to: user.email,
          subject: "Reset your Meet.AI password",
          introduction: "Use the link below to reset your Meet.AI password.",
          actionLabel: "Reset password",
          actionUrl: url,
        }),
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      after(() =>
        sendAuthEmail({
          to: user.email,
          subject: "Verify your Meet.AI email",
          introduction:
            "Confirm your email address to finish creating your account.",
          actionLabel: "Verify email",
          actionUrl: url,
        }),
      );
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 15,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 60, max: 3 },
      "/send-verification-email": { window: 60, max: 3 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    database: {
      joins: true,
    },
  },
  plugins: [
    twoFactor({
      issuer: "Meet.AI",
    }),
    bearer(),
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          emailVerified: user.emailVerified,
        }),
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS,
      allowedAttempts: 3,
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp, type }) {
        after(() => sendAuthOtpEmail({ to: email, otp, type }));
      },
    }),
    nextCookies(),
  ],
});
