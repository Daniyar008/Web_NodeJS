import { PageHeader } from '../../ui/PageHeader'

const LESSONS = [
  { id: 1, title: 'Введение в квантовую физику', duration: '12:45', type: 'video', completed: true },
  { id: 2, title: 'Кот Шрёдингера и суперпозиция', duration: '18:20', type: 'video', active: true },
  { id: 3, title: 'Квантовая запутанность', duration: '15:10', type: 'video' },
  { id: 4, title: 'Тест по основам', duration: '10:00', type: 'quiz' },
  { id: 5, title: 'Заключение модуля', duration: '05:30', type: 'text' },
]

export function CoursePlayerPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-8">
      {/* Left: Player & Content */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
         <PageHeader
            title="Основы квантовой физики"
            breadcrumbs={[{ label: 'Курсы', to: '/syllabus' }, { label: 'Квантовая физика' }]}
         />
         
         {/* Main Player Area */}
         <div className="bg-[#0f172a] rounded-[48px] aspect-video flex-shrink-0 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
               <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-90 hover:scale-100 transition-all group/play">
                  <svg className="w-10 h-10 translate-x-1 transition-transform group-hover/play:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
               </button>
            </div>
            {/* Player Controls Bar */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
               <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur">
                  <div className="h-full bg-primary w-1/3 rounded-full" />
               </div>
               <div className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">04:20 / 18:20</div>
            </div>
         </div>

         {/* Lesson Info Tabs */}
         <div className="flex-1 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm overflow-y-auto">
            <div className="flex gap-8 border-b border-slate-100 mb-8">
               {['Описание', 'Материалы', 'Вопросы', 'Заметки'].map((tab, i) => (
                  <button key={tab} className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-all ${i === 0 ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                     {tab}
                     {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                  </button>
               ))}
            </div>
            <div className="space-y-6">
               <h2 className="text-3xl font-black text-slate-900 leading-tight">Урок 2: Кот Шрёдингера и принцип суперпозиции</h2>
               <p className="text-slate-500 leading-relaxed font-medium">
                  В этом уроке мы разберем самый знаменитый мысленный эксперимент в физике. 
                  Вы узнаете, почему частица может находиться в двух состояниях одновременно и как 
                  наблюдение влияет на реальность.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all">
                     <span className="text-2xl">pdf</span>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Документ</div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Конспект урока.pdf</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all">
                     <span className="text-2xl">quiz</span>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Практика</div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Тест по теме</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right: Playlist / Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6 flex-shrink-0">
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Содержание</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">40% пройдено</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {LESSONS.map((lesson) => (
                  <button key={lesson.id} className={`w-full p-6 text-left rounded-[32px] transition-all flex items-center justify-between group ${lesson.active ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white hover:bg-slate-50'}`}>
                     <div className="flex items-center gap-5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${lesson.active ? 'bg-white/20' : lesson.completed ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                           {lesson.completed ? '✓' : lesson.id}
                        </div>
                        <div>
                           <div className={`text-sm font-bold tracking-tight ${lesson.active ? 'text-white' : 'text-slate-900 group-hover:text-primary transition-colors'}`}>{lesson.title}</div>
                           <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${lesson.active ? 'text-white/60' : 'text-slate-400'}`}>{lesson.duration} • {lesson.type}</div>
                        </div>
                     </div>
                     {!lesson.active && !lesson.completed && (
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     )}
                  </button>
               ))}
            </div>
            <div className="p-8 border-t border-slate-100">
               <button className="w-full h-16 rounded-[28px] bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-black/10">Следующий урок</button>
            </div>
         </div>

         {/* Achievement Unlock Preview (Gamification) */}
         <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group flex items-center gap-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-125 transition-transform" />
            <div className="text-4xl animate-bounce">🏆</div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Награда за модуль</div>
               <div className="text-lg font-black leading-tight">Высший Квант</div>
               <div className="mt-1 text-[9px] font-bold">+500 XP ожидается</div>
            </div>
         </div>
      </div>
    </div>
  )
}
