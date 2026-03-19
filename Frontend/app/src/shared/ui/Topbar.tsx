import { IconBell, IconSearch } from './icons'

export function Topbar() {
  return (
    <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-8 gap-10 flex-shrink-0 z-40 relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md pointer-events-none" />
      
      {/* Search */}
      <div className="relative flex-shrink-0 z-10 hidden lg:block">
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          className="h-11 w-[320px] rounded-2xl bg-slate-50 border border-slate-100 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white placeholder:text-slate-400 transition-all"
          placeholder="Поиск по платформе..."
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
           <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">⌘</span>
           <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">K</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-auto z-10">
        {/* Academic Year */}
        <div className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Уч. год: <span className="text-slate-900">24/25</span></span>
        </div>

        {/* Global Stats Button (Gamification) */}
        <button className="h-11 px-4 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 hover:bg-amber-50 group transition-all flex items-center gap-2">
           <span className="text-lg group-hover:scale-125 transition-transform">🪙</span>
           <span className="text-xs font-black text-slate-600 group-hover:text-amber-600 transition-colors">2,150 XP</span>
        </button>

        {/* Notification icons */}
        <div className="flex items-center gap-2">
          <button
            className="h-11 w-11 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 grid place-items-center relative transition group"
            aria-label="Уведомления"
          >
            <IconBell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 h-3 w-3 rounded-full bg-rose-500 ring-4 ring-white flex items-center justify-center text-[7px] font-black text-white">3</span>
          </button>
          
          <button
            className="h-11 w-11 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 grid place-items-center relative transition group"
            aria-label="Сообщения"
          >
            <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute top-2.5 right-2.5 h-3 w-3 rounded-full bg-primary ring-4 ring-white flex items-center justify-center text-[7px] font-black text-white">5</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-100 mx-2" />

        {/* Avatar */}
        <button className="flex items-center gap-3 pl-2 group">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-primaryDark text-white grid place-items-center font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform border-2 border-white">
            A
          </div>
          <div className="hidden sm:block text-left relative">
            <div className="text-xs font-black text-slate-900 leading-tight">Администратор</div>
            <div className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mt-0.5 opacity-70">Премиум</div>
          </div>
          <svg className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  )
}
