import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Creates a transporter. In dev without SMTP config → uses Ethereal (catch-all test inbox).
async function createTransporter() {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }

  // Fallback: Ethereal fake SMTP for development
  const testAccount = await nodemailer.createTestAccount();
  const t = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  console.log(
    `[mailer] No SMTP configured — using Ethereal. Preview emails at https://ethereal.email (user: ${testAccount.user} / pass: ${testAccount.pass})`
  );
  return t;
}

let _transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (!_transporter) _transporter = await createTransporter();
  return _transporter;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const from = env.SMTP_FROM ?? `"EduFuture" <noreply@edufuture.kz>`;
  const transporter = await getTransporter();
  const info = await transporter.sendMail({ from, ...opts });
  if (env.NODE_ENV !== "production") {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log(`[mailer] Preview: ${preview}`);
  }
}
