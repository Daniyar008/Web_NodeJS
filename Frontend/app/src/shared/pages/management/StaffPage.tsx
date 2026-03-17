import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  role: string
  department: string
  joinDate: string
  status: boolean
}

const data: Row[] = [
  { id: 'STF201', name: 'Иван Иванов', role: 'Отдел кадров', department: 'Администрация', joinDate: '12 Янв 2022', status: true },
  { id: 'STF202', name: 'Сара Смит', role: 'Бухгалтер', department: 'Финансы', joinDate: '05 Мар 2023', status: true },
  { id: 'STF203', name: 'Роберт Уилсон', role: 'Библиотекарь', department: 'Библиотека', joinDate: '18 Июн 2021', status: true },
  { id: 'STF204', name: 'Мария Гарсия', role: 'Админ. ассистент', department: 'Администрация', joinDate: '22 Сен 2023', status: true },
  { id: 'STF205', name: 'Давид Ли', role: 'Начальник охраны', department: 'Операции', joinDate: '15 Ноя 2020', status: false },
  { id: 'STF206', name: 'Эмили Браун', role: 'IT-поддержка', department: 'Технологии', joinDate: '01 Фев 2024', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Имя сотрудника',
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-slate-500 font-bold text-xs">
          {r.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="font-bold text-slate-800 tracking-tight">{r.name}</span>
      </div>
    ),
  },
  { 
    key: 'role', 
    label: 'Должность',
    render: (r) => <span className="text-slate-600 font-semibold text-xs">{r.role}</span>
  },
  { 
    key: 'department', 
    label: 'Отдел',
    render: (r) => <span className="text-slate-500 text-xs">{r.department}</span>
  },
  { 
    key: 'joinDate', 
    label: 'Дата вступления',
    render: (r) => <span className="text-slate-400 text-xs font-medium tabular-nums">{r.joinDate}</span>
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Работает" inactiveLabel="В отпуске" />,
  },
]

export function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Управление персоналом"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Управление' },
          { label: 'Персонал' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить сотрудника" />
          </div>
        }
      />
      <DataTable
        title="Справочник персонала"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['name', 'role', 'department']}
        rowKey="id"
      />
    </div>
  )
}
