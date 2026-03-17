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
  { id: 'C138038', className: 'I', section: 'A', students: 30, subjects: 3, status: true },
  { id: 'C138037', className: 'I', section: 'B', students: 25, subjects: 3, status: true },
  { id: 'C138036', className: 'II', section: 'A', students: 40, subjects: 3, status: true },
  { id: 'C138035', className: 'II', section: 'B', students: 35, subjects: 3, status: true },
  { id: 'C138034', className: 'II', section: 'C', students: 25, subjects: 3, status: false },
  { id: 'C138033', className: 'III', section: 'A', students: 30, subjects: 3, status: true },
  { id: 'C138032', className: 'III', section: 'B', students: 25, subjects: 5, status: true },
  { id: 'C138031', className: 'IV', section: 'A', students: 20, subjects: 5, status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Class', align: 'center' },
  { key: 'section', label: 'Section', align: 'center' },
  { key: 'students', label: 'Students Count', align: 'center' },
  { 
    key: 'subjects', 
    label: 'Subjects Count', 
    align: 'center',
    render: (r) => String(r.subjects).padStart(2, '0')
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Active" inactiveLabel="Inactive" />,
  },
]

export function ClassListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Classes' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Class" />
          </div>
        }
      />
      <DataTable
        title="Classes List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'section'] as never[]}
        rowKey="id"
      />
    </div>
  )
}

