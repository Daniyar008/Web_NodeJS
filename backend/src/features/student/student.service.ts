import { ApiError } from '../../lib/apiError.js'
import { prisma } from '../../lib/prisma.js'
import type { Prisma } from '@prisma/client'

const XP_PER_LESSON = 20

function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1
}

async function ensureGamificationProfile(userId: string) {
  const existing = await prisma.gamificationProfile.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.gamificationProfile.create({ data: { userId } })
}

async function awardXp(userId: string, amount: number, source: 'LESSON_COMPLETED' | 'TEST_PASSED' | 'ASSIGNMENT_GRADED' | 'ACHIEVEMENT_UNLOCKED' | 'DAILY_STREAK', meta?: Record<string, unknown>) {
  await ensureGamificationProfile(userId)
  await prisma.xPTransaction.create({
    data: { userId, amount, source, ...(meta ? { meta: meta as Prisma.InputJsonValue } : {}) },
  })
  const profile = await prisma.gamificationProfile.update({
    where: { userId },
    data: { xp: { increment: amount } },
  })
  const nextLevel = levelFromXp(profile.xp)
  if (nextLevel !== profile.level) {
    await prisma.gamificationProfile.update({ where: { userId }, data: { level: nextLevel } })
  }
}

export async function getStudentProfile(userId: string) {
  const [user, profile, achievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: { select: { name: true } } },
    }),
    ensureGamificationProfile(userId),
    prisma.studentAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    }),
  ])

  if (!user) throw ApiError.notFound('Пользователь не найден')
  return { user, gamification: profile, achievements }
}

export async function listAvailableCourses() {
  return prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { updatedAt: 'desc' },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { modules: true, enrollments: true } },
    },
  })
}

export async function listEnrolledCourses(studentId: string) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
          modules: { include: { lessons: true }, orderBy: { order: 'asc' } },
        },
      },
      progress: { include: { lesson: true } },
    },
    orderBy: { enrolledAt: 'desc' },
  })
}

export async function enrollCourse(studentId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course || course.status !== 'PUBLISHED') {
    throw ApiError.notFound('Курс не найден или не опубликован')
  }

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  })
  if (existing) throw ApiError.conflict('Вы уже записаны на этот курс')

  return prisma.enrollment.create({
    data: { studentId, courseId },
    include: { course: true },
  })
}

export async function completeLesson(studentId: string, courseId: string, lessonId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  })
  if (!enrollment) throw ApiError.forbidden('Сначала запишитесь на курс')

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, module: { courseId } },
  })
  if (!lesson) throw ApiError.notFound('Урок не найден')

  const existingProgress = await prisma.lessonProgress.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
  })

  const progress = await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { enrollmentId: enrollment.id, lessonId, completed: true, completedAt: new Date() },
  })

  // XP is awarded once on first completion.
  if (!existingProgress?.completed) {
    await awardXp(studentId, XP_PER_LESSON, 'LESSON_COMPLETED', { lessonId, courseId })
  }

  return progress
}

export async function getCourseProgress(studentId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true }, orderBy: { order: 'asc' } },
        },
      },
      progress: true,
    },
  })
  if (!enrollment) throw ApiError.notFound('Вы не записаны на этот курс')

  const lessonIds = enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  const completedSet = new Set(enrollment.progress.filter((p) => p.completed).map((p) => p.lessonId))
  const total = lessonIds.length
  const completed = lessonIds.filter((id) => completedSet.has(id)).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return {
    enrollmentId: enrollment.id,
    course: enrollment.course,
    completedLessons: completed,
    totalLessons: total,
    percent,
    progress: enrollment.progress,
  }
}

export async function listAchievements(studentId: string) {
  const [all, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.studentAchievement.findMany({
      where: { userId: studentId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    }),
  ])

  return {
    all,
    unlocked,
    unlockedIds: unlocked.map((x) => x.achievementId),
  }
}
