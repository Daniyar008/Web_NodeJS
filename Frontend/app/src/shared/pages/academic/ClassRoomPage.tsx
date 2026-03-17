import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  building: string
  capacity: number
  type: 'Класс' | 'Лаборатория' | 'Актовый зал'
  status: boolean
}

const data: Row[] = [
  { id: 'R101', name: 'Кабинет 101', building: 'Корпус А', capacity: 30, type: 'Класс', status: true },
  { id: 'R102', name: 'Кабинет 102', building: 'Корпус А', capacity: 25, type: 'Класс', status: true },
  { id: 'R201', name: 'Физ. лаборатория', building: 'Корпус Б', capacity: 20, type: 'Лаборатория', status: true },
  { id: 'R202', name: 'Хим. лаборатория', building: 'Корпус Б', capacity: 18, type: 'Лаборатория', status: false },
  { id: 'R301', name: 'Актовый зал 301', building: 'Корпус В', capacity: 80, type: 'Актовый зал', status: true },
]

const typeColors: Record<string, string> = {
  'Класс': 'bg-blue-50 text-blue-700',
  'Лаборатория': 'bg-emerald-50 text-emerald-700',
  'Актовый зал': 'bg-purple-50 text-purple-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'name', label: 'Название кабинета', render: (r) => <span className="font-bold text-slate-900">{r.name}</span> },
  { key: 'building', label: 'Корпус' },
  { key: 'capacity', label: 'Вместимость', align: 'center' },
  {
    key: 'type',
    label: 'Тип',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${typeColors[r.type]}`}>
        {r.type}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Доступен" inactiveLabel="Занят" />,
  },
]

export function ClassRoomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Кабинеты"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Кабинеты' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить кабинет" />
          </div>
        }
      />
      <DataTable
        title="Список кабинетов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'building', 'type']}
        rowKey="id"
      />
    </div>
  )
}

