import { Prisma } from "@prisma/client";
import { ApiError } from "../../lib/apiError.js";
import { prisma } from "../../lib/prisma.js";
import { cacheLeaderboard, getCachedLeaderboard } from "../../lib/redis.js";
import { getIO } from "../../lib/socket.js";
import type { CreateTournamentDto, SubmitScoreDto, UpdateTournamentDto } from "./tournament.schema.js";

// ─── helpers ─────────────────────────────────────────────────────────────────

function clean<T extends object>(obj: T): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as any;
}

const participantSelect = {
  id: true,
  userId: true,
  joinedAt: true,
  user: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.TournamentParticipantSelect;

const resultSelect = {
  id: true,
  userId: true,
  score: true,
  rank: true,
  submittedAt: true,
  updatedAt: true,
  user: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.TournamentResultSelect;

// ─── list / get ──────────────────────────────────────────────────────────────

export async function listTournaments() {
  return prisma.tournament.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { participants: true } },
    },
  });
}

export async function getTournament(id: string) {
  const t = await prisma.tournament.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      participants: { select: participantSelect },
      results: { select: resultSelect, orderBy: { score: "desc" } },
    },
  });
  if (!t) throw ApiError.notFound("Tournament not found");
  return t;
}

// ─── create / update ─────────────────────────────────────────────────────────

export async function createTournament(userId: string, dto: CreateTournamentDto) {
  return prisma.tournament.create({
    data: {
      title: dto.title,
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      maxScore: dto.maxScore,
      createdById: userId,
    },
  });
}

export async function updateTournament(userId: string, id: string, dto: UpdateTournamentDto) {
  const t = await prisma.tournament.findUnique({ where: { id } });
  if (!t) throw ApiError.notFound("Tournament not found");
  if (t.createdById !== userId) throw ApiError.forbidden("Not the tournament owner");

  return prisma.tournament.update({
    where: { id },
    data: clean({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      ...(dto.startsAt !== undefined ? { startsAt: new Date(dto.startsAt) } : {}),
      ...(dto.endsAt !== undefined ? { endsAt: new Date(dto.endsAt) } : {}),
      maxScore: dto.maxScore,
    }),
  });
}

export async function removeTournament(userId: string, id: string) {
  const t = await prisma.tournament.findUnique({ where: { id } });
  if (!t) throw ApiError.notFound("Tournament not found");
  if (t.createdById !== userId) throw ApiError.forbidden("Not the tournament owner");
  await prisma.tournament.delete({ where: { id } });
}

// ─── participation ───────────────────────────────────────────────────────────

export async function joinTournament(userId: string, tournamentId: string) {
  const t = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!t) throw ApiError.notFound("Tournament not found");
  if (t.status === "FINISHED") throw ApiError.conflict("Tournament already finished");

  const existing = await prisma.tournamentParticipant.findUnique({
    where: { tournamentId_userId: { tournamentId, userId } },
  });
  if (existing) throw ApiError.conflict("Already joined");

  return prisma.tournamentParticipant.create({ data: { tournamentId, userId } });
}

export async function leaveTournament(userId: string, tournamentId: string) {
  const existing = await prisma.tournamentParticipant.findUnique({
    where: { tournamentId_userId: { tournamentId, userId } },
  });
  if (!existing) throw ApiError.notFound("Not a participant");
  await prisma.tournamentParticipant.delete({
    where: { tournamentId_userId: { tournamentId, userId } },
  });
}

// ─── scoring ─────────────────────────────────────────────────────────────────

export async function submitScore(userId: string, tournamentId: string, dto: SubmitScoreDto) {
  const t = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!t) throw ApiError.notFound("Tournament not found");
  if (t.status !== "ACTIVE") throw ApiError.conflict("Tournament is not active");

  const isParticipant = await prisma.tournamentParticipant.findUnique({
    where: { tournamentId_userId: { tournamentId, userId } },
  });
  if (!isParticipant) throw ApiError.forbidden("Not a participant");

  const clampedScore = Math.min(dto.score, t.maxScore);

  const result = await prisma.tournamentResult.upsert({
    where: { tournamentId_userId: { tournamentId, userId } },
    create: { tournamentId, userId, score: clampedScore },
    update: { score: clampedScore },
  });

  // Recompute ranks and push live leaderboard.
  await refreshLeaderboard(tournamentId);
  return result;
}

// ─── leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(tournamentId: string) {
  // Try Redis cache first.
  const cached = await getCachedLeaderboard(tournamentId).catch(() => null);
  if (cached) {
    // Enrich with user info from DB.
    const userIds = cached.map((e) => e.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return cached.map((e, i) => ({
      rank: i + 1,
      score: e.score,
      user: userMap.get(e.userId) ?? { id: e.userId, firstName: "?", lastName: "?" },
    }));
  }

  return buildLeaderboardFromDb(tournamentId);
}

async function buildLeaderboardFromDb(tournamentId: string) {
  const results = await prisma.tournamentResult.findMany({
    where: { tournamentId },
    orderBy: { score: "desc" },
    select: resultSelect,
  });
  return results.map((r, i) => ({ rank: i + 1, score: r.score, user: r.user }));
}

async function refreshLeaderboard(tournamentId: string) {
  const leaderboard = await buildLeaderboardFromDb(tournamentId);

  // Update stored ranks.
  await prisma.$transaction(
    leaderboard.map((entry, i) =>
      prisma.tournamentResult.update({
        where: { tournamentId_userId: { tournamentId, userId: entry.user.id } },
        data: { rank: i + 1 },
      })
    )
  );

  // Cache in Redis.
  await cacheLeaderboard(
    tournamentId,
    leaderboard.map((e) => ({ userId: e.user.id, score: e.score }))
  ).catch(() => {});

  // Broadcast via Socket.io.
  try {
    getIO().to(`tournament:${tournamentId}`).emit("leaderboard:update", leaderboard);
  } catch {
    // Socket not initialised (e.g. tests) – ignore.
  }
}
