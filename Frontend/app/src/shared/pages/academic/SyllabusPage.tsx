import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  section: string
  subject: string
  teacher: string
  uploadStatus: 'Uploaded' | 'Pending' | 'Not Uploaded'
}

const data: Row[] = [
  { id: 'SYL001', className: 'VIII', section: 'A', subject: 'Mathematics', teacher: 'Ivanov A.V.', uploadStatus: 'Uploaded' },
  { id: 'SYL002', className: 'VIII', section: 'A', subject: 'Physics', teacher: 'Petrov V.I.', uploadStatus: 'Uploaded' },
  { id: 'SYL003', className: 'VIII', section: 'B', subject: 'Chemistry', teacher: 'Sidorov K.M.', uploadStatus: 'Pending' },
  { id: 'SYL004', className: 'IX', section: 'A', subject: 'Biology', teacher: 'Kozlova N.A.', uploadStatus: 'Uploaded' },
  { id: 'SYL005', className: 'IX', section: 'B', subject: 'History', teacher: 'Morozov D.S.', uploadStatus: 'Not Uploaded' },
]

const uploadColors: Record<string, string> = {
  Uploaded: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  'Not Uploaded': 'bg-rose-50 text-rose-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Class', align: 'center' },
  { key: 'section', label: 'Section', align: 'center' },
  { key: 'subject', label: 'Subject' },
  { key: 'teacher', label: 'Teacher' },
  {
    key: 'uploadStatus',
    label: 'Upload Status',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${uploadColors[r.uploadStatus]}`}>
        {r.uploadStatus}
      </span>
    ),
  },
]

export function SyllabusPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Syllabus' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Syllabus" />
          </div>
        }
      />
      <DataTable
        title="Syllabus List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'subject', 'teacher'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
