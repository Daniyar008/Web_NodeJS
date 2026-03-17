import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  section: string
  className: string
  status: boolean
}

const data: Row[] = [
  { id: 'S001', section: 'A', className: 'I', status: true },
  { id: 'S002', section: 'B', className: 'I', status: true },
  { id: 'S003', section: 'A', className: 'II', status: true },
  { id: 'S004', section: 'B', className: 'II', status: false },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'section', label: 'Section', align: 'center' },
  { key: 'className', label: 'Class', align: 'center' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Active" inactiveLabel="Inactive" />,
  },
]

export function SectionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Sections' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Section" />
          </div>
        }
      />
      <DataTable
        title="Sections List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'section', 'className'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
