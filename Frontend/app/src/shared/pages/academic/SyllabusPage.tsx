import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  className: string
  section: string
  subject: string
  teacher: string
  uploadStatus: 'Загружен' | 'Ожидает' | 'Не загружен'
}

const data: Row[] = [
  { id: 'SYL001', className: '8', section: 'А', subject: 'Математика', teacher: 'Иванов А.В.', uploadStatus: 'Загружен' },
  { id: 'SYL002', className: '8', section: 'А', subject: 'Физика', teacher: 'Петров В.И.', uploadStatus: 'Загружен' },
  { id: 'SYL003', className: '8', section: 'Б', subject: 'Химия', teacher: 'Сидоров К.М.', uploadStatus: 'Ожидает' },
  { id: 'SYL004', className: '9', section: 'А', subject: 'Биология', teacher: 'Козлова Н.А.', uploadStatus: 'Загружен' },
  { id: 'SYL005', className: '9', section: 'Б', subject: 'История', teacher: 'Морозов Д.С.', uploadStatus: 'Не загружен' },
]

const uploadColors: Record<string, string> = {
  'Загружен': 'bg-emerald-50 text-emerald-700',
  'Ожидает': 'bg-amber-50 text-amber-700',
  'Не загружен': 'bg-rose-50 text-rose-700',
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
    key: 'uploadStatus',
    label: 'Статус загрузки',
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
        title="Силлабус"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Силлабус' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить силлабус" />
          </div>
        }
      />
      <DataTable
        title="Список силлабусов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'className', 'subject', 'teacher']}
        rowKey="id"
      />
    </div>
  )
}
