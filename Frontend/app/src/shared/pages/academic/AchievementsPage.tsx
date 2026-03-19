import { PageHeader } from '../../ui/PageHeader'

const ACHIEVEMENTS = [
  { id: 1, title: 'Отличник месяца', desc: 'Получите 20 оценок "5" за один месяц', xp: '+500 XP', icon: '🏆', color: 'bg-amber-50 border-amber-100 text-amber-600', earned: true },
  { id: 2, title: 'Спринтер', desc: 'Выполните все домашние задания вовремя в течение недели', xp: '+200 XP', icon: '⚡', color: 'bg-blue-50 border-blue-100 text-blue-600', earned: true },
  { id: 3, title: 'Книжный червь', desc: 'Прочитайте 10 книг из списка силлабуса', xp: '+300 XP', icon: '📚', color: 'bg-emerald-50 border-emerald-100 text-emerald-600', earned: false },
  { id: 4, title: 'Мастер турниров', desc: 'Займите 1 место в глобальном турнире', xp: '+1000 XP', icon: '🥇', color: 'bg-purple-50 border-purple-100 text-purple-600', earned: false },
  { id: 5, title: 'Ранняя пташка', desc: 'Приходите на занятия без опозданий целый месяц', xp: '+400 XP', icon: '🌅', color: 'bg-rose-50 border-rose-100 text-rose-600', earned: true },
  { id: 6, title: 'Помощник', desc: 'Ответьте на 10 вопросов одноклассников в чате', xp: '+150 XP', icon: '🤝', color: 'bg-indigo-50 border-indigo-100 text-indigo-600', earned: false },
]

export function AchievementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Достижения"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Академическое' },
          { label: 'Достижения' }
        ]}
      />

      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Ваш прогресс</h3>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Собрано 24 из 50 ачивок</p>
           </div>
           <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[48%] rounded-full shadow-lg shadow-primary/30" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map(item => (
            <div key={item.id} className={`p-6 rounded-[32px] border transition-all relative group ${item.earned ? 'bg-white border-slate-100 shadow-sm hover:shadow-md' : 'bg-slate-50 border-dashed border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-5">
                 <div className={`w-16 h-16 rounded-[24px] border flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
                   {item.icon}
                 </div>
                 <div>
                    <h4 className="font-black text-slate-900 leading-tight">{item.title}</h4>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 block">{item.xp}</span>
                 </div>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed">
                {item.desc}
              </p>
              {!item.earned && (
                <div className="absolute top-4 right-4">
                   <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
