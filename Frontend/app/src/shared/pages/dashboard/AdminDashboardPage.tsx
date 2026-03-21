
function StatCard({
  label,
  value,
  chip,
}: {
  label: string
  value: string
  chip?: { text: string; tone: 'green' | 'amber' | 'red' }
}) {
  const tone =
    chip?.tone === 'green'
      ? 'bg-emerald-50 text-emerald-600'
      : chip?.tone === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : chip?.tone === 'red'
          ? 'bg-rose-50 text-rose-600'
          : 'bg-slate-50 text-slate-600'

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
        </div>
        {chip ? (
          <div className={`px-2 py-1 rounded-full text-[11px] font-semibold ${tone}`}>
            {chip.text}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
        <div>
          <div className="text-xs text-slate-500 font-medium">Панель управления / Дашборд</div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">С возвращением, г-н Геральд <span className="text-xl">👋</span></h2>
          <div className="text-xs text-slate-400 mt-1">Хорошего рабочего дня</div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
           <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           Учебный год : <span className="font-bold text-slate-900">2024 / 2025</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Всего студентов" value="3654" chip={{ text: '1.2%', tone: 'red' }} />
        <StatCard label="Всего учителей" value="284" chip={{ text: '1.2%', tone: 'green' }} />
        <StatCard label="Всего сотрудников" value="162" chip={{ text: '1.2%', tone: 'amber' }} />
        <StatCard label="Всего предметов" value="82" chip={{ text: '1.2%', tone: 'green' }} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fees Collection Chart */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold text-slate-900">Сбор оплаты</div>
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium">Последние 6 кварталов</div>
            </div>
            <div className="h-80 bg-slate-50/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
              <div className="text-slate-400 text-sm font-medium">[Заглушка графика оплаты]</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Schedules */}
             <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 text-slate-900 font-bold">
               Расписание
               <div className="mt-4 h-48 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">[Заглушка календаря]</div>
             </div>
             {/* Attendance Donut */}
             <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 text-slate-900 font-bold">
               Посещаемость
               <div className="mt-4 aspect-square max-w-[240px] mx-auto bg-slate-50/50 rounded-full border-8 border-primary/10 flex items-center justify-center text-xs text-slate-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">3610</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Присутствуют</div>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
           {/* Leave Requests */}
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
             <div className="flex items-center justify-between mb-6">
               <div className="text-lg font-bold text-slate-900">Запросы на отгул</div>
               <div className="text-xs text-slate-500 font-semibold cursor-pointer">Эта неделя</div>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'Джеймс', meta: 'Учитель физики', status: 'pending' },
                  { name: 'Хендрита', meta: 'Учитель математики', status: 'approved' }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-200" />
                         <div>
                            <div className="text-sm font-bold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{item.meta}</div>
                         </div>
                      </div>
                      <div className="flex gap-1.5">
                         <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white grid place-items-center shadow-sm cursor-pointer hover:opacity-90">✓</div>
                         <div className="w-6 h-6 rounded-lg bg-rose-500 text-white grid place-items-center shadow-sm cursor-pointer hover:opacity-90">✕</div>
                      </div>
                   </div>
                ))}
             </div>
           </div>

           {/* Quick Links */}
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
              <div className="text-lg font-bold text-slate-900 mb-6">Быстрые ссылки</div>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { label: 'Календарь', icon: '📅' },
                   { label: 'События', icon: '🔔' },
                   { label: 'Посещаемость', icon: '📝' },
                   { label: 'Экзамены', icon: '✍️' },
                   { label: 'Отчеты', icon: '📊' },
                   { label: 'Зарплата', icon: '💰' }
                 ].map(link => (
                    <div key={link.label} className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                       <div className="text-xl">{link.icon}</div>
                       <div className="text-[10px] font-bold text-slate-600 text-center px-1">{link.label}</div>
                    </div>
                 ))}
              </div>
           </div>

            {/* Notice Board */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold text-slate-900">Доска объявлений</div>
                <div className="text-xs text-primary font-bold">Показать все</div>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'Инструкции по новому учебному плану', date: '11 Мар 2024' },
                  { title: 'Расписание ежегодных спортивных соревнований', date: '10 Мар 2024' },
                  { title: 'График экзаменов за второй семестр', date: '08 Мар 2024' }
                ].map((notice, i) => (
                  <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-primary/20">
                    <div className="text-sm font-bold text-slate-900">{notice.title}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-1">{notice.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
