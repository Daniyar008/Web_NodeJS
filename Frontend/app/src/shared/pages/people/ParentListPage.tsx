import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  email: string
  phone: string
  students: string
  occupation: string
}

const data: Row[] = [
  { id: 'PAR001', name: 'Александр Иванов', email: 'a.ivanov@email.kz', phone: '+7 777 111 22 33', students: 'Александр (8 А)', occupation: 'Инженер' },
  { id: 'PAR002', name: 'Ирина Петрова', email: 'i.petrova@email.kz', phone: '+7 777 222 33 44', students: 'Мария (8 А)', occupation: 'Врач' },
  { id: 'PAR003', name: 'Кирилл Сидоров', email: 'k.sidorov@email.kz', phone: '+7 777 333 44 55', students: 'Дмитрий (8 Б)', occupation: 'Предприниматель' },
  { id: 'PAR004', name: 'Надежда Козлова', email: 'n.kozlova@email.kz', phone: '+7 777 444 55 66', students: 'Анна (9 А)', occupation: 'Учитель' },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Имя родителя',
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-500 grid place-items-center text-[11px] font-black flex-shrink-0 group-hover:scale-110 transition-transform">
          {r.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 tracking-tight leading-none mb-1">{r.name}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.email}</span>
        </div>
      </div>
    ),
  },
  { key: 'phone', label: 'Телефон', render: (r) => <span className="text-xs font-bold text-slate-600">{r.phone}</span> },
  { 
    key: 'students', 
    label: 'Ученики',
    render: (r) => (
      <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center">
             <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span className="text-xs font-bold text-slate-700">{r.students}</span>
      </div>
    )
  },
  { key: 'occupation', label: 'Профессия', render: (r) => <span className="text-xs text-slate-500">{r.occupation}</span> },
]

export function ParentListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Родители"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Люди' },
          { label: 'Родители' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить родителя" />
          </div>
        }
      />
      <DataTable
        title="Список родителей"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'email', 'students'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
