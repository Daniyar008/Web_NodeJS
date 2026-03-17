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
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      className="h-16 w-16 rounded-2xl border border-slate-200 text-center text-2xl font-bold bg-white focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none shadow-sm"
      aria-label="Digit box"
    />
  )
}

export function TwoFactorPage({ variant = 'centered' }: { variant?: 'centered' | 'split-illustration' }) {
  const navigate = useNavigate()
  const [d, setD] = useState(['', '', '', ''])
  const code = useMemo(() => d.join(''), [d])

  const content = (
    <>
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-900">Login with your Email Address</h1>
        <p className="mt-3 text-[13px] text-slate-500 leading-relaxed">
          We sent a verification code to your email. Enter the code from the email in the field below
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {d.map((v, i) => (
          <DigitBox
            key={i}
            value={v}
            autoFocus={i === 0}
            onChange={(nv: string) => {
              const next = [...d]
              const char = nv.slice(-1)
              if (char) {
                 next[i] = char
                 setD(next)
                 const inputs = document.querySelectorAll('input')
                 const nextInput = inputs[i + 1]
                 if (nextInput) (nextInput as HTMLInputElement).focus()
              } else {
                 next[i] = ''
                 setD(next)
              }
            }}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block px-4 py-1.5 bg-rose-50 rounded-full text-[11px] font-bold text-rose-600 border border-rose-100 shadow-sm animate-pulse">
           Otp will expire in 09:59
        </div>
      </div>

      <button
        disabled={code.length !== 4}
        onClick={() => navigate('/')}
        className="mt-10 w-full h-14 rounded-2xl bg-[#5d73e7] text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
      >
        Verify My Account
      </button>
    </>
  )

  if (variant === 'split-illustration') {
     return (
       <AuthShell 
         variant="split-illustration"
         leftTitle="Secure your account"
         leftItems={[{ title: '', desc: 'Two-step verification adds an extra layer of security to your account by requiring more than just a password to log in.' }]}
         illustration={
           <div className="relative w-full aspect-square flex items-center justify-center">
             <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
             <svg className="w-full h-full text-primary/80 relative z-10 drop-shadow-2xl" viewBox="0 0 200 200" fill="none">
                <rect x="40" y="40" width="120" height="120" rx="20" fill="currentColor" fillOpacity="0.1" />
                <path d="M70 100L90 120L130 80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" />
             </svg>
           </div>
         }
       >
         {content}
       </AuthShell>
     )
  }

  return <AuthShell variant="centered">{content}</AuthShell>
}

