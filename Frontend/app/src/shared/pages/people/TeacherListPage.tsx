import { Link } from 'react-router-dom'
import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  subject: string
  qualification: string
  phone: string
  experience: string
  status: boolean
}

const data: Row[] = [
  { id: 'TCH001', name: 'Александр Иванов', subject: 'Математика', qualification: 'Магистр', phone: '+7 777 111 22 33', experience: '12 лет', status: true },
  { id: 'TCH002', name: 'Владимир Петров', subject: 'Физика', qualification: 'Магистр', phone: '+7 777 222 33 44', experience: '8 лет', status: true },
  { id: 'TCH003', name: 'Константин Сидоров', subject: 'Химия', qualification: 'Доктор наук', phone: '+7 777 333 44 55', experience: '15 лет', status: true },
  { id: 'TCH004', name: 'Наталья Козлова', subject: 'Биология', qualification: 'Бакалавр', phone: '+7 777 444 55 66', experience: '6 лет', status: false },
  { id: 'TCH005', name: 'Дмитрий Морозов', subject: 'История', qualification: 'Магистр', phone: '+7 777 555 66 77', experience: '10 лет', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Имя учителя',
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-violet-50 border border-violet-100 text-violet-500 grid place-items-center text-[11px] font-black flex-shrink-0 group-hover:scale-110 transition-transform">
          {r.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <Link to={`/teachers/${r.id}`} className="font-bold text-slate-900 tracking-tight leading-none mb-1 hover:text-primary transition-colors">
            {r.name}
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.phone}</span>
        </div>
      </div>
    ),
  },
  { 
    key: 'subject', 
    label: 'Предмет',
    render: (r) => (
      <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-xl">{r.subject}</span>
    )
  },
  { key: 'qualification', label: 'Квалификация', render: (r) => <span className="text-xs text-slate-500">{r.qualification}</span> },
  { key: 'experience', label: 'Опыт', render: (r) => <span className="text-xs font-bold text-slate-700">{r.experience}</span> },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Активен" inactiveLabel="В отпуске" />,
  },
]

export function TeacherListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Учителя"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Люди' },
          { label: 'Учителя' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить учителя" />
          </div>
        }
      />
      <DataTable
        title="Список учителей"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'subject', 'qualification'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
