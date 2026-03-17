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
  { id: 'CR001', className: '8', section: 'А', subject: 'Математика', teacher: 'Иванов А.В.', day: 'Понедельник', startTime: '09:00', endTime: '09:45' },
  { id: 'CR002', className: '8', section: 'А', subject: 'Физика', teacher: 'Петров В.И.', day: 'Понедельник', startTime: '10:00', endTime: '10:45' },
  { id: 'CR003', className: '8', section: 'А', subject: 'Химия', teacher: 'Сидоров К.М.', day: 'Вторник', startTime: '09:00', endTime: '09:45' },
  { id: 'CR004', className: '8', section: 'Б', subject: 'История', teacher: 'Морозов Д.С.', day: 'Вторник', startTime: '10:00', endTime: '10:45' },
]

const dayColors: Record<string, string> = {
  'Понедельник': 'bg-blue-50 text-blue-700',
  'Вторник': 'bg-purple-50 text-purple-700',
  'Среда': 'bg-teal-50 text-teal-700',
  'Четверг': 'bg-amber-50 text-amber-700',
  'Пятница': 'bg-rose-50 text-rose-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'className', label: 'Класс', align: 'center' },
  { key: 'section', label: 'Секция', align: 'center' },
  { key: 'subject', label: 'Предмет' },
  { key: 'teacher', label: 'Учитель' },
  {
    key: 'day',
    label: 'День',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${dayColors[r.day] ?? 'bg-gray-50 text-gray-700'}`}>
        {r.day}
      </span>
    ),
  },
  { key: 'startTime', label: 'Начало' },
  { key: 'endTime', label: 'Конец' },
]

export function ClassRoutinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Расписание классов"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Расписание классов' },
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
        searchKeys={['id', 'className', 'subject', 'teacher', 'day']}
        rowKey="id"
      />
    </div>
  )
}
