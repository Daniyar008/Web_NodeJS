import { PageHeader } from '../../ui/PageHeader'

const CHILDREN = [
  { name: 'Анна Иванова', class: '8 "А"', averageGrade: 4.8, attendance: 95, avatar: 'A', color: 'primary' },
  { name: 'Михаил Иванов', class: '5 "Б"', averageGrade: 4.2, attendance: 98, avatar: 'M', color: 'emerald-500' },
]

const RECENT_GRADES = [
  { subject: 'Математика', grade: '5', type: 'Контрольная', date: 'Сегодня', teacher: 'Петров В.А.' },
  { subject: 'Физика', grade: '4', type: 'ДЗ', date: 'Вчера', teacher: 'Сидоров К.М.' },
  { subject: 'Литература', grade: '5', type: 'Эссе', date: '15.03', teacher: 'Ахматова А.А.' },
]

export function ParentDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Панель родителя"
        breadcrumbs={[{ label: 'Панель', to: '/' }, { label: 'Родитель' }]}
      />

      {/* Children Selection Tabs */}
      <div className="flex gap-4 p-2 bg-slate-100/50 rounded-[32px] w-fit">
         {CHILDREN.map((child, idx) => (
            <button key={idx} className={`flex items-center gap-4 h-16 px-8 rounded-3xl transition-all ${idx === 0 ? 'bg-white shadow-xl shadow-slate-200/50 text-slate-900' : 'text-slate-500 hover:bg-white/50'}`}>
               <div className={`w-10 h-10 rounded-2xl bg-${idx === 0 ? 'primary' : 'emerald-500'} flex items-center justify-center text-white font-black shadow-lg`}>
                  {child.avatar}
               </div>
               <div className="text-left">
                  <div className="text-sm font-black tracking-tight">{child.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-slate-400">{child.class}</div>
               </div>
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Stats & Grades */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Средний балл</h3>
                 <div className="text-5xl font-black text-slate-900 tracking-tighter">4.8</div>
                 <div className="mt-6 flex items-center gap-2 text-emerald-500 text-xs font-bold">
                    <span className="bg-emerald-50 px-2 py-1 rounded-lg">↑ 0.2</span>
                    <span>лучше чем в прошлом месяце</span>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Посещаемость</h3>
                 <div className="text-5xl font-black text-slate-900 tracking-tighter">95%</div>
                 <div className="mt-6 flex items-center gap-1.5 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                       <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    ))}
                 </div>
              </div>
           </div>

           {/* Recent Grades Table */}
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Последние оценки</h3>
              <div className="space-y-4">
                 {RECENT_GRADES.map((grade, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg transition-all group">
                       <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl ${grade.grade === '5' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} flex items-center justify-center text-3xl font-black shadow-inner`}>
                             {grade.grade}
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-base">{grade.subject}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{grade.type} • {grade.teacher}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-black text-slate-900 tracking-tight">{grade.date}</div>
                          <button className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 hover:underline">Подробнее</button>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full h-16 rounded-[28px] bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest mt-6 hover:bg-slate-100 transition-all">Посмотреть все оценки</button>
           </div>
        </div>

        {/* Right: Motivation & Communication */}
        <div className="space-y-8">
           <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-3xl -mr-24 -mt-24" />
              <h3 className="text-2xl font-black mb-4 relative z-10">Мотивация</h3>
              <p className="text-slate-400 text-sm mb-10 relative z-10 leading-relaxed">Настройте цель и награду для вашего ребенка, чтобы стимулировать интерес к учебе.</p>
              
              <div className="space-y-8 relative z-10">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">Цель: 5 пятерок за неделю</span>
                       <span>3/5</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-primary w-[60%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                 </div>
                 
                 <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <div className="text-3xl">🍿</div>
                    <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Награда</div>
                       <div className="text-sm font-bold">Семейный поход в кино</div>
                    </div>
                 </div>
              </div>
              
              <button className="w-full h-14 bg-white text-slate-900 text-sm font-black rounded-2xl mt-10 hover:bg-slate-100 transition-all active:scale-95 shadow-lg shadow-black/20">Изменить цель</button>
           </div>

           {/* Contact Teachers */}
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Связаться с учителем</h3>
              <div className="space-y-4">
                 {[
                   { name: 'Иванова М.И.', subject: 'Куратор/Математика', online: true },
                   { name: 'Петров В.А.', subject: 'Физика', online: false },
                 ].map((t, idx) => (
                    <button key={idx} className="w-full p-5 rounded-3xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-left flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-lg relative">
                             👩‍🏫
                             {t.online && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary">{t.name}</div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.subject}</div>
                          </div>
                       </div>
                       <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/20 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.213L3 20l1.397-3.493A8.932 8.932 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
