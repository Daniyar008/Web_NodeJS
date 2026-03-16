import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function ResetPasswordPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      leftTitle="Восстановление доступа"
      leftItems={[
        { title: 'Новый пароль', desc: 'Придумайте надёжный пароль для аккаунта.' },
        { title: 'Подтверждение', desc: 'Повторите пароль, чтобы избежать ошибок.' },
        { title: 'Готово', desc: 'После смены пароля можно сразу входить в систему.' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
          P
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Сброс пароля</h1>
        <p className="text-sm text-slate-500">Введите новый пароль и подтвердите его</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/reset-success')
        }}
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Старый пароль</label>
          <input
            type="password"
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Новый пароль</label>
          <input
            type="password"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Подтвердите новый пароль</label>
          <input
            type="password"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
        >
          Сменить пароль
        </button>

        <div className="text-xs text-center text-slate-500">
          <Link to="/login" className="text-primary font-semibold">
            Вернуться ко входу
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

