import { ReactNode } from 'react'

export function AuthShell({
  leftTitle,
  leftItems,
  children,
}: {
  leftTitle: string
  leftItems: Array<{ title: string; desc: string }>
  children: ReactNode
}) {
  return (
    <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <div className="hidden lg:flex rounded-3xl bg-gradient-to-br from-primary/25 to-primary/5 p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,103,227,0.35),transparent_55%)]" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="text-white/90 font-semibold text-lg">{leftTitle}</div>
          <div className="space-y-3">
            {leftItems.map(({ title, desc }) => (
              <div key={title} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{title}</div>
                <div className="text-xs text-slate-600 mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-card px-10 py-10 flex flex-col justify-center">
        {children}
      </div>
    </div>
  )
}

