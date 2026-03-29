import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
    tournamentApi,
    type LeaderboardEntry,
    type Tournament,
    type TournamentDetail,
} from "../features/tournament/tournamentApi";

const STATUS_LABELS: Record<string, string> = {
    UPCOMING: "Скоро",
    ACTIVE: "Идёт",
    FINISHED: "Завершён",
};

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: "bg-sky-100 text-sky-700",
    ACTIVE: "bg-green-100 text-green-700",
    FINISHED: "bg-gray-100 text-gray-500",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

// ─── Leaderboard panel ─────────────────────────────────────────────────────

interface LeaderboardPanelProps {
    tournamentId: string;
    initial: LeaderboardEntry[];
}

function LeaderboardPanel({ tournamentId, initial }: LeaderboardPanelProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>(initial);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        setEntries(initial);
    }, [initial]);

    useEffect(() => {
        const socket: Socket = io(import.meta.env["VITE_API_URL"] ?? "http://localhost:3000", {
            withCredentials: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join:tournament", tournamentId);
        });

        socket.on("leaderboard:update", (data: LeaderboardEntry[]) => {
            setEntries(data);
        });

        return () => {
            socket.emit("leave:tournament", tournamentId);
            socket.disconnect();
        };
    }, [tournamentId]);

    if (entries.length === 0) {
        return <p className="text-gray-400 text-sm mt-2">Результатов пока нет.</p>;
    }

    return (
        <div className="mt-2 divide-y rounded-lg border overflow-hidden">
            {entries.map((e) => (
                <div key={e.user.id} className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-50">
                    <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${e.rank === 1
                                ? "bg-yellow-400 text-white"
                                : e.rank === 2
                                    ? "bg-gray-300 text-gray-700"
                                    : e.rank === 3
                                        ? "bg-amber-600 text-white"
                                        : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        {e.rank}
                    </span>
                    <span className="flex-1 font-medium">
                        {e.user.firstName} {e.user.lastName}
                    </span>
                    <span className="font-semibold text-indigo-600">{e.score} pts</span>
                </div>
            ))}
        </div>
    );
}

// ─── Tournament detail modal ───────────────────────────────────────────────

interface DetailModalProps {
    tournament: TournamentDetail;
    userId: string;
    onClose: () => void;
    onJoin: () => void;
    onLeave: () => void;
}

