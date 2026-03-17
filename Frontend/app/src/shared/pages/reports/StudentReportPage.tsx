import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'

const STUDENTS = [
  { id: 'ST001', name: 'Александр Иванов', class: '8 А', attendance: '95%', marks: '4.8', behavior: 'Отлично' },
  { id: 'ST002', name: 'Мария Петрова', class: '8 А', attendance: '92%', marks: '4.5', behavior: 'Хорошо' },
  { id: 'ST003', name: 'Дмитрий Сидоров', class: '8 А', attendance: '88%', marks: '3.9', behavior: 'Удовл.' },
  { id: 'ST004', name: 'Анна Кузнецова', class: '8 А', attendance: '98%', marks: '5.0', behavior: 'Отлично' },
  { id: 'ST005', name: 'Игорь Морозов', class: '8 А', attendance: '85%', marks: '3.5', behavior: 'Хорошо' },
]

export function StudentReportPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Отчет по ученикам"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Отчеты' },
          { label: 'Отчет по ученикам' }
        ]}
        actions={
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Скачать отчет
            </button>
          </div>
        }
      />

      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Класс</span>
          <select className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
            <option>8 А</option>
            <option>8 Б</option>
            <option>9 А</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Период</span>
          <select className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
            <option>Первая четверть</option>
            <option>Вторая четверть</option>
            <option>Весь год</option>
          </select>
        </div>
        <div className="flex-1" />
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            className="h-10 w-64 rounded-xl bg-slate-50 border border-slate-100 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Поиск ученика..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ФИО Ученика</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Класс</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Посещаемость</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Ср. Балл</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Поведение</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-primary">{student.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                      <span className="text-sm font-bold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">{student.class}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">{student.attendance}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">{student.marks}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">{student.behavior}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
