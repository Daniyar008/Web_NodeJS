import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  subject: string
  title: string
  assignedDate: string
  dueDate: string
  status: 'Active' | 'Submitted' | 'Overdue'
}

const data: Row[] = [
  { id: 'HW001', className: 'VIII A', subject: 'Mathematics', title: 'Solve equations §5', assignedDate: '13 May 2024', dueDate: '15 May 2024', status: 'Active' },
  { id: 'HW002', className: 'VIII A', subject: 'Physics', title: 'Newton Laws', assignedDate: '14 May 2024', dueDate: '16 May 2024', status: 'Active' },
  { id: 'HW003', className: 'VIII B', subject: 'Chemistry', title: 'Reaction types', assignedDate: '12 May 2024', dueDate: '14 May 2024', status: 'Submitted' },
  { id: 'HW004', className: 'IX A', subject: 'History', title: 'Summary §12', assignedDate: '10 May 2024', dueDate: '13 May 2024', status: 'Overdue' },
]

const statusColors: Record<string, string> = {
  Active: 'bg-blue-50 text-blue-700',
  Submitted: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-rose-50 text-rose-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Class', align: 'center' },
  { key: 'subject', label: 'Subject' },
  { key: 'title', label: 'Task Title', render: (r) => <span className="font-bold text-slate-900">{r.title}</span> },
  { key: 'assignedDate', label: 'Assigned' },
  { key: 'dueDate', label: 'Due Date' },
  {
    key: 'status',
    label: 'Status',
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
        title="Homework"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Homework' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Homework" />
          </div>
        }
      />
      <DataTable
        title="Homework List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'subject', 'title', 'status'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
