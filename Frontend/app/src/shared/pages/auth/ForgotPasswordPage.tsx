import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function ForgotPasswordPage({ variant = 'split-illustration' }: { variant?: 'centered' | 'split-illustration' }) {
  const navigate = useNavigate()

  const content = (
    <>
      <div className="text-center lg:text-left mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
        <p className="mt-3 text-[13px] text-slate-500 leading-relaxed font-medium">
          If you forgot your password, well, then we'll email you instructions to reset your password.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/reset-password')
        }}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
          <div className="relative group">
            <input
              type="email"
              required
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all shadow-sm"
              placeholder="you@example.com"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-2xl bg-[#5d73e7] text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Sign In
        </button>

        <div className="text-xs text-center lg:text-left font-bold text-slate-500">
          Return to <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </div>
      </form>
    </>
  )

  if (variant === 'split-illustration') {
     return (
       <AuthShell 
         variant="split-illustration"
         illustration={
            <div className="relative w-full aspect-square flex items-center justify-center">
               <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px]" />
               <div className="relative z-10 w-full max-w-sm">
                  {/* Girls on sofa illustration simulation */}
                  <div className="aspect-[4/3] bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 p-6 shadow-2xl overflow-hidden">
                     <div className="w-full h-full flex flex-col gap-4">
                        <div className="h-1/2 w-full bg-primary/10 rounded-2xl animate-pulse" />
                        <div className="flex-1 space-y-2">
                           <div className="h-3 w-1/2 bg-slate-200 rounded" />
                           <div className="h-2 w-full bg-slate-100 rounded" />
                           <div className="h-2 w-full bg-slate-100 rounded" />
                        </div>
                     </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-white/80 rounded-3xl shadow-xl border border-white rotate-12 flex items-center justify-center text-primary font-black text-4xl">?</div>
               </div>
            </div>
         }
       >
         {content}
       </AuthShell>
     )
  }

  return <AuthShell variant="centered">{content}</AuthShell>
}

