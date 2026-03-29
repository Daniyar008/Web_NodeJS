import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { aiApi, type AiChatResponse, type GeneratedQuestion, type RecommendationItem } from "../features/ai/aiApi";

type Role = "STUDENT" | "TEACHER" | "PARENT" | "INSTITUTION_ADMIN" | "UNKNOWN";
type ChatMessage = { id: string; role: "user" | "assistant"; text: string; source?: AiChatResponse["source"] };

function readAuth() {
    try {
        const token = localStorage.getItem("accessToken") ?? "";
        const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { sub?: string; role?: Role };
        return {
            userId: payload.sub ?? "",
            role: payload.role ?? "UNKNOWN",
        };
    } catch {
        return { userId: "", role: "UNKNOWN" as Role };
    }
}

const QUICK_ACTIONS: Record<Role, Array<{ label: string; prompt: string; context: "student" | "teacher" | "parent" | "general" }>> = {
    STUDENT: [
        { label: "Помощь с ДЗ", prompt: "Помоги мне разбить домашнее задание на понятные шаги.", context: "student" },
        { label: "План на неделю", prompt: "Составь короткий учебный план на неделю по моим курсам.", context: "student" },
        { label: "Как подготовиться к тесту", prompt: "Подскажи, как лучше подготовиться к ближайшему тесту.", context: "student" },
    ],
    TEACHER: [
        { label: "Идеи для теста", prompt: "Предложи структуру теста по теме моего урока.", context: "teacher" },
        { label: "Улучшить курс", prompt: "Как улучшить вовлечение студентов в курсе?", context: "teacher" },
        { label: "Проверка ДЗ", prompt: "Как быстрее и объективнее проверять домашние работы?", context: "teacher" },
    ],
    INSTITUTION_ADMIN: [
        { label: "Идеи для теста", prompt: "Предложи структуру теста по теме моего урока.", context: "teacher" },
        { label: "Улучшить курс", prompt: "Как улучшить вовлечение студентов в курсе?", context: "teacher" },
        { label: "Метрики учреждения", prompt: "Какие метрики учреждения стоит смотреть каждую неделю?", context: "general" },
    ],
    PARENT: [
        { label: "Советы родителю", prompt: "Как поддержать ребёнка, если прогресс просел?", context: "parent" },
        { label: "Мотивация", prompt: "Предложи простую систему мотивации с наградами.", context: "parent" },
        { label: "Разговор с учителем", prompt: "Как лучше обсудить прогресс ребёнка с учителем?", context: "parent" },
    ],
    UNKNOWN: [
        { label: "Что ты умеешь", prompt: "Чем ты можешь помочь на этой платформе?", context: "general" },
    ],
};

function roleContext(role: Role): "student" | "teacher" | "parent" | "general" {
    if (role === "STUDENT") return "student";
    if (role === "TEACHER" || role === "INSTITUTION_ADMIN") return "teacher";
    if (role === "PARENT") return "parent";
    return "general";
}

