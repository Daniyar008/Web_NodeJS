import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function SignUpPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      leftTitle="Добро пожаловать в PreSkool"
      leftItems={[
        { title: 'Быстрый старт', desc: 'Создайте аккаунт и начните настройку школы за минуты.' },
        { title: 'Управление', desc: 'Классы, ученики, учителя, расписание и отчёты — в одном месте.' },
        { title: 'Безопасность', desc: 'Подтверждение email и двухфакторная защита аккаунта.' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
          P
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Регистрация</h1>
        <p className="text-sm text-slate-500">Введите данные, чтобы создать аккаунт</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/verify-email')
        }}
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Имя</label>
          <input
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="Иван Иванов"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Пароль</label>
          <input
            type="password"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Подтвердите пароль</label>
          <input
            type="password"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="••••••••"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" className="accent-primary" defaultChecked />
          Я согласен с <span className="text-primary font-semibold">Условиями</span> и{' '}
          <span className="text-primary font-semibold">Политикой</span>
        </label>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
        >
          Зарегистрироваться
        </button>

        <div className="text-xs text-center text-slate-500">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary font-semibold">
            Войти
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

