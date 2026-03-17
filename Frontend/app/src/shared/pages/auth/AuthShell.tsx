import type { ReactNode } from 'react'

export type AuthVariant = 'centered' | 'split-illustration' | 'split-notices'

export function AuthShell({
  variant = 'split-notices',
  leftTitle,
  leftItems,
  illustration,
  children,
}: {
  variant?: AuthVariant
  leftTitle?: string
  leftItems?: Array<{ title: string; desc: string }>
  illustration?: ReactNode
  children: ReactNode
}) {
  if (variant === 'centered') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50/50">
        <div className="w-full max-w-[440px] flex flex-col items-center">
          <div className="mb-10 flex flex-col items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-xl">
               <svg className="w-full h-full text-primary" viewBox="0 0 40 40" fill="currentColor"><rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.1" /><path d="M12 10H20C24.4183 10 28 13.5817 28 18V22C28 26.4183 24.4183 30 20 30H12V10Z" fill="white" /><path d="M16 14V26M16 14H20C22.2091 14 24 15.7909 24 18C24 20.2091 22.2091 22 20 22H16V14Z" fill="currentColor" /></svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">PreSkool</div>
          </div>
          <div className="w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10">
            {children}
          </div>
          <div className="mt-10 text-[11px] text-slate-400 font-medium">Copyright © 2024 - Preskool</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Pane */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary/5 items-center justify-center p-12 overflow-hidden border-r border-slate-100">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />

        {variant === 'split-illustration' ? (
          <div className="relative z-10 w-full flex flex-col items-center">
             <div className="w-full max-w-md">
                {illustration || (
                  <div className="aspect-square bg-slate-200/50 rounded-3xl animate-pulse flex items-center justify-center text-slate-400 text-sm font-medium">
                    [Illustration]
                  </div>
                )}
             </div>
             {leftTitle && (
               <div className="mt-8 text-center max-w-sm">
                  <h2 className="text-2xl font-bold text-slate-900">{leftTitle}</h2>
                  <p className="mt-2 text-slate-500 text-sm italic">{leftItems?.[0]?.desc}</p>
               </div>
             )}
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-lg">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-10 shadow-2xl space-y-8">
               <h2 className="text-2xl font-bold text-slate-900">What's New in Preskool !!!</h2>
               <div className="space-y-4">
                 {[
                   { title: 'Summer Homework', desc: 'The school will be closed from April 20 to June...' },
                   { title: 'New Academic Year (2024-25)', desc: 'Academic term is part of the school year...' },
                   { title: 'Exams Timetable Nursery to Sr.Kg', desc: 'Parents, the final exams for the session...' },
                   { title: 'Annual Function Day', desc: 'Annual functions provide a platform...' },
                 ].map((item, idx) => (
                   <div key={idx} className="group cursor-pointer bg-white/60 hover:bg-white rounded-2xl p-4 border border-transparent hover:border-primary/10 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
                     <div className="pr-4">
                       <div className="text-xs font-bold text-slate-800">{item.title}</div>
                       <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.desc}</div>
                     </div>
                     <div className="flex-shrink-0 text-slate-400 group-hover:text-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
        
        {variant === 'split-illustration' && (
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-primary pointer-events-none" style={{ clipPath: 'ellipse(80% 100% at 20% 100%)' }} />
        )}
      </div>

      {/* Right Pane / Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <div className="mb-10 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl">
                 <svg className="w-full h-full text-primary" viewBox="0 0 40 40" fill="currentColor"><rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.1" /><path d="M12 10H20C24.4183 10 28 13.5817 28 18V22C28 26.4183 24.4183 30 20 30H12V10Z" fill="white" /><path d="M16 14V26M16 14H20C22.2091 14 24 15.7909 24 18C24 20.2091 22.2091 22 20 22H16V14Z" fill="currentColor" /></svg>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">PreSkool</div>
            </div>
            {children}
          </div>
          <div className="mt-20 text-center lg:text-left text-[11px] text-slate-400 font-medium">
            Copyright@2024 - Preskool
          </div>
        </div>
      </div>
    </div>
  )
}

