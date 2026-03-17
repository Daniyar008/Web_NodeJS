import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function SignInPage() {
  const navigate = useNavigate()

  return (
    <AuthShell variant="split-notices">
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Login with your Email Address</h1>
        <p className="mt-3 text-sm text-slate-500">
          We sent a verification code to your email. Enter the code from the email in the field below
        </p>
      </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Электронная почта</label>
            <input
              type="email"
              required
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all shadow-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Пароль</label>
            <input
              type="password"
              required
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" defaultChecked />
              Запомнить меня
            </label>
            <Link to="/forgot-password" opacity-70 hover:opacity-100 transition-opacity>
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#5d73e7] text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Войти
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
               <span className="bg-white px-2">Или войти через</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center gap-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Войти через Google
          </button>

          <div className="text-xs text-center text-slate-500 font-medium pt-2">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Создать аккаунт
            </Link>
          </div>
        </form>
    </AuthShell>
  )
}

