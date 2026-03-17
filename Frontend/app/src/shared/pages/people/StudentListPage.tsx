import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  className: string
  section: string
  parent: string
  phone: string
  status: boolean
}

const data: Row[] = [
  { id: 'STU001', name: 'Alexander Ivanov', className: 'VIII', section: 'A', parent: 'Ivanov A.P.', phone: '+7 777 111 22 33', status: true },
  { id: 'STU002', name: 'Maria Petrova', className: 'VIII', section: 'A', parent: 'Petrova I.S.', phone: '+7 777 222 33 44', status: true },
  { id: 'STU003', name: 'Dmitry Sidorov', className: 'VIII', section: 'B', parent: 'Sidorov K.M.', phone: '+7 777 333 44 55', status: true },
  { id: 'STU004', name: 'Anna Kozlova', className: 'IX', section: 'A', parent: 'Kozlova N.A.', phone: '+7 777 444 55 66', status: true },
  { id: 'STU005', name: 'Sergey Morozov', className: 'IX', section: 'B', parent: 'Morozov D.S.', phone: '+7 777 555 66 77', status: false },
  { id: 'STU006', name: 'Ekaterina Novikova', className: 'X', section: 'A', parent: 'Novikova P.R.', phone: '+7 777 666 77 88', status: true },
  { id: 'STU007', name: 'Andrey Orlov', className: 'X', section: 'A', parent: 'Orlova V.A.', phone: '+7 777 777 88 99', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Student Name',
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 text-slate-400 grid place-items-center text-xs font-bold flex-shrink-0">
          {r.name.charAt(0)}
        </div>
        <span className="font-bold text-slate-900">{r.name}</span>
      </div>
    ),
  },
  { key: 'className', label: 'Class', align: 'center' },
  { key: 'section', label: 'Section', align: 'center' },
  { key: 'parent', label: 'Parent' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Active" inactiveLabel="Inactive" />,
  },
]

export function StudentListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'People' },
          { label: 'Students' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Student" />
          </div>
        }
      />
      <DataTable
        title="Students List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'className', 'section', 'parent'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
