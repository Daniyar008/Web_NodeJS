import OpenAI from "openai";

import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import type { AuthLocals } from "../../middleware/auth.middleware.js";
import type { AiChatDto, AiGenerateTestDto, AiRecommendationQuery } from "./ai.schema.js";

type RecommendationItem = {
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
};

type GeneratedQuestion = {
  text: string;
  type: "SINGLE";
  points: number;
  options: Array<{ text: string; isCorrect: boolean }>;
};

const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

export async function getRecommendations(
  auth: AuthLocals,
  query: AiRecommendationQuery
): Promise<RecommendationItem[]> {
  switch (auth.role) {
    case "STUDENT":
      return getStudentRecommendations(auth.userId, query.limit);
    case "TEACHER":
    case "INSTITUTION_ADMIN":
      return getTeacherRecommendations(auth.userId, query.limit);
    case "PARENT":
      return getParentRecommendations(auth.userId, query.limit);
    default:
      return getGeneralRecommendations(query.limit);
  }
}

export async function chatWithAssistant(auth: AuthLocals, dto: AiChatDto) {
  const prompt = await buildPrompt(auth, dto.message, dto.context ?? "general");

  if (openai) {
    try {
      const response = await openai.responses.create({
        model: env.OPENAI_MODEL,
        input: prompt,
      });
      const text = response.output_text?.trim();
      if (text) {
        return {
          source: "openai" as const,
          answer: text,
        };
      }
    } catch {
      // Fall back to deterministic local answer below.
    }
  }

  return {
    source: "fallback" as const,
    answer: buildFallbackAnswer(auth, dto.message, dto.context ?? "general"),
  };
}

export async function generateTestDraft(auth: AuthLocals, dto: AiGenerateTestDto) {
  const systemPrompt = [
    "Create a compact JSON array of quiz questions.",
    "Each item must include: text, type, points, options[{text,isCorrect}]",
    "Use only SINGLE choice questions.",
    `Topic: ${dto.topic}`,
    `Difficulty: ${dto.difficulty}`,
    `Question count: ${dto.questions}`,
    "Return JSON only.",
  ].join("\n");

  if (openai) {
    try {
      const response = await openai.responses.create({
        model: env.OPENAI_MODEL,
        input: systemPrompt,
      });
      const text = response.output_text?.trim() ?? "[]";
      const parsed = JSON.parse(text) as GeneratedQuestion[];
      return normalizeQuestions(parsed, dto.questions, dto.topic);
    } catch {
      // Fall through to local generator.
    }
  }

  return buildFallbackQuestions(dto);
}

async function getStudentRecommendations(userId: string, limit: number): Promise<RecommendationItem[]> {
  const [enrollments, availableCourses, tournaments] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: { include: { modules: { include: { lessons: true } } } },
        progress: true,
      },
      orderBy: { enrolledAt: "desc" },
      take: limit,
    }),
    prisma.course.findMany({
      where: { status: "PUBLISHED", enrollments: { none: { studentId: userId } } },
      include: { author: { select: { firstName: true, lastName: true } }, _count: { select: { modules: true } } },
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.tournament.findMany({
      where: { status: { in: ["UPCOMING", "ACTIVE"] } },
      take: 2,
      orderBy: { startsAt: "asc" },
    }),
  ]);

  const items: RecommendationItem[] = [];

  for (const enrollment of enrollments) {
    const total = enrollment.course.modules.flatMap((moduleItem) => moduleItem.lessons).length;
    const completed = enrollment.progress.filter((item) => item.completed).length;
    if (total > 0 && completed < total) {
      items.push({
        title: `Продолжить курс ${enrollment.course.title}`,
        description: `Завершено ${completed} из ${total} уроков. Следующий шаг уже доступен.`,
        actionLabel: "Продолжить обучение",
        actionPath: `/learn/${enrollment.course.id}`,
      });
    }
  }

  for (const course of availableCourses) {
    items.push({
      title: `Новый курс: ${course.title}`,
      description: `${course.author.firstName} ${course.author.lastName} · ${course._count.modules} модулей`,
      actionLabel: "Открыть дашборд ученика",
      actionPath: "/dashboard/student",
    });
  }

  for (const tournament of tournaments) {
    items.push({
      title: `Турнир ${tournament.title}`,
      description: tournament.status === "ACTIVE" ? "Сейчас идёт турнир с live-таблицей." : "Скоро стартует новый турнир.",
      actionLabel: "Перейти к турнирам",
      actionPath: "/tournaments",
    });
  }

  return items.slice(0, limit);
}

