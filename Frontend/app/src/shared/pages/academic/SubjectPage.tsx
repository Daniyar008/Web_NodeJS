import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  type: 'Mandatory' | 'Optional' | 'Elective'
  status: boolean
}

const data: Row[] = [
  { id: 'SUB001', name: 'Mathematics', type: 'Mandatory', status: true },
  { id: 'SUB002', name: 'Physics', type: 'Mandatory', status: true },
  { id: 'SUB003', name: 'Chemistry', type: 'Mandatory', status: true },
  { id: 'SUB004', name: 'Biology', type: 'Mandatory', status: true },
  { id: 'SUB005', name: 'History', type: 'Mandatory', status: true },
  { id: 'SUB011', name: 'Drawing', type: 'Optional', status: true },
  { id: 'SUB014', name: 'Programming', type: 'Elective', status: false },
]

const typeColors: Record<string, string> = {
  Mandatory: 'bg-blue-50 text-blue-700',
  Optional: 'bg-amber-50 text-amber-700',
  Elective: 'bg-purple-50 text-purple-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'name', label: 'Subject Name' },
  {
    key: 'type',
    label: 'Type',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${typeColors[r.type]}`}>
        {r.type}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Active" inactiveLabel="Inactive" />,
  },
]

export function SubjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Subjects' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Subject" />
          </div>
        }
      />
      <DataTable
        title="Subjects List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'type'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
