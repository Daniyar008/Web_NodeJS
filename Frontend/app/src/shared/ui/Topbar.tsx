import { IconBell, IconSearch } from './icons'

export function Topbar() {
  return (
    <header className="h-16 bg-surface border-b border-slate-200 flex items-center justify-between px-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-[420px] max-w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconSearch />
          </div>
          <input
            className="w-full h-10 rounded-xl bg-bg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            placeholder="Поиск"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 grid place-items-center"
          aria-label="Уведомления"
        >
          <IconBell />
        </button>

        <div className="flex items-center gap-3 pl-1">
          <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-slate-900">Админ</div>
            <div className="text-xs text-slate-500">Суперадмин</div>
          </div>
        </div>
      </div>
    </header>
  )
}

