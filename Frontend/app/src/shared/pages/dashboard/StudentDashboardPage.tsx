import { Link } from 'react-router-dom'

export function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header with Greeting & Gamification Overall */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="space-y-2 text-center md:text-left z-10">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">С возвращением, Александр! 👋</h1>
          <p className="text-slate-500 font-medium">Сегодня отличный день, чтобы изучить что-то новое.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 z-10">
          {/* Level Progress */}
          <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20 rotate-3">
                15
             </div>
             <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Уровень</span>
                   <span className="text-[10px] font-black text-slate-900">450 / 1000 XP</span>
                </div>
                <div className="w-40 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-1/2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                </div>
             </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[32px] border border-slate-100 px-8 shadow-sm group">
             <div className="text-3xl animate-bounce group-hover:scale-125 transition-transform">🔥</div>
             <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Стрик</div>
                <div className="text-xl font-black text-slate-900 leading-none">7 дней</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schedule & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks (Trello-style preview) */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Мои задачи</h3>
               <Link to="/kanban" className="h-8 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center">
                 Все задачи
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { title: 'Решить уравнения', subject: 'Математика', time: 'Сегодня 18:00', priority: 'High' },
                 { title: 'Написать эссе', subject: 'Литература', time: 'Завтра 12:00', priority: 'Medium' },
               ].map((task, idx) => (
                 <div key={idx} className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${task.priority === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                          {task.priority === 'High' ? 'Срочно' : 'Важно'}
                       </span>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base relative z-10">{task.title}</h4>
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between relative z-10">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">{task.subject}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.time}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Continue Learning Course Hero */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 px-2">Продолжить обучение</h3>
            <div className="p-8 rounded-[40px] bg-[#0f172a] text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 blur-[100px] -mr-40 -mt-40 rounded-full group-hover:bg-primary/40 transition-all duration-700" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -ml-32 -mb-32 rounded-full" />
               
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-6">
                    <div>
                       <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 space-x-2">
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded-lg">Курс</span>
                          <span className="opacity-60">•</span>
                          <span>Глава 3</span>
                       </div>
                       <h4 className="text-3xl font-black text-white leading-tight">Основы квантовой физики и механики</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
                          <span>Прогресс</span>
                          <span className="text-white">68%</span>
                       </div>
                       <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-primary w-[68%] rounded-full shadow-[0_0_25px_rgba(99,102,241,0.6)] animate-pulse" />
                       </div>
                    </div>
                    <button className="h-14 px-10 bg-white text-slate-900 text-sm font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20 group-hover:scale-105 active:scale-95">
                      Перейти к уроку 12
                    </button>
                  </div>
                  <div className="w-full md:w-56 aspect-[3/4] bg-slate-800 rounded-3xl border border-white/10 shadow-inner flex items-center justify-center relative group-hover:rotate-2 transition-transform">
                     <svg className="w-16 h-16 text-slate-700 group-hover:text-primary/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent rounded-3xl" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard & Stats */}
        <div className="space-y-6">
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm shadow-indigo-100/20">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
                 <span className="p-2 bg-slate-50 rounded-xl">🏆</span>
                 Рейтинг класса
              </h3>
              <div className="space-y-3">
                 {[
                   { name: 'Анна С.', rank: 1, xp: '2,450', avatar: 'bg-amber-100 text-amber-600', medal: '🥇' },
                   { name: 'Петр В.', rank: 2, xp: '2,300', avatar: 'bg-slate-100 text-slate-500', medal: '🥈' },
                   { name: 'Вы', rank: 3, xp: '2,150', avatar: 'bg-primary text-white shadow-lg shadow-primary/30', medal: '🥉', active: true },
                   { name: 'Марина К.', rank: 4, xp: '1,900', avatar: 'bg-slate-50 text-slate-300' },
                   { name: 'Артем Д.', rank: 5, xp: '1,850', avatar: 'bg-slate-50 text-slate-300' },
                 ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${item.active ? 'bg-primary shadow-xl shadow-primary/20 border-primary cursor-default' : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl ${item.avatar} flex items-center justify-center font-black text-sm relative`}>
                             {item.rank}
                             {item.active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                          </div>
                          <div>
                             <div className={`text-sm font-black ${item.active ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                             <div className={`text-[10px] font-bold uppercase tracking-widest ${item.active ? 'text-white/60' : 'text-slate-400'}`}>{item.xp} XP</div>
                          </div>
                       </div>
                       <div className="text-xl">{item.medal}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Call to action (Tournament) */}
           <div className="bg-gradient-to-br from-primary to-[#4338CA] rounded-[40px] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all" />
              <h3 className="text-2xl font-black mb-4 relative z-10">Турнир осени</h3>
              <p className="text-sm font-medium opacity-80 mb-8 leading-relaxed relative z-10">
                 Участвуй в глобальном турнире и принеси победу своей школе! Призовой фонд 100 000 XP.
              </p>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="opacity-70">Осталось времени</span>
                    <span>4 дня 12ч</span>
                 </div>
                 <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                 </div>
              </div>
              <button className="w-full h-14 bg-white text-primary text-sm font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10 mt-8 relative z-10 active:scale-95">
                Вступить в бой
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
