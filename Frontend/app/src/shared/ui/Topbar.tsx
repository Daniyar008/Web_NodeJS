import { IconBell, IconSearch } from './icons'

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-5 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="relative flex-shrink-0">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          className="h-9 w-[300px] max-w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-slate-400"
          placeholder="Поиск..."
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-mono">⌘K</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Academic Year */}
        <div className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-600">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Уч. год: <span className="font-semibold text-slate-900">2024 / 2025</span></span>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Notification icons */}
        <div className="flex items-center gap-1">
          <button
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 grid place-items-center relative transition"
            aria-label="Уведомления"
          >
            <IconBell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <button
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 grid place-items-center relative transition"
            aria-label="Сообщения"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
          </button>
          <button
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 grid place-items-center transition"
            aria-label="Статистика"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Avatar */}
        <button className="flex items-center gap-2.5 pl-1 hover:opacity-80 transition">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primaryDark text-white grid place-items-center font-bold text-sm">
            А
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900">Администратор</div>
            <div className="text-[10px] text-slate-500">Суперадмин</div>
          </div>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  )
}
