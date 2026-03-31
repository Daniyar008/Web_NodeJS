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

const roleIcons: Record<RoleOption, string> = {
  STUDENT: "🎓",
  TEACHER: "📖",
  PARENT: "👨‍👩‍👧",
  INSTITUTION_ADMIN: "🏫",
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
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12), transparent)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="glass-bright rounded-3xl p-8 sm:p-10"
          style={{
            boxShadow: '0 0 80px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.4)',
          }}
        >
          {/* Branding */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent-teal) 100%)',
                boxShadow: '0 0 30px rgba(99,102,241,0.4)',
              }}
            >
              E
            </div>
            <h1
              className="heading-font text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EduFuture
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--ink-500)' }}>
              Образовательная платформа нового поколения
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)' }}
          >
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(null); }}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  color: tab === t ? 'var(--ink-100)' : 'var(--ink-500)',
                  background: tab === t
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(20,184,166,0.2) 100%)'
                    : 'transparent',
                  boxShadow: tab === t ? '0 0 15px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                {t === "login" ? "🔑 Вход" : "✨ Регистрация"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: '#fb7185',
              }}
            >
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <FieldInput name="email" type="email" label="Email" placeholder="you@example.com" required />
              <FieldInput name="password" type="password" label="Пароль" placeholder="••••••••" required />
              <SubmitBtn loading={loading}>Войти в систему</SubmitBtn>
              <p className="text-center text-xs pt-1" style={{ color: 'var(--ink-500)' }}>
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: 'var(--brand-light)' }}
                >
                  Зарегистрируйтесь
                </button>
              </p>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <FieldInput name="firstName" type="text" label="Имя" placeholder="Александр" required />
                <FieldInput name="lastName" type="text" label="Фамилия" placeholder="Иванов" required />
              </div>
              <FieldInput name="email" type="email" label="Email" placeholder="you@example.com" required />
              <FieldInput name="password" type="password" label="Пароль (мин. 8 симв.)" placeholder="••••••••" required />

              {/* Role Picker */}
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--ink-300)' }}>
                  Выберите роль
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(roleLabels) as RoleOption[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200"
                      style={{
                        background: role === r ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${role === r ? 'rgba(99,102,241,0.5)' : 'var(--line)'}`,
                        color: role === r ? 'var(--brand-light)' : 'var(--ink-300)',
                        boxShadow: role === r ? '0 0 15px rgba(99,102,241,0.15)' : 'none',
                      }}
                    >
                      <span className="text-base">{roleIcons[r]}</span>
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              </div>

              <SubmitBtn loading={loading}>Создать аккаунт</SubmitBtn>
            </form>
          )}
        </div>

        {/* Bottom hint */}
        <p className="text-center mt-5 text-xs" style={{ color: 'var(--ink-500)' }}>
          Надёжно защищено JWT + PostgreSQL
        </p>
      </div>
    </div>
  );
}

/* ── Reusable field ─────────────────────────────── */
function FieldInput({
  name, type, label, placeholder, required,
}: {
  name: string; type: string; label: string; placeholder: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--ink-300)' }}>
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </label>
  );
}

/* ── Submit button ──────────────────────────────── */
function SubmitBtn({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full btn-primary justify-center py-3.5 rounded-xl text-base mt-2"
      style={{
        borderRadius: '0.75rem',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          />
          Загрузка...
        </span>
      ) : children}
    </button>
  );
}
