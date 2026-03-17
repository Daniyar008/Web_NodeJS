import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'
import { Modal } from '../../ui/Modal'

const STUDENTS = [
  { id: 'ST001', name: 'Александр Иванов', marks: [5, 4, 5, 5, 4, 5], avg: 4.5 },
  { id: 'ST002', name: 'Мария Петрова', marks: [4, 4, 3, 5, 4, 4], avg: 4.0 },
  { id: 'ST003', name: 'Дмитрий Сидоров', marks: [3, 3, 4, 3, 4, 3], avg: 3.3 },
  { id: 'ST004', name: 'Анна Кузнецова', marks: [5, 5, 5, 5, 5, 5], avg: 5.0 },
  { id: 'ST005', name: 'Сергей Морозов', marks: [4, 3, 4, 4, 3, 4], avg: 3.7 },
]

const DATES = ['01.03', '05.03', '10.03', '15.03', '20.03', '25.03']

export function GradebookPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState('8 А')
  const [selectedSubject, setSelectedSubject] = useState('Математика')

  const getMarkColor = (mark: number) => {
    switch (mark) {
      case 5: return 'bg-emerald-500 text-white'
      case 4: return 'bg-blue-500 text-white'
      case 3: return 'bg-amber-500 text-white'
      case 2: return 'bg-rose-500 text-white'
      default: return 'bg-slate-100 text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Журнал оценок"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Журнал оценок' }
        ]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Выставить оценку
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Класс</span>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option>8 А</option>
            <option>8 Б</option>
            <option>9 А</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Предмет</span>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option>Математика</option>
            <option>Физика</option>
            <option>История</option>
            <option>Русский язык</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Период</span>
          <select className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
            <option>3 четверть</option>
            <option>4 четверть</option>
            <option>Весь год</option>
          </select>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50/50 z-10">Ученик</th>
                {DATES.map(date => (
                  <th key={date} className="px-3 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{date}</th>
                ))}
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-100/30">Ср. балл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 group-hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                      <span className="text-sm font-bold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  {student.marks.map((mark, idx) => (
                    <td key={idx} className="px-3 py-4 text-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto text-xs font-black shadow-sm ${getMarkColor(mark)}`}>
                        {mark}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center bg-slate-100/10">
                    <span className="text-sm font-black text-slate-900">{student.avg.toFixed(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Выставить оценку"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ученик</label>
            <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none">
              {STUDENTS.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Предмет</label>
              <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-400 outline-none" value={selectedSubject} readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Тип работы</label>
              <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none">
                <option>Самостоятельная</option>
                <option>Контрольная</option>
                <option>ДЗ</option>
                <option>Экзамен</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Оценка</label>
            <div className="flex gap-3">
              {[2, 3, 4, 5].map(num => (
                <button 
                  key={num}
                  type="button"
                  className="flex-1 h-12 rounded-2xl border border-slate-100 text-base font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex gap-3">
             <button 
               type="button"
               onClick={() => setIsModalOpen(false)}
               className="flex-1 h-12 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all"
             >
               Отмена
             </button>
             <button 
               type="submit"
               className="flex-1 h-12 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
             >
               Сохранить
             </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
