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
  { id: 'ES001', subject: 'Английский', examDate: '13 мая 2024', startTime: '09:30', endTime: '10:45', duration: '3 ч', roomNo: '101', maxMarks: 100, minMarks: 35 },
  { id: 'ES002', subject: 'Испанский', examDate: '14 мая 2024', startTime: '09:30', endTime: '10:45', duration: '3 ч', roomNo: '104', maxMarks: 100, minMarks: 35 },
  { id: 'ES003', subject: 'Физика', examDate: '15 мая 2024', startTime: '09:30', endTime: '10:45', duration: '3 ч', roomNo: '103', maxMarks: 100, minMarks: 35 },
  { id: 'ES004', subject: 'Химия', examDate: '16 мая 2024', startTime: '09:30', endTime: '10:45', duration: '3 ч', roomNo: '105', maxMarks: 100, minMarks: 35 },
]

const columns: Column<Row>[] = [
  { key: 'subject', label: 'Предмет', render: (r) => <span className="font-bold text-slate-900">{r.subject}</span> },
  { key: 'examDate', label: 'Дата экзамена' },
  {
    key: 'startTime',
    label: 'Начало',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">{r.startTime}</span>
    ),
  },
  {
    key: 'endTime',
    label: 'Конец',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold">{r.endTime}</span>
    ),
  },
  {
    key: 'duration',
    label: 'Длительность',
    render: (r) => (
      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">{r.duration}</span>
    ),
  },
  { key: 'roomNo', label: 'Кабинет', align: 'center' },
  {
    key: 'maxMarks',
    label: 'Макс. балл',
    align: 'center',
    render: (r) => <span className="font-bold text-slate-700">{r.maxMarks}</span>,
  },
  {
    key: 'minMarks',
    label: 'Проходной балл',
    align: 'center',
    render: (r) => <span className="font-bold text-rose-600">{r.minMarks}</span>,
  },
]

export function ExamSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Расписание экзаменов"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Расписание экзаменов' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить расписание" />
          </div>
        }
      />
      <DataTable
        title="Список расписаний"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['subject', 'examDate', 'roomNo']}
        rowKey="id"
      />
    </div>
  )
}
