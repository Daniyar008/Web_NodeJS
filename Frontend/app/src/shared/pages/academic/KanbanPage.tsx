import { PageHeader } from '../../ui/PageHeader'
import { useState } from 'react'
import { Modal } from '../../ui/Modal'

type Task = {
  id: string
  title: string
  subject: string
  priority: 'Срочно' | 'Важно' | 'Низкий'
  deadline: string
}

type Column = {
  id: string
  title: string
  tasks: Task[]
}

const initialData: Column[] = [
  {
    id: 'todo',
    title: 'Нужно сделать',
    tasks: [
      { id: '1', title: 'Подготовить презентацию по математике', subject: 'Математика', priority: 'Срочно', deadline: 'Сегодня 18:00' },
      { id: '2', title: 'Прочитать 4 главу по физике', subject: 'Физика', priority: 'Важно', deadline: 'Завтра 12:00' },
    ],
  },
  {
    id: 'in-progress',
    title: 'В процессе',
    tasks: [
      { id: '3', title: 'Лабораторная работа по Python', subject: 'Информатика', priority: 'Срочно', deadline: '18.03.2024' },
    ],
  },
  {
    id: 'done',
    title: 'Готово',
    tasks: [
      { id: '4', title: 'Эссе по истории', subject: 'История', priority: 'Низкий', deadline: 'Вчера' },
    ],
  },
]

export function KanbanPage() {
  const [columns] = useState<Column[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="h-full flex flex-col space-y-6">
      <PageHeader
        title="Мои задачи"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Задачи' },
        ]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primaryDark transition shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Создать задачу
          </button>
        }
      />

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start scrollbar-hide">
        {columns.map((column) => (
          <div key={column.id} className="w-80 flex-shrink-0 flex flex-col max-h-full">
            <div className="flex items-center justify-between px-4 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{column.title}</h3>
                <span className="w-5 h-5 rounded-lg bg-slate-200 text-[10px] font-black text-slate-600 flex items-center justify-center">
                  {column.tasks.length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-100/50 p-2 rounded-[32px] space-y-3 min-h-[150px] border border-slate-100">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      task.priority === 'Срочно' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      task.priority === 'Важно' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 transition-all">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                    </button>
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors tracking-tight">
                    {task.title}
                  </h4>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                           {task.subject}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${task.deadline.includes('Сегодня') ? 'text-rose-500' : 'text-slate-400'}`}>
                           {task.deadline}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                           {[1, 2].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                           ))}
                           <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white text-[8px] flex items-center justify-center font-bold text-slate-400">+1</div>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="w-80 flex-shrink-0">
           <button className="w-full py-8 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-primary/40 hover:text-primary transition-all flex flex-col items-center justify-center gap-3 group bg-slate-50/10">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              Добавить колонку
           </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Создать новую задачу">
         <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Название задачи</label>
               <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Напр. Решить уравнения" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Предмет</label>
                  <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none">
                     <option>Математика</option>
                     <option>Физика</option>
                     <option>Информатика</option>
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Дедлайн</label>
                  <input type="date" className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Приоритет</label>
               <div className="flex gap-3">
                  {['Срочно', 'Важно', 'Низкий'].map(p => (
                     <button key={p} type="button" className={`flex-1 h-11 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${p === 'Важно' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                        {p}
                     </button>
                  ))}
               </div>
            </div>
            <div className="pt-4 flex gap-3">
               <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50">Отмена</button>
               <button type="submit" className="flex-1 h-12 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90">Создать</button>
            </div>
         </form>
      </Modal>
    </div>
  )
}
