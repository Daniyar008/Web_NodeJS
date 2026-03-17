import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  type: 'Обязательный' | 'Факультативный' | 'Элективный'
  status: boolean
}

const data: Row[] = [
  { id: 'SUB001', name: 'Математика', type: 'Обязательный', status: true },
  { id: 'SUB002', name: 'Физика', type: 'Обязательный', status: true },
  { id: 'SUB003', name: 'Химия', type: 'Обязательный', status: true },
  { id: 'SUB004', name: 'Биология', type: 'Обязательный', status: true },
  { id: 'SUB005', name: 'История', type: 'Обязательный', status: true },
  { id: 'SUB011', name: 'Рисование', type: 'Факультативный', status: true },
  { id: 'SUB014', name: 'Программирование', type: 'Элективный', status: false },
]

const typeColors: Record<string, string> = {
  'Обязательный': 'bg-blue-50 text-blue-700',
  'Факультативный': 'bg-amber-50 text-amber-700',
  'Элективный': 'bg-purple-50 text-purple-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'name', label: 'Название предмета' },
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
    render: (r) => <StatusBadge status={r.status} activeLabel="Активен" inactiveLabel="Неактивен" />,
  },
]

export function SubjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Предметы"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Предметы' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить предмет" />
          </div>
        }
      />
      <DataTable
        title="Список предметов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'type']}
        rowKey="id"
      />
    </div>
  )
}
