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
  { id: 'E140523', examName: 'Еженедельный тест', examDate: '13 мая 2024', startTime: '09:30', endTime: '10:45' },
  { id: 'E140522', examName: 'Ежемесячный тест', examDate: '27 мая 2024', startTime: '09:30', endTime: '11:00' },
  { id: 'E140521', examName: 'Тест по главе', examDate: '05 июня 2024', startTime: '09:30', endTime: '10:30' },
  { id: 'E140520', examName: 'Тест по модулю', examDate: '15 июня 2024', startTime: '10:30', endTime: '11:30' },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'examName', label: 'Название экзамена', render: (r) => <span className="font-bold text-slate-900">{r.examName}</span> },
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
]

export function ExamListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Экзамены"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Экзамены' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить экзамен" />
          </div>
        }
      />
      <DataTable
        title="Список экзаменов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'examName', 'examDate']}
        rowKey="id"
      />
    </div>
  )
}
