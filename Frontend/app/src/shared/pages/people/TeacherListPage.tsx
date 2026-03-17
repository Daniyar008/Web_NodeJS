import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  subject: string
  qualification: string
  phone: string
  experience: string
  status: boolean
}

const data: Row[] = [
  { id: 'TCH001', name: 'Alexander Ivanov', subject: 'Mathematics', qualification: 'M.Ed.', phone: '+7 777 111 22 33', experience: '12 years', status: true },
  { id: 'TCH002', name: 'Vladimir Petrov', subject: 'Physics', qualification: 'M.Ed.', phone: '+7 777 222 33 44', experience: '8 years', status: true },
  { id: 'TCH003', name: 'Konstantin Sidorov', subject: 'Chemistry', qualification: 'Ph.D.', phone: '+7 777 333 44 55', experience: '15 years', status: true },
  { id: 'TCH004', name: 'Natalia Kozlova', subject: 'Biology', qualification: 'M.Bio.', phone: '+7 777 444 55 66', experience: '6 years', status: false },
  { id: 'TCH005', name: 'Dmitry Morozov', subject: 'History', qualification: 'M.Hist.', phone: '+7 777 555 66 77', experience: '10 years', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Teacher Name',
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-violet-50 border border-violet-100 text-violet-500 grid place-items-center text-xs font-bold flex-shrink-0">
          {r.name.charAt(0)}
        </div>
        <span className="font-bold text-slate-900">{r.name}</span>
      </div>
    ),
  },
  { key: 'subject', label: 'Subject' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'experience', label: 'Experience' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Active" inactiveLabel="Inactive" />,
  },
]

export function TeacherListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'People' },
          { label: 'Teachers' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Teacher" />
          </div>
        }
      />
      <DataTable
        title="Teachers List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'subject', 'qualification'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
