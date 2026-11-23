import { Resend } from "resend";

type AuthEmail = {
  to: string;
  subject: string;
  introduction: string;
  actionLabel: string;
  actionUrl: string;
};

type AuthOtpType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

type AuthEmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS = 5 * 60;

let resend: Resend | undefined;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      "RESEND_API_KEY and AUTH_EMAIL_FROM are required to send authentication email.",
    );
  }

  resend ??= new Resend(apiKey);
  return resend;
}

async function sendEmail({ to, subject, text, html }: AuthEmailMessage) {
  const from = process.env.AUTH_EMAIL_FROM;

  if (!from) {
    throw new Error("AUTH_EMAIL_FROM is required to send authentication email.");
  }

  const { error } = await getResendClient().emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(`Resend could not send authentication email: ${error.message}`);
  }
}

export async function sendAuthEmail({
  to,
  subject,
  introduction,
  actionLabel,
  actionUrl,
}: AuthEmail): Promise<void> {
  const safeIntroduction = escapeHtml(introduction);
  const safeActionLabel = escapeHtml(actionLabel);
  const safeActionUrl = escapeHtml(actionUrl);

  await sendEmail({
    to,
    subject,
    text: `${introduction}\n\n${actionLabel}: ${actionUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>${safeIntroduction}</p><p><a href="${safeActionUrl}">${safeActionLabel}</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendAuthOtpEmail({
  to,
  otp,
  type,
}: {
  to: string;
  otp: string;
  type: AuthOtpType;
}): Promise<void> {
  const messages: Record<AuthOtpType, { subject: string; introduction: string }> = {
    "sign-in": {
      subject: "Your Meet.AI sign-in code",
      introduction: "Use this code to sign in to Meet.AI.",
    },
    "email-verification": {
      subject: "Verify your Meet.AI email",
      introduction: "Use this code to verify your Meet.AI email address.",
    },
    "forget-password": {
      subject: "Reset your Meet.AI password",
      introduction: "Use this code to reset your Meet.AI password.",
    },
    "change-email": {
      subject: "Confirm your Meet.AI email change",
      introduction: "Use this code to confirm your Meet.AI email change.",
    },
  };
  const { subject, introduction } = messages[type];
  const safeIntroduction = escapeHtml(introduction);
  const safeOtp = escapeHtml(otp);

  await sendEmail({
    to,
    subject,
    text: `${introduction}\n\nYour verification code is ${otp}. It expires in 5 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>${safeIntroduction}</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 0.2em;">${safeOtp}</p><p>This code expires in 5 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}
