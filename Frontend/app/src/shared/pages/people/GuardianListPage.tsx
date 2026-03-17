import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  relation: string
  phone: string
  email: string
  student: string
}

const data: Row[] = [
  { id: 'GRD001', name: 'Петр Иванов', relation: 'Дедушка', phone: '+7 777 111 22 33', email: 'p.ivanov@email.kz', student: 'Александр Иванов (8 А)' },
  { id: 'GRD002', name: 'Людмила Петрова', relation: 'Бабушка', phone: '+7 777 222 33 44', email: 'l.petrova@email.kz', student: 'Мария Петрова (8 А)' },
  { id: 'GRD003', name: 'Галина Сидорова', relation: 'Тетя', phone: '+7 777 333 44 55', email: 'g.sidorova@email.kz', student: 'Дмитрий Сидоров (8 Б)' },
  { id: 'GRD004', name: 'Николай Козлов', relation: 'Дядя', phone: '+7 777 444 55 66', email: 'n.kozlov@email.kz', student: 'Анна Козлова (9 А)' },
  { id: 'GRD005', name: 'Татьяна Морозова', relation: 'Бабушка', phone: '+7 777 555 66 77', email: 't.morozova@email.kz', student: 'Сергей Морозов (9 Б)' },
]

const relationColors: Record<string, string> = {
  'Дедушка': 'bg-blue-50 text-blue-700',
  'Бабушка': 'bg-pink-50 text-pink-700',
  'Тетя': 'bg-purple-50 text-purple-700',
  'Дядя': 'bg-amber-50 text-amber-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Имя опекуна',
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-amber-50 border border-amber-100 text-amber-500 grid place-items-center text-xs font-bold flex-shrink-0">
          {r.name.charAt(0)}
        </div>
        <span className="font-bold text-slate-900">{r.name}</span>
      </div>
    ),
  },
  {
    key: 'relation',
    label: 'Родство',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${relationColors[r.relation] ?? 'bg-slate-50 text-slate-600'}`}>
        {r.relation}
      </span>
    ),
  },
  { 
    key: 'phone', 
    label: 'Телефон',
    render: (r) => <span className="text-slate-600 text-[13px] tabular-nums font-medium">{r.phone}</span>
  },
  { 
    key: 'email', 
    label: 'Email',
    render: (r) => <span className="text-slate-500 text-[12px]">{r.email}</span>
  },
  { 
    key: 'student', 
    label: 'Подопечный',
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-slate-100 grid place-items-center flex-shrink-0">
           <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <span className="text-xs font-semibold text-slate-700">{r.student}</span>
      </div>
    )
  },
]

export function GuardianListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Опекуны"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Люди' },
          { label: 'Опекуны' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить опекуна" />
          </div>
        }
      />
      <DataTable
        title="Список опекунов"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'relation', 'student']}
        rowKey="id"
      />
    </div>
  )
}
