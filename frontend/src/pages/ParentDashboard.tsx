import { useEffect, useState } from "react";
import {
  parentApi,
  type ChildProgress,
  type Message,
  type ParentGoal,
  type UserPublic,
} from "../features/parent/parentApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Link child modal ─────────────────────────────────────────────────────────

function LinkChildModal({ onClose, onLinked }: { onClose: () => void; onLinked: (u: UserPublic) => void }) {
  const [studentId, setStudentId] = useState("");
  const [err, setErr] = useState("");

  async function handleLink() {
    if (!studentId.trim()) return;
    try {
      await parentApi.linkStudent(studentId.trim());
      const children = await parentApi.getChildren();
      const added = children.find((c) => c.id === studentId.trim());
      if (added) onLinked(added);
      onClose();
    } catch {
      setErr("Не удалось привязать — проверьте ID ученика");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Привязать ученика</h2>
        <input
          placeholder="ID ученика"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-2"
        />
        {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">Отмена</button>
          <button onClick={handleLink} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
            Привязать
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Goal list ────────────────────────────────────────────────────────────────

function GoalList({ studentId }: { studentId: string }) {
  const [goals, setGoals] = useState<ParentGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", targetXp: 100, reward: "" });

  useEffect(() => {
    parentApi.listGoals(studentId).then(setGoals).catch(console.error);
  }, [studentId]);

  async function handleCreate() {
    if (!form.title) return;
    const g = await parentApi.createGoal({
      studentId,
      title: form.title,
      targetXp: form.targetXp,
      ...(form.reward ? { reward: form.reward } : {}),
    });
    setGoals((prev) => [g, ...prev]);
    setShowForm(false);
    setForm({ title: "", targetXp: 100, reward: "" });
  }

  async function toggleAchieved(g: ParentGoal) {
    const updated = await parentApi.updateGoal(g.id, { achieved: !g.achieved });
    setGoals((prev) => prev.map((x) => (x.id === g.id ? updated : x)));
  }

  async function handleDelete(id: string) {
    await parentApi.deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Цели</h3>
        <button onClick={() => setShowForm(true)} className="text-xs text-indigo-600 hover:underline">+ Добавить</button>
      </div>

      {showForm && (
        <div className="bg-indigo-50 rounded-lg p-3 mb-3 space-y-2">
          <input
            placeholder="Название цели"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="XP цель"
              value={form.targetXp}
              onChange={(e) => setForm((f) => ({ ...f, targetXp: Number(e.target.value) }))}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <input
              placeholder="Награда"
              value={form.reward}
              onChange={(e) => setForm((f) => ({ ...f, reward: e.target.value }))}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-500">Отмена</button>
            <button onClick={handleCreate} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">Создать</button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="text-xs text-gray-400">Целей нет</p>
      ) : (
        <ul className="space-y-1">
          {goals.map((g) => (
            <li key={g.id} className={`flex items-center gap-2 p-2 rounded-lg border ${g.achieved ? "bg-green-50 border-green-200" : "bg-white"}`}>
              <button onClick={() => toggleAchieved(g)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${g.achieved ? "bg-green-500 border-green-500" : "border-gray-300"}`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${g.achieved ? "line-through text-gray-400" : ""}`}>{g.title}</p>
                <p className="text-xs text-gray-400">{g.targetXp} XP{g.reward ? ` · 🎁 ${g.reward}` : ""}</p>
              </div>
              <button onClick={() => handleDelete(g.id)} className="text-gray-300 hover:text-red-400 text-sm">×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Progress panel ───────────────────────────────────────────────────────────

function ProgressPanel({ studentId }: { studentId: string }) {
  const [data, setData] = useState<ChildProgress | null>(null);

  useEffect(() => {
    parentApi.getProgress(studentId).then(setData).catch(console.error);
  }, [studentId]);

  if (!data) return <p className="text-gray-400 text-sm">Загрузка...</p>;

  return (
    <div className="space-y-4">
      {data.profile && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "XP", value: data.profile.xp },
            { label: "Уровень", value: data.profile.level },
            { label: "Серия", value: `${data.profile.streak} дн.` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-indigo-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-indigo-600">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h4 className="font-semibold text-sm mb-2">Курсы</h4>
        {data.courses.length === 0 ? (
          <p className="text-xs text-gray-400">Нет записей на курсы</p>
        ) : (
          <ul className="space-y-2">
            {data.courses.map((c) => (
              <li key={c.id} className="bg-white border rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium truncate">{c.title}</span>
                  <span className="text-gray-400 text-xs">{c.lessonsDone}/{c.lessonsTotal}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {data.recentSubmissions.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Последние сдачи</h4>
          <ul className="space-y-1">
            {data.recentSubmissions.map((s) => (
              <li key={s.id} className="flex justify-between text-sm bg-white border rounded px-3 py-2">
                <span className="truncate">{s.assignment.title}</span>
                <span className={`font-semibold ${s.score !== null && s.score >= s.assignment.maxScore * 0.6 ? "text-green-600" : "text-red-500"}`}>
                  {s.score !== null ? `${s.score}/${s.assignment.maxScore}` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recentAttempts.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Тесты</h4>
          <ul className="space-y-1">
            {data.recentAttempts.map((a) => (
              <li key={a.id} className="flex justify-between text-sm bg-white border rounded px-3 py-2">
                <span className="truncate">{a.test.title}</span>
                <span className={`font-semibold ${a.passed ? "text-green-600" : "text-red-500"}`}>
                  {a.score}% {a.passed ? "✓" : "✗"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({ userId }: { userId: string }) {
  const [teachers, setTeachers] = useState<UserPublic[]>([]);
  const [partner, setPartner] = useState<UserPublic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    parentApi.listTeachers().then(setTeachers).catch(console.error);
  }, []);

  async function openChat(t: UserPublic) {
    setPartner(t);
    const msgs = await parentApi.getMessages(t.id);
    setMessages(msgs);
  }

  async function handleSend() {
    if (!partner || !draft.trim()) return;
    const msg = await parentApi.sendMessage(partner.id, draft.trim());
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  }

  return (
    <div className="flex gap-3 h-96">
      {/* Teacher list */}
      <div className="w-48 flex-shrink-0 border rounded-lg overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b">Учителя</p>
        {teachers.map((t) => (
          <button
            key={t.id}
            onClick={() => openChat(t)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${partner?.id === t.id ? "bg-indigo-50 font-medium" : ""}`}
          >
            {t.firstName} {t.lastName}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        {!partner ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Выберите учителя</div>
        ) : (
          <>
            <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">
              {partner.firstName} {partner.lastName}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.senderId === userId ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                    <p>{m.content}</p>
                    <p className={`text-xs mt-1 ${m.senderId === userId ? "text-indigo-200" : "text-gray-400"}`}>
                      {formatDate(m.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-2 border-t">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Сообщение..."
                className="flex-1 border rounded px-3 py-1 text-sm"
              />
              <button onClick={handleSend} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

type Tab = "progress" | "goals" | "chat";

export function ParentDashboard() {
  const [children, setChildren] = useState<UserPublic[]>([]);
  const [selectedChild, setSelectedChild] = useState<UserPublic | null>(null);
  const [tab, setTab] = useState<Tab>("progress");
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = (() => {
    try {
      const token = localStorage.getItem("accessToken") ?? "";
      const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
      return (payload as { sub?: string }).sub ?? "";
    } catch { return ""; }
  })();

  useEffect(() => {
    parentApi
      .getChildren()
      .then((c) => {
        setChildren(c);
        if (c.length > 0 && !selectedChild) setSelectedChild(c[0]!);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "progress", label: "Успеваемость" },
    { key: "goals", label: "Цели" },
    { key: "chat", label: "Чат с учителями" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Дашборд родителя</h1>
        <button onClick={() => setShowLink(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          + Привязать ребёнка
        </button>
      </div>

      {showLink && (
        <LinkChildModal
          onClose={() => setShowLink(false)}
          onLinked={(u) => {
            setChildren((prev) => [...prev, u]);
            setSelectedChild(u);
          }}
        />
      )}

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : children.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">👨‍👩‍👧</p>
          <p>Нет привязанных детей</p>
          <button onClick={() => setShowLink(true)} className="mt-3 text-indigo-600 hover:underline text-sm">
            Привязать сейчас
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar: children */}
          <div className="w-48 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Дети</p>
            <ul className="space-y-1">
              {children.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => { setSelectedChild(c); setTab("progress"); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedChild?.id === c.id ? "bg-indigo-600 text-white font-medium" : "hover:bg-gray-100"}`}
                  >
                    {c.firstName} {c.lastName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t.key ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {selectedChild && (
              <div>
                {tab === "progress" && <ProgressPanel studentId={selectedChild.id} />}
                {tab === "goals" && <GoalList studentId={selectedChild.id} />}
                {tab === "chat" && <ChatPanel userId={userId} />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
