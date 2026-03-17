import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'

const TEACHERS = [
  'Teresa', 'Daniel', 'Hellana', 'Erickson', 'Morgan', 'Aaron', 'Ralph', 'Jacquelin', 'Raul', 'Elizabeth'
]

const ATTENDANCE_TYPES = [
  { label: 'Присутствует', color: 'bg-emerald-500', value: 'P' },
  { label: 'Отсутствует', color: 'bg-rose-500', value: 'A' },
  { label: 'Опоздание', color: 'bg-sky-400', value: 'L' },
  { label: 'Пол дня', color: 'bg-slate-800', value: 'H' },
  { label: 'Выходной', color: 'bg-primary', value: 'F' },
]

export function AttendanceReportPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Teacher Report')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Отчет о посещаемости"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Отчеты' },
          { label: 'Отчет о посещаемости' }
        ]}
        actions={
          <div className="flex gap-2">
             <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
             <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
             </button>
             <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Экспорт
             </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-100 overflow-x-auto no-scrollbar pb-px">
         {[
           'Отчет о посещаемости', 'Типы посещаемости учащихся', 'Ежедневная посещаемость', 
           'По дням (Ученики)', 'По дням (Учителя)', 'Отчет по учителям', 
           'По дням (Персонал)', 'Отчет по персоналу'
         ].map((tabName) => (
           <button 
             key={tabName} 
             onClick={() => setActiveTab(tabName)}
             className={`pb-4 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tabName ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {tabName}
             {activeTab === tabName && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
           <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
                 15 May 2020 - 24 May 2024
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                 Фильтр
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                 Сортировка А-Я
              </button>
           </div>
           
           <div className="flex items-center gap-3">
              {ATTENDANCE_TYPES.map(type => (
                 <div key={type.label} className="flex items-center gap-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full ${type.color} border border-white shadow-sm`} />
                    <span className="text-[10px] font-bold text-slate-600">{type.label}</span>
                 </div>
              ))}
              <div className="relative ml-4">
                 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 <input 
                    className="h-10 w-48 rounded-xl bg-slate-50 border border-slate-100 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Учитель / Дата</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">%</th>
                  <th className="px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">П</th>
                  <th className="px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">О</th>
                  <th className="px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Н</th>
                  <th className="px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">ПД</th>
                  <th className="px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">В</th>
                  {Array.from({ length: 21 }).map((_, i) => (
                    <th key={i} className="px-1 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center w-8 text-center whitespace-pre-wrap">
                       {(i + 1).toString().padStart(2, '0')}{"\n"}<span className="text-[9px] opacity-70">{"ПВСРЧПСПВСРЧПСПВСРЧПС"[i]}</span>
                    </th>
                  ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {TEACHERS.map((name, idx) => (
                 <tr key={name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                          <span className="text-sm font-bold text-slate-900">{name}</span>
                       </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                       <div className={`inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white ${idx % 3 === 0 ? 'bg-emerald-500' : idx % 2 === 0 ? 'bg-primary' : 'bg-rose-500'}`}>
                          {90 - idx * 5}%
                       </div>
                    </td>
                    <td className="px-2 py-3 text-center text-xs font-bold text-slate-600">24</td>
                    <td className="px-2 py-3 text-center text-xs font-bold text-slate-600">0</td>
                    <td className="px-2 py-3 text-center text-xs font-bold text-slate-600">6</td>
                    <td className="px-2 py-3 text-center text-xs font-bold text-slate-600">0</td>
                    <td className="px-2 py-3 text-center text-xs font-bold text-slate-600">0</td>
                    {Array.from({ length: 21 }).map((_, i) => {
                       const status = idx % 2 === 0 ? (i % 7 === 0 ? 'bg-primary' : i % 5 === 0 ? 'bg-rose-500' : 'bg-emerald-500') : (i % 6 === 0 ? 'bg-sky-400' : 'bg-emerald-500')
                       return (
                        <td key={i} className="px-1 py-3 text-center">
                           <div className={`mx-auto w-2 h-4 rounded-full ${status} opacity-90 shadow-sm`} />
                        </td>
                       )
                    })}
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-end gap-2">
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400">Пред.</button>
             <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">1</button>
             <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500">2</button>
             <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400">След.</button>
           </div>
        </div>
      </div>
    </div>
  )
}
