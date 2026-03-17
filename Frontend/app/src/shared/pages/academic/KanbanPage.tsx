import { PageHeader } from '../../ui/PageHeader'
import { useState } from 'react'

type Task = {
  id: string
  title: string
  subject: string
  priority: 'High' | 'Medium' | 'Low'
}

type Column = {
  id: string
  title: string
  tasks: Task[]
}

const initialData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: '1', title: 'Prepare Math presentation', subject: 'Mathematics', priority: 'High' },
      { id: '2', title: 'Read Chapter 4 of Physics', subject: 'Physics', priority: 'Medium' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: '3', title: 'Python lab assignment', subject: 'CS', priority: 'High' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: '4', title: 'History essay submission', subject: 'History', priority: 'Low' },
    ],
  },
]

export function KanbanPage() {
  const [columns] = useState<Column[]>(initialData)

  return (
    <div className="h-full flex flex-col space-y-6">
      <PageHeader
        title="My Tasks"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Tasks' },
        ]}
        actions={
          <button className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primaryDark transition shadow-lg shadow-primary/20">
            Create Task
          </button>
        }
      />

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start scrollbar-hide">
        {columns.map((column) => (
          <div key={column.id} className="w-80 flex-shrink-0 flex flex-col max-h-full">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{column.title}</h3>
                <span className="w-5 h-5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 flex items-center justify-center">
                  {column.tasks.length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-100/50 p-3 rounded-[32px] space-y-4 min-h-[150px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      task.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
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
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        {task.subject}
                     </span>
                     <div className="flex -space-x-2">
                        {[1, 2].map(i => (
                           <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                        ))}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="w-80 flex-shrink-0">
           <button className="w-full py-4 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-primary/40 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group bg-slate-50/30">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              Add New Column
           </button>
        </div>
      </div>
    </div>
  )
}
