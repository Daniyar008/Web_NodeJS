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
          <div className="text-xs text-slate-500 font-medium">Dashboard / Admin Dashboard</div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Welcome Back, Mr. Herald <span className="text-xl">👋</span></h2>
          <div className="text-xs text-slate-400 mt-1">Have a Good day at work</div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
           <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           Academic Year : <span className="font-bold text-slate-900">2024 / 2025</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value="3654" chip={{ text: '1.2%', tone: 'red' }} />
        <StatCard label="Total Teachers" value="284" chip={{ text: '1.2%', tone: 'green' }} />
        <StatCard label="Total Staff" value="162" chip={{ text: '1.2%', tone: 'amber' }} />
        <StatCard label="Total Subjects" value="82" chip={{ text: '1.2%', tone: 'green' }} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fees Collection Chart */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold text-slate-900">Fees Collection</div>
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium">Last 6 Quarter</div>
            </div>
            <div className="h-80 bg-slate-50/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
              <div className="text-slate-400 text-sm font-medium">[Fees Chart Placeholder]</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Schedules */}
             <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 text-slate-900 font-bold">
               Schedules
               <div className="mt-4 h-48 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">[Calendar Placeholder]</div>
             </div>
             {/* Attendance Donut */}
             <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 text-slate-900 font-bold">
               Attendance
               <div className="mt-4 aspect-square max-w-[240px] mx-auto bg-slate-50/50 rounded-full border-8 border-primary/10 flex items-center justify-center text-xs text-slate-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">3610</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Present</div>
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
               <div className="text-lg font-bold text-slate-900">Leave Requests</div>
               <div className="text-xs text-slate-500 font-semibold cursor-pointer">This Week</div>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'James', meta: 'Physics Teacher', status: 'pending' },
                  { name: 'Hendrita', meta: 'Maths Teacher', status: 'approved' }
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
              <div className="text-lg font-bold text-slate-900 mb-6">Quick Links</div>
              <div className="grid grid-cols-3 gap-3">
                 {['Calendar', 'Events', 'Attendance', 'Exams', 'Reports', 'Payroll'].map(link => (
                    <div key={link} className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                       <div className="w-10 h-10 rounded-full bg-white shadow-sm" />
                       <div className="text-[10px] font-bold text-slate-600">{link}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Notice Board */}
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
             <div className="flex items-center justify-between mb-6">
               <div className="text-lg font-bold text-slate-900">Notice Board</div>
               <div className="text-xs text-primary font-bold">View All</div>
             </div>
             <div className="space-y-6">
                {[
                  { title: 'New Syllabus Instructions', date: '11 Mar 2024' },
                  { title: 'World Environment Day Program...!!!', date: '21 Apr 2024' },
                  { title: 'Exam Preparation Notification!', date: '13 Mar 2024' }
                ].map((item, i) => (
                   <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                      <div className="text-xs font-bold text-slate-900 hover:text-primary cursor-pointer line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         {item.date}
                      </div>
                   </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

