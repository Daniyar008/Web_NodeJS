import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  section: string
  students: number
  subjects: number
  status: boolean
}

const data: Row[] = [
  { id: 'C138038', className: '1', section: 'А', students: 30, subjects: 3, status: true },
  { id: 'C138037', className: '1', section: 'Б', students: 25, subjects: 3, status: true },
  { id: 'C138036', className: '2', section: 'А', students: 40, subjects: 3, status: true },
  { id: 'C138035', className: '2', section: 'Б', students: 35, subjects: 3, status: true },
  { id: 'C138034', className: '2', section: 'В', students: 25, subjects: 3, status: false },
  { id: 'C138033', className: '3', section: 'А', students: 30, subjects: 3, status: true },
  { id: 'C138032', className: '3', section: 'Б', students: 25, subjects: 5, status: true },
  { id: 'C138031', className: '4', section: 'А', students: 20, subjects: 5, status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Класс', align: 'center' },
  { key: 'section', label: 'Секция', align: 'center' },
  { key: 'students', label: 'Кол-во учеников', align: 'center' },
  { 
    key: 'subjects', 
    label: 'Кол-во предметов', 
    align: 'center',
    render: (r) => String(r.subjects).padStart(2, '0')
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Активен" inactiveLabel="Неактивен" />,
  },
]

export function ClassListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Классы"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Классы' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить класс" />
          </div>
        }
      />
      <DataTable
        title="Список классов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'section']}
        rowKey="id"
      />
    </div>
  )
}

