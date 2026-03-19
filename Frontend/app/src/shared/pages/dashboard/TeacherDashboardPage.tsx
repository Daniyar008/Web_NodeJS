import { PageHeader } from '../../ui/PageHeader'

const CLASSES = [
  { name: '8 "А" класс', subject: 'Математика', students: 24, progress: 78, homeworks: 5, color: 'bg-indigo-500' },
  { name: '8 "Б" класс', subject: 'Математика', students: 22, progress: 45, homeworks: 2, color: 'bg-emerald-500' },
  { name: '9 "В" класс', subject: 'Алгебра', students: 20, progress: 92, homeworks: 0, color: 'bg-rose-500' },
]

const SCHEDULE = [
  { time: '09:00 - 09:45', class: '8 "А"', subject: 'Математика', room: '302', status: 'Завершен' },
  { time: '10:00 - 10:45', class: '8 "Б"', subject: 'Математика', room: '302', status: 'В процессе' },
  { time: '11:00 - 11:45', class: '9 "В"', subject: 'Алгебра', room: '405', status: 'Ожидается' },
  { time: '12:00 - 12:45', class: '10 "А"', subject: 'Геометрия', room: '405', status: 'Ожидается' },
]

export function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Панель учителя"
        breadcrumbs={[{ label: 'Панель', to: '/' }, { label: 'Учитель' }]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
           <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-lg shadow-primary/20 rotate-3 z-10">
              📊
           </div>
           <div className="z-10">
              <div className="text-3xl font-black text-slate-900 tracking-tight">86%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Средняя успеваемость</div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
           <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-3xl shadow-lg shadow-rose-500/20 -rotate-3 z-10 text-white">
              📝
           </div>
           <div className="z-10">
              <div className="text-3xl font-black text-slate-900 tracking-tight">12</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Непроверенных работ</div>
           </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[40px] shadow-2xl flex items-center gap-6 relative overflow-hidden group text-white">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full -mr-12 -mt-12" />
           <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-3xl shadow-inner z-10">
              🎓
           </div>
           <div className="z-10">
              <div className="text-3xl font-black tracking-tight">64</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Всего учеников</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Classes & Homeworks */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Мои классы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {CLASSES.map((cls, idx) => (
                    <div key={idx} className="p-8 rounded-[36px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                       <div className={`absolute top-0 right-0 w-32 h-32 ${cls.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
                       <div className="flex items-center justify-between mb-6">
                          <h4 className="text-2xl font-black text-slate-900">{cls.name}</h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl border border-slate-100">{cls.students} учеников</span>
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                             <span className="text-slate-400">Прогресс плана</span>
                             <span className="text-slate-900">{cls.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                             <div className={`h-full ${cls.color} rounded-full`} style={{ width: `${cls.progress}%` }} />
                          </div>
                       </div>
                       <div className="mt-8 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                             <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">{cls.homeworks} работ на проверку</span>
                          </div>
                          <button className="h-10 px-6 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg">Открыть</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Course Management Preview */}
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Мои курсы</h3>
                 <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Все курсы →</button>
              </div>
              <div className="space-y-4">
                 {[
                   { title: 'Квантовая механика', modules: 12, lessons: 48, rating: 4.9 },
                   { title: 'Линейная алгебра', modules: 8, lessons: 32, rating: 4.8 },
                 ].map((course, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg transition-all group">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📘</div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-base">{course.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{course.modules} модулей • {course.lessons} уроков</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-center">
                             <div className="text-sm font-black text-slate-900">⭐ {course.rating}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Рейтинг</div>
                          </div>
                          <button className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                       </div>
                    </div>
                 ))}
                 <button className="w-full h-16 rounded-[28px] border-2 border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all group">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10">+</span>
                    Создать новый курс
                 </button>
              </div>
           </div>
        </div>

        {/* Right Column: Schedule & Tasks */}
        <div className="space-y-8">
           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Расписание на сегодня</h3>
              <div className="space-y-6">
                 {SCHEDULE.map((item, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
                       <div className={`absolute left-[-5px] top-0 w-2 h-2 rounded-full ${item.status === 'В процессе' ? 'bg-primary ring-4 ring-primary/10' : item.status === 'Завершен' ? 'bg-slate-300' : 'bg-white border-2 border-slate-200'}`} />
                       <div className="space-y-2">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                             <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${item.status === 'В процессе' ? 'bg-primary/10 text-primary' : item.status === 'Завершен' ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>{item.status}</span>
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-sm">{item.subject} • {item.class}</h4>
                             <p className="text-[10px] font-medium text-slate-500 mt-0.5">Кабинет {item.room}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full h-14 rounded-2xl bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest mt-8 hover:bg-slate-100 transition-all">Полное расписание</button>
           </div>

           {/* Quick Actions (Admin Side) */}
           <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black mb-6 relative z-10">Быстрые действия</h3>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Журнал', icon: '📝' },
                   { label: 'Отчеты', icon: '📈' },
                   { label: 'События', icon: '📅' },
                   { label: 'Помощь', icon: '💎' },
                 ].map((action, idx) => (
                    <button key={idx} className="p-4 rounded-3xl bg-white/10 border border-white/10 hover:bg-white hover:text-primary transition-all flex flex-col items-center gap-2">
                       <span className="text-xl">{action.icon}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
