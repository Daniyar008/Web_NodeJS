import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      leftTitle="Помощь со входом"
      leftItems={[
        { title: 'Сброс пароля', desc: 'Мы отправим инструкции на вашу почту.' },
        { title: 'Безопасно', desc: 'Ссылка действует ограниченное время.' },
        { title: 'Поддержка', desc: 'Если письмо не приходит — проверьте спам.' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
          P
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Забыли пароль?</h1>
        <p className="text-sm text-slate-500">Укажите email — мы отправим инструкции для сброса</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/reset-password')
        }}
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            required
            className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
        >
          Отправить
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

