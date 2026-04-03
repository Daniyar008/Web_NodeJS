import { RoleName } from "@prisma/client";
import crypto from "crypto";

import { env } from "../../config/env.js";
import { ApiError } from "../../lib/apiError.js";
import { comparePassword, hashPassword } from "../../lib/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import { sendMail } from "../../lib/mailer.js";
import { prisma } from "../../lib/prisma.js";
import type { LoginDto, RegisterDto } from "./auth.schema.js";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// --- Register ---

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) throw ApiError.conflict("Email is already registered");

  const role = await prisma.role.findUnique({
    where: { name: dto.roleName as RoleName },
  });
  if (!role) throw ApiError.badRequest("Invalid role");

  const passwordHash = await hashPassword(dto.password);

  const user = await prisma.user.create({
    data: {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: role.id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: { select: { name: true } },
    },
  });

  return buildTokens(user.id, user.email, user.role.name);
}

// --- Login ---

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      isActive: true,
      role: { select: { name: true } },
    },
  });
  if (!user) throw ApiError.unauthorized("Invalid credentials");
  if (!user.isActive) throw ApiError.forbidden("Account is deactivated");

  const valid = await comparePassword(dto.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized("Invalid credentials");

  return buildTokens(user.id, user.email, user.role.name);
}

// --- Refresh ---

export async function refresh(rawToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(rawToken) as { sub: string };
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: rawToken } });
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw ApiError.unauthorized("Refresh token expired or revoked");
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, isActive: true, role: { select: { name: true } } },
  });
  if (!user || !user.isActive) throw ApiError.unauthorized("User not found");

  return buildTokens(user.id, user.email, user.role.name);
}

// --- Logout ---

export async function logout(rawToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: rawToken } });
}

// --- Forgot Password ---

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function forgotPassword(email: string) {
  // Always return success to avoid email enumeration
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      institutionMembers: {
        select: {
          role: true,
          institution: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  if (!user) return { message: "If this email is registered, you will receive a password reset link." };

  // Invalidate any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      token: rawToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  // Dev convenience log
  if (env.NODE_ENV !== "production") {
    console.log(`[DEV] Password reset link: ${resetUrl}`);
  }

  const institution = user.institutionMembers[0]?.institution ?? null;
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  // Send reset email to user
  await sendMail({
    to: user.email,
    subject: "Сброс пароля — EduFuture",
    html: buildResetEmail({ fullName, resetUrl, institution }),
  });

  // Notify institution admin if user belongs to one
  if (institution?.email) {
    await sendMail({
      to: institution.email,
      subject: `Запрос на сброс пароля — ${fullName} | EduFuture`,
      html: buildInstitutionNotifyEmail({ fullName, userEmail: user.email, institutionName: institution.name }),
    });
  }

  return { message: "If this email is registered, you will receive a password reset link." };
}

// ── Email templates ──────────────────────────────────────────────────────────

interface ResetEmailData {
  fullName: string;
  resetUrl: string;
  institution: { name: string } | null;
}

function buildResetEmail({ fullName, resetUrl, institution }: ResetEmailData): string {
  const institutionNote = institution
    ? `<p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Ваш аккаунт привязан к учреждению <strong>${institution.name}</strong>. Администратор учреждения уведомлён об этом запросе.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 40px 32px;text-align:center;">
            <div style="width:56px;height:56px;background:rgba(255,255,255,.15);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;">🔐</div>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-.5px;">Сброс пароля</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px;">EduFuture — образовательная платформа</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 16px;color:#111827;font-size:16px;">Привет, <strong>${fullName}</strong>!</p>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Мы получили запрос на сброс пароля для вашего аккаунта. Нажмите кнопку ниже, чтобы задать новый пароль:</p>
            ${institutionNote}
            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr><td align="center">
                <a href="${resetUrl}" target="_blank"
                   style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:.2px;box-shadow:0 4px 14px rgba(99,102,241,.4);">
                  Сбросить пароль →
                </a>
              </td></tr>
            </table>
            <!-- Info box -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Важная информация</p>
                  <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:14px;line-height:1.8;">
                    <li>Ссылка действительна <strong>1 час</strong></li>
                    <li>Если вы не запрашивали сброс — просто проигнорируйте это письмо</li>
                    <li>Ваш текущий пароль остаётся неизменным до момента сброса</li>
                  </ul>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;line-height:1.5;">Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:<br>
              <a href="${resetUrl}" style="color:#6366f1;word-break:break-all;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:13px;">© 2026 EduFuture. Это автоматическое письмо, не отвечайте на него.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

interface InstitutionNotifyData {
  fullName: string;
  userEmail: string;
  institutionName: string;
}

function buildInstitutionNotifyEmail({ fullName, userEmail, institutionName }: InstitutionNotifyData): string {
  const time = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Almaty" });
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#f59e0b 0%,#ef4444 100%);padding:32px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🏫</div>
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Уведомление для администратора</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px;">${institutionName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
              Пользователь вашего учреждения запросил сброс пароля на платформе <strong>EduFuture</strong>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#92400e;font-size:13px;font-weight:600;padding-bottom:12px;">Детали запроса</td>
                    </tr>
                    <tr>
                      <td style="color:#78350f;font-size:14px;padding:4px 0;"><strong>Пользователь:</strong> ${fullName}</td>
                    </tr>
                    <tr>
                      <td style="color:#78350f;font-size:14px;padding:4px 0;"><strong>Email:</strong> ${userEmail}</td>
                    </tr>
                    <tr>
                      <td style="color:#78350f;font-size:14px;padding:4px 0;"><strong>Учреждение:</strong> ${institutionName}</td>
                    </tr>
                    <tr>
                      <td style="color:#78350f;font-size:14px;padding:4px 0;"><strong>Время запроса:</strong> ${time}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
              Пользователь самостоятельно сбросит пароль по ссылке из письма. Если этот запрос выглядит подозрительным — свяжитесь с пользователем напрямую.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 EduFuture. Автоматическое уведомление.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Reset Password ---

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw ApiError.badRequest("Reset link is invalid or has expired.");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
  // Invalidate all refresh tokens for security
  await prisma.refreshToken.deleteMany({ where: { userId: record.userId } });

  return { message: "Password has been reset successfully." };
}

// --- Helpers ---

async function buildTokens(userId: string, email: string, role: RoleName) {
  const accessToken = signAccessToken({ sub: userId, email, role });
  const rawRefresh = signRefreshToken({ sub: userId });

  await prisma.refreshToken.create({
    data: {
      token: rawRefresh,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });

  return { accessToken, refreshToken: rawRefresh };
}
