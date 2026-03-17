import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'

export function VerifyEmailPage({ variant = 'centered' }: { variant?: 'centered' | 'split-illustration' }) {
  const navigate = useNavigate()

  const content = (
    <>
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-900">Verify your Email</h1>
        <p className="mt-3 text-[13px] text-slate-500 leading-relaxed px-4">
          We've sent a link to your email <span className="font-bold text-slate-800">ter4@example.com</span>. Please follow the link inside to continue
        </p>
        <p className="mt-4 text-[11px] text-slate-400 font-medium">
          Didn't receive an email? <button className="text-primary font-bold hover:underline transition-all">Resend Link</button>
        </p>
      </div>

      <button
        onClick={() => navigate('/2fa')}
        className="w-full h-14 rounded-2xl bg-[#5d73e7] text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
      >
        Skip Now
      </button>
    </>
  )

  if (variant === 'split-illustration') {
     return (
       <AuthShell 
         variant="split-illustration"
         leftTitle="Check your inbox"
         leftItems={[{ title: '', desc: 'We have sent a verification link to your email address. It may take a few minutes for the email to arrive.' }]}
         illustration={
            <div className="relative w-full aspect-video flex items-center justify-center bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 p-8 shadow-2xl">
              <div className="absolute inset-x-0 -top-4 flex justify-center">
                 <div className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg">NEW NOTIFICATION</div>
              </div>
              <div className="w-full space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className={`h-12 w-full rounded-2xl bg-white shadow-sm flex items-center px-4 gap-3 ${i === 1 ? 'ring-2 ring-primary/20' : 'opacity-60'}`}>
                       <div className="h-6 w-6 rounded-full bg-slate-100" />
                       <div className="flex-1 space-y-1">
                          <div className="h-2 w-24 bg-slate-200 rounded" />
                          <div className="h-1.5 w-full bg-slate-100 rounded" />
                       </div>
                    </div>
                 ))}
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

