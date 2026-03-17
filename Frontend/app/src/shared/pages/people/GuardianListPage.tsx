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
  { id: 'GRD001', name: 'Petr Ivanov', relation: 'Grandfather', phone: '+7 777 111 22 33', email: 'p.ivanov@email.kz', student: 'Alexander Ivanov (VIII A)' },
  { id: 'GRD002', name: 'Lyudmila Petrova', relation: 'Grandmother', phone: '+7 777 222 33 44', email: 'l.petrova@email.kz', student: 'Maria Petrova (VIII A)' },
  { id: 'GRD003', name: 'Galina Sidorova', relation: 'Aunt', phone: '+7 777 333 44 55', email: 'g.sidorova@email.kz', student: 'Dmitry Sidorov (VIII B)' },
  { id: 'GRD004', name: 'Nikolay Kozlov', relation: 'Uncle', phone: '+7 777 444 55 66', email: 'n.kozlov@email.kz', student: 'Anna Kozlova (IX A)' },
  { id: 'GRD005', name: 'Tatyana Morozova', relation: 'Grandmother', phone: '+7 777 555 66 77', email: 't.morozova@email.kz', student: 'Sergey Morozov (IX B)' },
]

const relationColors: Record<string, string> = {
  Grandfather: 'bg-blue-50 text-blue-700',
  Grandmother: 'bg-pink-50 text-pink-700',
  Aunt: 'bg-purple-50 text-purple-700',
  Uncle: 'bg-amber-50 text-amber-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Guardian Name',
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
    label: 'Relation',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${relationColors[r.relation] ?? 'bg-slate-50 text-slate-600'}`}>
        {r.relation}
      </span>
    ),
  },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'student', label: 'Ward' },
]

export function GuardianListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Guardians"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'People' },
          { label: 'Guardians' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Guardian" />
          </div>
        }
      />
      <DataTable
        title="Guardians List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'relation', 'student'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