export function AIAssistantPage() {
    const { role } = readAuth();
    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Я могу помочь с домашними заданиями, рекомендациями по курсам, генерацией тестов и советами по работе в платформе.",
            source: "fallback",
        },
    ]);
    const [prompt, setPrompt] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [testForm, setTestForm] = useState({ topic: "", difficulty: "medium" as "easy" | "medium" | "hard", questions: 5 });
    const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
    const [generatingTest, setGeneratingTest] = useState(false);

    useEffect(() => {
        aiApi
            .recommendations(4)
            .then(setRecommendations)
            .finally(() => setLoadingRecommendations(false));
    }, []);

    async function sendMessage(message: string, context = roleContext(role)) {
        const trimmed = message.trim();
        if (!trimmed) return;

        const userMessage: ChatMessage = {
            id: `u-${Date.now()}`,
            role: "user",
            text: trimmed,
        };

        setMessages((current) => [...current, userMessage]);
        setPrompt("");
        setSending(true);

        try {
            const response = await aiApi.chat(trimmed, context);
            setMessages((current) => [
                ...current,
                {
                    id: `a-${Date.now()}`,
                    role: "assistant",
                    text: response.answer,
                    source: response.source,
                },
            ]);
        } finally {
            setSending(false);
        }
    }

    async function handleGenerateTest() {
        if (!testForm.topic.trim()) return;
        setGeneratingTest(true);
        try {
            const items = await aiApi.generateTest({
                topic: testForm.topic,
                difficulty: testForm.difficulty,
                questions: testForm.questions,
            });
            setGeneratedQuestions(items);
        } finally {
            setGeneratingTest(false);
        }
    }

    const quickActions = QUICK_ACTIONS[role] ?? QUICK_ACTIONS.UNKNOWN;
    const showTeacherTools = role === "TEACHER" || role === "INSTITUTION_ADMIN";

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">AI-ассистент</p>
                <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="heading-font text-3xl font-bold sm:text-4xl">Умная помощь внутри платформы</h1>
                        <p className="mt-2 max-w-2xl text-sm text-[color:var(--ink-700)]">
                            Ассистент учитывает вашу роль и может давать рекомендации по курсам, подсказывать следующие шаги и генерировать черновики тестов.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[#f6f7f3] px-4 py-3 text-sm text-[color:var(--ink-700)]">
                        Роль: <span className="font-semibold text-[color:var(--brand)]">{role}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                    <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="heading-font text-lg font-bold">Персональные рекомендации</h2>
                            {loadingRecommendations && <span className="text-xs text-[color:var(--ink-700)]">Обновление…</span>}
                        </div>
                        <div className="mt-4 grid gap-3">
                            {!loadingRecommendations && recommendations.length === 0 && (
                                <p className="text-sm text-[color:var(--ink-700)]">Пока рекомендаций нет.</p>
                            )}
                            {recommendations.map((item) => (
                                <article key={`${item.title}-${item.actionPath}`} className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                                    <h3 className="font-semibold text-[color:var(--ink-900)]">{item.title}</h3>
                                    <p className="mt-1 text-sm text-[color:var(--ink-700)]">{item.description}</p>
                                    <Link
                                        to={item.actionPath}
                                        className="mt-3 inline-flex rounded-xl bg-[color:var(--brand)] px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                                    >
                                        {item.actionLabel}
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>

                    {showTeacherTools && (
                        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                            <h2 className="heading-font text-lg font-bold">Генератор тестов</h2>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <input
                                    value={testForm.topic}
                                    onChange={(event) => setTestForm((current) => ({ ...current, topic: event.target.value }))}
                                    placeholder="Тема теста"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)] sm:col-span-2"
                                />
                                <select
                                    value={testForm.difficulty}
                                    onChange={(event) => setTestForm((current) => ({ ...current, difficulty: event.target.value as "easy" | "medium" | "hard" }))}
                                    aria-label="Сложность теста"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                >
                                    <option value="easy">easy</option>
                                    <option value="medium">medium</option>
                                    <option value="hard">hard</option>
                                </select>
                                <input
                                    type="number"
                                    min={3}
                                    max={10}
                                    value={testForm.questions}
                                    onChange={(event) => setTestForm((current) => ({ ...current, questions: Number(event.target.value) }))}
                                    aria-label="Количество вопросов"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)] sm:max-w-[120px]"
                                />
                                <button
                                    onClick={() => {
                                        void handleGenerateTest();
                                    }}
                                    disabled={generatingTest}
                                    className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-fit"
                                >
                                    {generatingTest ? "Генерация…" : "Сгенерировать"}
                                </button>
                            </div>

                            {generatedQuestions.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {generatedQuestions.map((question, index) => (
                                        <article key={`${question.text}-${index}`} className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-semibold">{question.text}</h3>
                                                <span className="text-xs text-[color:var(--ink-700)]">{question.points} балл.</span>
                                            </div>
                                            <ul className="mt-3 space-y-2 text-sm text-[color:var(--ink-700)]">
                                                {question.options.map((option, optionIndex) => (
                                                    <li key={`${option.text}-${optionIndex}`} className={`rounded-xl px-3 py-2 ${option.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-[#f6f7f3]"}`}>
                                                        {option.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-lg font-bold">Чат с ассистентом</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {quickActions.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    void sendMessage(item.prompt, item.context);
                                }}
                                className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-700)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 h-[440px] overflow-y-auto rounded-2xl border border-[color:var(--line)] bg-[#f6f7f3] p-4">
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <article
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === "user"
                                                ? "bg-[color:var(--brand)] text-white"
                                                : "bg-white text-[color:var(--ink-900)]"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                        {message.source && message.role === "assistant" && (
                                            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-700)]">
                                                source: {message.source}
                                            </p>
                                        )}
                                    </article>
                                </div>
                            ))}
                            {sending && <p className="text-sm text-[color:var(--ink-700)]">Ассистент думает…</p>}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder="Опишите задачу: помощь с ДЗ, идеи для теста, советы по мотивации, рекомендации по курсам..."
                            className="min-h-[88px] flex-1 rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <button
                            onClick={() => {
                                void sendMessage(prompt);
                            }}
                            disabled={sending || !prompt.trim()}
                            className="self-end rounded-2xl bg-[color:var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
