import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  subject: string
  examDate: string
  startTime: string
  endTime: string
  duration: string
  roomNo: string
  maxMarks: number
  minMarks: number
}

const data: Row[] = [
  { id: 'ES001', subject: 'English', examDate: '13 May 2024', startTime: '09:30 AM', endTime: '10:45 AM', duration: '3 hrs', roomNo: '101', maxMarks: 100, minMarks: 35 },
  { id: 'ES002', subject: 'Spanish', examDate: '14 May 2024', startTime: '09:30 AM', endTime: '10:45 AM', duration: '3 hrs', roomNo: '104', maxMarks: 100, minMarks: 35 },
  { id: 'ES003', subject: 'Physics', examDate: '15 May 2024', startTime: '09:30 AM', endTime: '10:45 AM', duration: '3 hrs', roomNo: '103', maxMarks: 100, minMarks: 35 },
  { id: 'ES004', subject: 'Chemistry', examDate: '16 May 2024', startTime: '09:30 AM', endTime: '10:45 AM', duration: '3 hrs', roomNo: '105', maxMarks: 100, minMarks: 35 },
]

const columns: Column<Row>[] = [
  { key: 'subject', label: 'Subject', render: (r) => <span className="font-bold text-slate-900">{r.subject}</span> },
  { key: 'examDate', label: 'Exam Date' },
  {
    key: 'startTime',
    label: 'Start Time',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">{r.startTime}</span>
    ),
  },
  {
    key: 'endTime',
    label: 'End Time',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold">{r.endTime}</span>
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">{r.duration}</span>
    ),
  },
  { key: 'roomNo', label: 'Room', align: 'center' },
  {
    key: 'maxMarks',
    label: 'Max Marks',
    align: 'center',
    render: (r) => <span className="font-bold text-slate-700">{r.maxMarks}</span>,
  },
  {
    key: 'minMarks',
    label: 'Min Marks',
    align: 'center',
    render: (r) => <span className="font-bold text-rose-600">{r.minMarks}</span>,
  },
]

export function ExamSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Schedule"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Exam Schedule' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Schedule" />
          </div>
        }
      />
      <DataTable
        title="Schedule List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['subject', 'examDate', 'roomNo'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
