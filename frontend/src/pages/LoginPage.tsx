import { type FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { authApi } from "../features/auth/authApi";
import { setUser, signIn } from "../features/auth/authSlice";

type RoleOption = "STUDENT" | "TEACHER" | "PARENT" | "INSTITUTION_ADMIN";

const roleLabels: Record<RoleOption, string> = {
  STUDENT: "Ученик",
  TEACHER: "Учитель",
  PARENT: "Родитель",
  INSTITUTION_ADMIN: "Учреждение",
};

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<RoleOption>("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const tokens = await authApi.login({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      dispatch(signIn(tokens));
      const me = await authApi.me();
      dispatch(setUser(me));
      navigate(`/dashboard/${me.role.toLowerCase()}`);
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const tokens = await authApi.register({
        email: String(form.get("email")),
        password: String(form.get("password")),
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        roleName: role,
      });
      dispatch(signIn(tokens));
      const me = await authApi.me();
      dispatch(setUser(me));
      navigate(`/dashboard/${me.role.toLowerCase()}`);
    } catch {
      setError("Ошибка регистрации. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
      <h1 className="heading-font text-3xl font-bold">EduFuture</h1>

      {/* Tabs */}
      <div className="mt-4 flex rounded-xl bg-[#f0f0eb] p-1">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === t ? "bg-white shadow-sm text-[color:var(--ink-900)]" : "text-[color:var(--ink-700)]"}`}
          >
            {t === "login" ? "Вход" : "Регистрация"}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {tab === "login" ? (
        <form className="mt-5 space-y-4" onSubmit={handleLogin}>
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Пароль" placeholder="••••••••" required />
          <Submit loading={loading}>Войти</Submit>
        </form>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-3">
            <Input name="firstName" type="text" label="Имя" placeholder="Александр" required />
            <Input name="lastName" type="text" label="Фамилия" placeholder="Иванов" required />
          </div>
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Пароль (мин. 8 симв.)" placeholder="••••••••" required />
          <label className="block text-sm font-semibold text-[color:var(--ink-900)]">
            Роль
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleOption)}
              className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 outline-none transition focus:border-[color:var(--brand)]"
            >
              {(Object.keys(roleLabels) as RoleOption[]).map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
          </label>
          <Submit loading={loading}>Зарегистрироваться</Submit>
        </form>
      )}
    </section>
  );
}

// --- UI helpers ---

function Input({ name, type, label, placeholder, required }: {
  name: string; type: string; label: string; placeholder: string; required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-[color:var(--ink-900)]">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[color:var(--brand)]"
      />
    </label>
  );
}

function Submit({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)] disabled:opacity-60"
    >
      {loading ? "Загрузка..." : children}
    </button>
  );
}
