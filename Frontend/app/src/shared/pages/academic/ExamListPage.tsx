import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  examName: string
  examDate: string
  startTime: string
  endTime: string
}

const data: Row[] = [
  { id: 'E140523', examName: 'Weekly Test', examDate: '13 May 2024', startTime: '09:30 AM', endTime: '10:45 AM' },
  { id: 'E140522', examName: 'Monthly Test', examDate: '27 May 2024', startTime: '09:30 AM', endTime: '11:00 AM' },
  { id: 'E140521', examName: 'Chapter Test', examDate: '05 Jun 2024', startTime: '09:30 AM', endTime: '10:30 AM' },
  { id: 'E140520', examName: 'Unit Test', examDate: '15 Jun 2024', startTime: '10:30 AM', endTime: '11:30 AM' },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'examName', label: 'Exam Name', render: (r) => <span className="font-bold text-slate-900">{r.examName}</span> },
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
]

export function ExamListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Exams' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Exam" />
          </div>
        }
      />
      <DataTable
        title="Exams List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'examName', 'examDate'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
