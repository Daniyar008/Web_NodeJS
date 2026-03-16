import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

function DigitBox({
  value,
  onChange,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  autoFocus?: boolean
}) {
  return (
    <input
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 1))}
      className="h-12 w-12 rounded-xl border border-slate-200 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
      aria-label="Цифра кода"
    />
  )
}

export function TwoFactorPage() {
  const navigate = useNavigate()
  const [d, setD] = useState(['', '', '', ''])
  const code = useMemo(() => d.join(''), [d])

  return (
    <AuthShell
      leftTitle="Дополнительная защита"
      leftItems={[
        { title: 'Код подтверждения', desc: 'Отправлен на вашу почту, введите 4 цифры.' },
        { title: 'Время ограничено', desc: 'Код действует несколько минут.' },
        { title: 'Безопасность', desc: '2FA снижает риск взлома аккаунта.' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-white grid place-items-center font-bold text-xl">
          P
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Вход по коду</h1>
        <p className="text-sm text-slate-500">Введите код из письма</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        {d.map((v, i) => (
          <DigitBox
            key={i}
            value={v}
            autoFocus={i === 0}
            onChange={(nv) => {
              const next = [...d]
              next[i] = nv
              setD(next)
            }}
          />
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        Код истечёт через <span className="font-semibold text-rose-600">09:59</span>
      </div>

      <button
        disabled={code.length !== 4}
        onClick={() => navigate('/')}
        className="mt-5 w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition disabled:opacity-50 disabled:hover:bg-primary"
      >
        Подтвердить
      </button>
    </AuthShell>
  )
}

