import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  section: string
  className: string
  status: boolean
}

const data: Row[] = [
  { id: 'S001', section: 'А', className: '1', status: true },
  { id: 'S002', section: 'Б', className: '1', status: true },
  { id: 'S003', section: 'А', className: '2', status: true },
  { id: 'S004', section: 'Б', className: '2', status: false },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'section', label: 'Секция', align: 'center' },
  { key: 'className', label: 'Класс', align: 'center' },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="Активна" inactiveLabel="Неактивна" />,
  },
]

export function SectionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Секции"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Секции' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить секцию" />
          </div>
        }
      />
      <DataTable
        title="Список секций"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'section', 'className']}
        rowKey="id"
      />
    </div>
  )
}
