import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  section: string
  subject: string
  teacher: string
  day: string
  startTime: string
  endTime: string
}

const data: Row[] = [
  { id: 'CR001', className: 'VIII', section: 'A', subject: 'Mathematics', teacher: 'Ivanov A.V.', day: 'Monday', startTime: '09:00', endTime: '09:45' },
  { id: 'CR002', className: 'VIII', section: 'A', subject: 'Physics', teacher: 'Petrov V.I.', day: 'Monday', startTime: '10:00', endTime: '10:45' },
  { id: 'CR003', className: 'VIII', section: 'A', subject: 'Chemistry', teacher: 'Sidorov K.M.', day: 'Tuesday', startTime: '09:00', endTime: '09:45' },
  { id: 'CR004', className: 'VIII', section: 'B', subject: 'History', teacher: 'Morozov D.S.', day: 'Tuesday', startTime: '10:00', endTime: '10:45' },
]

const dayColors: Record<string, string> = {
  Monday: 'bg-blue-50 text-blue-700',
  Tuesday: 'bg-purple-50 text-purple-700',
  Wednesday: 'bg-teal-50 text-teal-700',
  Thursday: 'bg-amber-50 text-amber-700',
  Friday: 'bg-rose-50 text-rose-700',
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
    key: 'day',
    label: 'Day',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${dayColors[r.day] ?? 'bg-gray-50 text-gray-700'}`}>
        {r.day}
      </span>
    ),
  },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
]

export function ClassRoutinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Routine"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Class Routine' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Routine" />
          </div>
        }
      />
      <DataTable
        title="Routine List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'subject', 'teacher', 'day'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
