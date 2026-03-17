import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  subject: string
  title: string
  assignedDate: string
  dueDate: string
  status: 'Активно' | 'Сдано' | 'Просрочено'
}

const data: Row[] = [
  { id: 'HW001', className: '8 А', subject: 'Математика', title: 'Решить уравнения §5', assignedDate: '13 мая 2024', dueDate: '15 мая 2024', status: 'Активно' },
  { id: 'HW002', className: '8 А', subject: 'Физика', title: 'Законы Ньютона', assignedDate: '14 мая 2024', dueDate: '16 мая 2024', status: 'Активно' },
  { id: 'HW003', className: '8 Б', subject: 'Химия', title: 'Типы реакций', assignedDate: '12 мая 2024', dueDate: '14 мая 2024', status: 'Сдано' },
  { id: 'HW004', className: '9 А', subject: 'История', title: 'Конспект §12', assignedDate: '10 мая 2024', dueDate: '13 мая 2024', status: 'Просрочено' },
]

const statusColors: Record<string, string> = {
  'Активно': 'bg-blue-50 text-blue-700',
  'Сдано': 'bg-emerald-50 text-emerald-700',
  'Просрочено': 'bg-rose-50 text-rose-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Класс', align: 'center' },
  { key: 'subject', label: 'Предмет' },
  { key: 'title', label: 'Задание', render: (r) => <span className="font-bold text-slate-900">{r.title}</span> },
  { key: 'assignedDate', label: 'Назначено' },
  { key: 'dueDate', label: 'Срок сдачи' },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColors[r.status]}`}>
        {r.status}
      </span>
    ),
  },
]

export function HomeWorkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Домашние задания"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Домашние задания' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить задание" />
          </div>
        }
      />
      <DataTable
        title="Список заданий"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'subject', 'title', 'status']}
        rowKey="id"
      />
    </div>
  )
}
