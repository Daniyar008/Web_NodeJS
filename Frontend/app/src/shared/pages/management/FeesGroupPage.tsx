import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  feesGroup: string
  description: string
  status: boolean
}

const data: Row[] = [
  { id: 'FG80482', feesGroup: 'Tuition Fees', description: 'Monthly school fee for education', status: true },
  { id: 'FG80481', feesGroup: 'Transportation', description: 'School bus service monthly fee', status: true },
  { id: 'FG80480', feesGroup: 'Hostel Fees', description: 'Accommodation and food charges', status: true },
  { id: 'FG80479', feesGroup: 'Sports Club', description: 'Annual membership for sports club', status: true },
  { id: 'FG80478', feesGroup: 'Library Fee', description: 'Annual maintenance fee for library', status: false },
  { id: 'FG80477', feesGroup: 'Exam Fees', description: 'Fee for internal semester exams', status: true },
  { id: 'FG80476', feesGroup: 'Admission Fee', description: 'One-time registration fee', status: true },
  { id: 'FG80475', feesGroup: 'Development Fund', description: 'Welfare fund for infrastructure', status: false },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] tracking-tight">{r.id}</span>,
  },
  { key: 'feesGroup', label: 'Fees Group' },
  {
    key: 'description',
    label: 'Description',
    render: (r) => <span className="text-slate-500 text-xs font-medium">{r.description}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export function FeesGroupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees Group"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Management' },
          { label: 'Fees Group' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="New Group" />
          </div>
        }
      />
      <DataTable
        title="Fees Group List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'feesGroup']}
        rowKey="id"
      />
    </div>
  )
}
