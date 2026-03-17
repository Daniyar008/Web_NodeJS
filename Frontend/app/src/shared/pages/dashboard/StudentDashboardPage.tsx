import { PageHeader } from '../../ui/PageHeader'

export function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Daniyar!"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full">Level 12</span>
              <span className="text-xs font-bold text-slate-400">850 / 1200 XP</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">Warrior Scholar</h3>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[70%] rounded-full shadow-[0_0_12px_rgba(93,115,231,0.4)]" />
            </div>
            <p className="mt-4 text-xs font-medium text-slate-500">350 XP until next rank</p>
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-[32px] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white text-sm">Daily Streak</span>
              <span className="text-orange-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 2.05.69 3.93 1.85 5.42l-1.6 3.73c-.14.33.15.68.51.61l4.13-.8c1.3.69 2.78 1.04 4.11 1.04 4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9zm0 16c-1.46 0-2.83-.44-4.01-1.2l-.24-.15-2.5.48.97-2.26-.18-.28C5.35 13.56 5 12.31 5 11c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7z"/></svg>
                15 Days
              </span>
            </div>
            <div className="mt-6 flex gap-1.5 flex-wrap">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${i < 5 ? 'bg-orange-400 text-white border-orange-300 shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                  {day}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Don't break your streak!</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 border border-amber-100 shadow-sm rotate-3 group-hover:rotate-0 transition-transform">
               <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
               </svg>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">42</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Achievements</div>
            <button className="mt-4 text-xs font-bold text-primary hover:underline transition-all">View Trophy Room →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Current Homework</h3>
                <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">VIEW ALL</button>
             </div>
             <div className="space-y-4">
                {[
                  { sub: 'Advanced Mathematics', task: 'Quadratic Equations Practice Set', due: 'Today, 4:00 PM', pts: '+50 XP', color: 'bg-indigo-50 text-indigo-600' },
                  { sub: 'World History', task: 'French Revolution Summary', due: 'Tomorrow', pts: '+30 XP', color: 'bg-orange-50 text-orange-600' },
                  { sub: 'Computer Science', task: 'Python Data Structures Lab', due: '20 Mar', pts: '+100 XP', color: 'bg-emerald-50 text-emerald-600' }
                ].map((hw, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className={`h-12 w-12 rounded-2xl ${hw.color} flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {hw.sub[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate tracking-tight">{hw.task}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{hw.sub} • Due {hw.due}</div>
                    </div>
                    <div className="text-xs font-black text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">{hw.pts}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Mini */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12" />
              <h3 className="text-lg font-bold text-slate-900 mb-6 relative z-10">Upcoming Exams</h3>
              <div className="space-y-6">
                 {[
                    { sub: 'Physics', date: 'March 22', time: '10:00 AM', color: 'border-rose-200' },
                    { sub: 'Organic Chemistry', date: 'March 25', time: '09:00 AM', color: 'border-amber-200' }
                 ].map((ex, i) => (
                    <div key={i} className={`pl-4 border-l-4 ${ex.color} relative`}>
                       <div className="text-sm font-bold text-slate-900">{ex.sub} Exam</div>
                       <div className="text-xs font-medium text-slate-500 mt-1">{ex.date} • {ex.time}</div>
                    </div>
                 ))}
              </div>
              <button className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all active:scale-[0.98]">
                 Exam Schedule
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
