import { RoleName } from "@prisma/client";

import { ApiError } from "../../lib/apiError.js";
import { comparePassword, hashPassword } from "../../lib/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
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
