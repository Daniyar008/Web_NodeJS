import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function VerifyEmailPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      leftTitle="Почта и безопасность"
      leftItems={[
        { title: 'Подтверждение email', desc: 'Мы отправили ссылку на вашу почту.' },
        { title: 'Не пришло письмо?', desc: 'Проверьте спам или отправьте повторно.' },
        { title: 'Дальше — 2FA', desc: 'Для безопасности включим двухфакторный код.' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
          P
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Подтвердите email</h1>
        <p className="text-sm text-slate-500">
          Мы отправили ссылку на <span className="font-semibold text-slate-900">ter4@example.com</span>
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/2fa')}
          className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
        >
          Продолжить
        </button>

        <div className="text-xs text-center text-slate-500">
          Не получили письмо?{' '}
          <button type="button" className="text-primary font-semibold">
            Отправить ещё раз
          </button>
        </div>

        <div className="text-xs text-center text-slate-500">
          <Link to="/login" className="text-primary font-semibold">
            Пропустить и войти
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}

