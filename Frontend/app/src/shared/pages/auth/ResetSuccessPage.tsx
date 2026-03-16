import { Link } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function ResetSuccessPage() {
  return (
    <AuthShell
      leftTitle="Успех"
      leftItems={[
        { title: 'Пароль обновлён', desc: 'Ваш пароль успешно изменён.' },
        { title: 'Защита', desc: 'Рекомендуем использовать уникальные пароли.' },
        { title: 'Продолжайте работу', desc: 'Теперь можно войти в систему.' },
      ]}
    >
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Успешно</h1>
        <p className="text-sm text-slate-500 mt-1">Пароль успешно сброшен</p>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition"
        >
          Вернуться ко входу
        </Link>
      </div>
    </AuthShell>
  )
}