async function getTeacherRecommendations(userId: string, limit: number): Promise<RecommendationItem[]> {
  const [courses, pendingSubmissions] = await Promise.all([
    prisma.course.findMany({
      where: { authorId: userId },
      include: { _count: { select: { modules: true, enrollments: true } } },
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.assignmentSubmission.findMany({
      where: { assignment: { lesson: { module: { course: { authorId: userId } } } }, score: null },
      include: { assignment: { select: { title: true } }, student: { select: { firstName: true, lastName: true } } },
      take: limit,
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  const items: RecommendationItem[] = [];

  for (const submission of pendingSubmissions) {
    items.push({
      title: `Проверить работу ${submission.assignment.title}`,
      description: `${submission.student.firstName} ${submission.student.lastName} ожидает оценку.`,
      actionLabel: "Открыть кабинет учителя",
      actionPath: "/dashboard/teacher",
    });
  }

  for (const course of courses) {
    items.push({
      title: `Улучшить курс ${course.title}`,
      description: `${course._count.enrollments} студентов, ${course._count.modules} модулей. AI может помочь с тестами и описаниями.`,
      actionLabel: "Редактировать курс",
      actionPath: `/courses/${course.id}/edit`,
    });
  }

  return items.slice(0, limit);
}

async function getParentRecommendations(userId: string, limit: number): Promise<RecommendationItem[]> {
  const links = await prisma.parentStudent.findMany({
    where: { parentId: userId },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          gamificationProfile: true,
        },
      },
    },
    take: limit,
  });

  const items = links.map((link) => ({
    title: `Поддержать ${link.student.firstName}`,
    description: link.student.gamificationProfile
      ? `Сейчас уровень ${link.student.gamificationProfile.level}, XP: ${link.student.gamificationProfile.xp}. Можно поставить новую цель.`
      : "У ребёнка ещё нет геймификационного профиля. Помогите начать с первого курса.",
    actionLabel: "Открыть дашборд родителя",
    actionPath: "/dashboard/parent",
  }));

  return items.slice(0, limit);
}

async function getGeneralRecommendations(limit: number): Promise<RecommendationItem[]> {
  const tournaments = await prisma.tournament.findMany({ take: limit, orderBy: { createdAt: "desc" } });
  return tournaments.map((item) => ({
    title: item.title,
    description: item.description ?? "Новый турнир доступен в системе.",
    actionLabel: "Открыть турниры",
    actionPath: "/tournaments",
  }));
}

async function buildPrompt(auth: AuthLocals, message: string, context: string) {
  const recommendations = await getRecommendations(auth, { limit: 3 });
  const recommendationText = recommendations
    .map((item, index) => `${index + 1}. ${item.title} — ${item.description}`)
    .join("\n");

  return [
    "You are an AI assistant inside an education platform.",
    `User role: ${auth.role}`,
    `Conversation context: ${context}`,
    "Answer in Russian.",
    "Be concise, practical, and specific to this platform.",
    recommendationText ? `Current relevant recommendations:\n${recommendationText}` : "",
    `User message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildFallbackAnswer(auth: AuthLocals, message: string, context: string) {
  const normalized = message.toLowerCase();

  if (auth.role === "TEACHER" && normalized.includes("тест")) {
    return "Для учителя лучший быстрый путь: выберите тему, задайте сложность и сгенерируйте черновик теста. Затем перенесите вопросы в редактор курса и проверьте формулировки перед публикацией.";
  }

  if (auth.role === "PARENT" && (normalized.includes("реб") || normalized.includes("мотива"))) {
    return "Для родителя сейчас полезно поставить короткую цель по XP, привязать награду и раз в неделю смотреть динамику по курсам. Если прогресс замедлился, начните с одного конкретного курса и одной достижимой цели.";
  }

  if (auth.role === "STUDENT" && (normalized.includes("дз") || normalized.includes("домаш") || context === "student")) {
    return "Разбейте задание на 3 шага: понять условие, выписать ключевые понятия, решить минимальный пример. После этого откройте нужный курс, пройдите ближайший урок и только затем возвращайтесь к домашнему заданию.";
  }

  return "Я могу помочь с курсами, домашними заданиями, идеями для тестов и персональными рекомендациями по платформе. Выберите быстрое действие или сформулируйте задачу конкретнее.";
}

function buildFallbackQuestions(dto: AiGenerateTestDto): GeneratedQuestion[] {
  const topic = dto.topic;
  return Array.from({ length: dto.questions }, (_, index) => ({
    text: `${index + 1}. Что лучше всего описывает тему \"${topic}\"?`,
    type: "SINGLE",
    points: dto.difficulty === "hard" ? 3 : dto.difficulty === "medium" ? 2 : 1,
    options: [
      { text: `Ключевая идея темы ${topic}`, isCorrect: true },
      { text: `Случайный несвязанный факт`, isCorrect: false },
      { text: `Частично верное, но неполное утверждение`, isCorrect: false },
      { text: `Неверное определение темы`, isCorrect: false },
    ],
  }));
}

function normalizeQuestions(items: GeneratedQuestion[], count: number, topic: string): GeneratedQuestion[] {
  const normalized = items
    .filter((item) => item && typeof item.text === "string" && Array.isArray(item.options))
    .map((item) => ({
      text: item.text,
      type: "SINGLE" as const,
      points: typeof item.points === "number" ? item.points : 1,
      options: item.options.slice(0, 4).map((option, index) => ({
        text: option?.text || `Вариант ${index + 1}`,
        isCorrect: Boolean(option?.isCorrect),
      })),
    }));

  if (normalized.length >= count) {
    return normalized.slice(0, count);
  }

  return normalized.concat(buildFallbackQuestions({ topic, difficulty: "medium", questions: count - normalized.length }));
}
