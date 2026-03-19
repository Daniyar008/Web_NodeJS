import { PageHeader, ExportButton } from '../../ui/PageHeader'

const STATS = [
  { label: 'Всего учеников', value: '1,245', icon: '👥', color: 'bg-blue-50 text-blue-600' },
  { label: 'Учителей', value: '78', icon: '👨‍🏫', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Классов', value: '42', icon: '🏫', color: 'bg-amber-50 text-amber-600' },
  { label: 'Курсов', value: '156', icon: '📚', color: 'bg-purple-50 text-purple-600' },
]

export function InstitutionDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Управление учреждением"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Учреждение' },
          { label: 'Дашборд' }
        ]}
        actions={<ExportButton />}
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
             <div className="relative z-10 space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl shadow-sm border border-white`}>
                   {stat.icon}
                </div>
                <div>
                   <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Активность пользователей</h3>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Последние 30 дней</p>
              </div>
              <div className="flex gap-2">
                 {['Неделя', 'Месяц'].map(t => (
                   <button key={t} className={`h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Месяц' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>
                     {t}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="h-64 flex items-end gap-3 px-4 opacity-40">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary rounded-t-lg transition-all hover:opacity-100" 
                  style={{ height: `${20 + Math.random() * 80}%` }}
                />
              ))}
           </div>
           <div className="mt-6 flex justify-between px-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>01 Март</span>
              <span>15 Март</span>
              <span>30 Март</span>
           </div>
        </div>

        {/* Institution Info */}
        <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -mr-40 -mt-40 rounded-full" />
           <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-6 transition-transform">
                 <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-2 4h.01M9 16h.01M15 16h.01M9 20h.01M15 20h.01" /></svg>
              </div>
              <div>
                 <h4 className="text-2xl font-black leading-tight">Гимназия №5 "EduFuture"</h4>
                 <p className="text-slate-400 text-sm font-medium mt-3 leading-relaxed">Лицензия: №123-ABC продлена до 2028 года.</p>
              </div>
           </div>
           
           <div className="relative z-10 pt-10 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-lg">🎖️</div>
                 <div>
                    <div className="text-xs font-black uppercase tracking-widest">Статус</div>
                    <div className="text-sm font-bold text-primary">Ведущее учреждение</div>
                 </div>
              </div>
              <button className="w-full h-14 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-all">
                Настройки учреждения
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
