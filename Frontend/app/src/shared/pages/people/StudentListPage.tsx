import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'
import { Modal } from '../../ui/Modal'

type Row = {
  id: string
  name: string
  className: string
  section: string
  parent: string
  phone: string
  status: boolean
}

const data: Row[] = [
  { id: 'STU001', name: 'Александр Иванов', className: '8', section: 'А', parent: 'Иванов А.П.', phone: '+7 777 111 22 33', status: true },
  { id: 'STU002', name: 'Мария Петрова', className: '8', section: 'А', parent: 'Петрова И.С.', phone: '+7 777 222 33 44', status: true },
  { id: 'STU003', name: 'Дмитрий Сидоров', className: '8', section: 'Б', parent: 'Сидоров К.М.', phone: '+7 777 333 44 55', status: true },
  { id: 'STU004', name: 'Анна Козлова', className: '9', section: 'А', parent: 'Козлова Н.А.', phone: '+7 777 444 55 66', status: true },
  { id: 'STU005', name: 'Сергей Морозов', className: '9', section: 'Б', parent: 'Морозов Д.С.', phone: '+7 777 555 66 77', status: false },
  { id: 'STU006', name: 'Екатерина Новикова', className: '10', section: 'А', parent: 'Новикова П.Р.', phone: '+7 777 666 77 88', status: true },
  { id: 'STU007', name: 'Андрей Орлов', className: '10', section: 'А', parent: 'Орлова В.А.', phone: '+7 777 777 88 99', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Имя ученика',
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 grid place-items-center text-[11px] font-black flex-shrink-0 group-hover:scale-110 transition-transform">
          {r.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <Link to={`/students/${r.id}`} className="font-bold text-slate-900 tracking-tight leading-none mb-1 hover:text-primary transition-colors">
            {r.name}
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.phone}</span>
        </div>
      </div>
    ),
  },
  { 
    key: 'className', 
    label: 'Класс', 
    align: 'center',
    render: (r) => (
      <div className="flex flex-col items-center">
        <span className="font-black text-slate-800 text-sm">{r.className}</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">класс</span>
      </div>
    )
  },
  { 
    key: 'section', 
    label: 'Секция', 
    align: 'center',
    render: (r) => (
      <span className="h-7 w-7 rounded-lg bg-primary/5 text-primary text-xs font-black flex items-center justify-center border border-primary/10">
        {r.section}
      </span>
    )
  },
  { 
    key: 'parent', 
    label: 'Родитель',
    render: (r) => (
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-700">{r.parent}</span>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Активен" inactiveLabel="Исключен" />,
  },
]

export function StudentListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ученики"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Люди' },
          { label: 'Ученики' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить ученика" onClick={() => setIsModalOpen(true)} />
          </div>
        }
      />
      <DataTable
        title="Список учеников"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'className', 'section', 'parent'] as never[]}
        rowKey="id"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Добавить нового ученика"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ФИО Ученика</label>
            <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Напр. Александр Иванов" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Класс</label>
              <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
                <option>8 А</option>
                <option>8 Б</option>
                <option>9 А</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ID</label>
              <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" placeholder="STU008" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email родителя</label>
            <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" placeholder="email@example.com" />
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
