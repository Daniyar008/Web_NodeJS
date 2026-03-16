import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function SignInPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      leftTitle="Что нового в PreSkool"
      leftItems={[
        { title: 'Летние каникулы — домашние задания', desc: 'Школа будет закрыта с 20 апреля по июнь…' },
        { title: 'Набор на новый учебный год (2024–2025)', desc: 'Учебный период — это часть учебного года…' },
        { title: 'Ежегодный праздник школы', desc: 'Мероприятия дают возможность ученикам проявить себя…' },
      ]}
    >
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
            P
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Добро пожаловать</h1>
          <p className="text-sm text-slate-500">Введите данные, чтобы войти</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              required
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              placeholder="admin@example.com"
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="accent-primary" defaultChecked />
              Запомнить меня
            </label>
            <Link to="/forgot-password" className="text-primary font-medium">
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
          >
            Войти
          </button>

          <div className="text-xs text-center text-slate-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary font-semibold">
              Создать аккаунт
            </Link>
          </div>
        </form>
    </AuthShell>
  )
}

