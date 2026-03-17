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
  { id: 'PAR001', name: 'Alexander Ivanov', email: 'a.ivanov@email.kz', phone: '+7 777 111 22 33', students: 'Alexander (VIII A)', occupation: 'Engineer' },
  { id: 'PAR002', name: 'Irina Petrova', email: 'i.petrova@email.kz', phone: '+7 777 222 33 44', students: 'Maria (VIII A)', occupation: 'Doctor' },
  { id: 'PAR003', name: 'Kirill Sidorov', email: 'k.sidorov@email.kz', phone: '+7 777 333 44 55', students: 'Dmitry (VIII B)', occupation: 'Entrepreneur' },
  { id: 'PAR004', name: 'Nadezhda Kozlova', email: 'n.kozlova@email.kz', phone: '+7 777 444 55 66', students: 'Anna (IX A)', occupation: 'Teacher' },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Parent Name',
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 grid place-items-center text-xs font-bold flex-shrink-0">
          {r.name.charAt(0)}
        </div>
        <span className="font-bold text-slate-900">{r.name}</span>
      </div>
    ),
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'students', label: 'Students' },
  { key: 'occupation', label: 'Occupation' },
]

export function ParentListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'People' },
          { label: 'Parents' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Parent" />
          </div>
        }
      />
      <DataTable
        title="Parents List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'email', 'students'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