function DetailModal({ tournament, userId, onClose, onJoin, onLeave }: DetailModalProps) {
    const isParticipant = tournament.participants.some((p) => p.userId === userId);
    const myResult = tournament.results.find((r) => r.userId === userId);
    const [score, setScore] = useState(myResult?.score ?? 0);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit() {
        setSubmitting(true);
        try {
            await tournamentApi.submitScore(tournament.id, score);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{tournament.title}</h2>
                        {tournament.description && (
                            <p className="text-gray-500 text-sm mt-1">{tournament.description}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                        ×
                    </button>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    <span>Начало: {formatDate(tournament.startsAt)}</span>
                    <span>Конец: {formatDate(tournament.endsAt)}</span>
                    <span>Макс. баллов: {tournament.maxScore}</span>
                </div>

                <div className="flex gap-2 mb-6">
                    {!isParticipant && tournament.status !== "FINISHED" && (
                        <button
                            onClick={onJoin}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                        >
                            Участвовать
                        </button>
                    )}
                    {isParticipant && tournament.status !== "FINISHED" && (
                        <button
                            onClick={onLeave}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                        >
                            Покинуть
                        </button>
                    )}
                    {isParticipant && tournament.status === "ACTIVE" && (
                        <div className="flex items-center gap-2 ml-auto">
                            <input
                                type="number"
                                min={0}
                                max={tournament.maxScore}
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                aria-label="Ваш результат"
                                className="w-24 border rounded px-2 py-1 text-sm"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? "..." : "Отправить"}
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="font-semibold mb-1">Таблица лидеров</h3>
                <LeaderboardPanel tournamentId={tournament.id} initial={tournament.results.map((r, i) => ({ rank: i + 1, score: r.score, user: r.user }))} />
            </div>
        </div>
    );
}

// ─── Create tournament modal ───────────────────────────────────────────────

interface CreateModalProps {
    onClose: () => void;
    onCreate: (t: Tournament) => void;
}

const EMPTY_FORM = {
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
    maxScore: 100,
};

function CreateModal({ onClose, onCreate }: CreateModalProps) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    function set<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSave() {
        if (!form.title || !form.startsAt || !form.endsAt) return;
        setSaving(true);
        try {
            const created = await tournamentApi.create({
                title: form.title,
                ...(form.description ? { description: form.description } : {}),
                startsAt: new Date(form.startsAt).toISOString(),
                endsAt: new Date(form.endsAt).toISOString(),
                maxScore: form.maxScore,
            });
            onCreate(created);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Новый турнир</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="space-y-3">
                    <input
                        placeholder="Название *"
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        aria-label="Название турнира"
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <textarea
                        placeholder="Описание"
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        aria-label="Описание турнира"
                        className="w-full border rounded px-3 py-2 text-sm h-20 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-500">Начало *</label>
                            <input
                                type="datetime-local"
                                value={form.startsAt}
                                onChange={(e) => set("startsAt", e.target.value)}
                                aria-label="Дата и время начала"
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Конец *</label>
                            <input
                                type="datetime-local"
                                value={form.endsAt}
                                onChange={(e) => set("endsAt", e.target.value)}
                                aria-label="Дата и время окончания"
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Макс. баллов</label>
                        <input
                            type="number"
                            min={1}
                            value={form.maxScore}
                            onChange={(e) => set("maxScore", Number(e.target.value))}
                            aria-label="Максимальное количество баллов"
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-3 py-1 text-sm text-gray-600 hover:underline">
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {saving ? "Создание..." : "Создать"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selected, setSelected] = useState<TournamentDetail | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(true);

    // Get current user id from token stored in localStorage.
    const [userId] = useState<string>(() => {
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
            return (payload as { sub?: string }).sub ?? "";
        } catch {
            return "";
        }
    });

    useEffect(() => {
        tournamentApi
            .list()
            .then(setTournaments)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function openDetail(id: string) {
        try {
            const detail = await tournamentApi.get(id);
            setSelected(detail);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleJoin() {
        if (!selected) return;
        await tournamentApi.join(selected.id);
        const refreshed = await tournamentApi.get(selected.id);
        setSelected(refreshed);
    }

    async function handleLeave() {
        if (!selected) return;
        await tournamentApi.leave(selected.id);
        const refreshed = await tournamentApi.get(selected.id);
        setSelected(refreshed);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Турниры</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                >
                    + Создать турнир
                </button>
            </div>

            {loading ? (
                <p className="text-gray-400">Загрузка...</p>
            ) : tournaments.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-2">🏆</p>
                    <p>Турниров пока нет</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {tournaments.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => openDetail(t.id)}
                            className="text-left p-4 bg-white border rounded-xl hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{t.title}</h3>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status] ?? ""}`}
                                >
                                    {STATUS_LABELS[t.status] ?? t.status}
                                </span>
                            </div>
                            {t.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{t.description}</p>
                            )}
                            <div className="text-xs text-gray-400 space-y-0.5">
                                <p>Начало: {formatDate(t.startsAt)}</p>
                                <p>
                                    Участников: {t._count.participants} · Создал: {t.createdBy.firstName}{" "}
                                    {t.createdBy.lastName}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <DetailModal
                    tournament={selected}
                    userId={userId}
                    onClose={() => setSelected(null)}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                />
            )}

            {showCreate && (
                <CreateModal
                    onClose={() => setShowCreate(false)}
                    onCreate={(t) => {
                        setTournaments((prev) => [t, ...prev]);
                        setShowCreate(false);
                    }}
                />
            )}
        </div>
    );
}
