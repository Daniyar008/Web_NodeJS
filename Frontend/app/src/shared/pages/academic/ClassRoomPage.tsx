import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  building: string
  capacity: number
  type: 'Classroom' | 'Laboratory' | 'Auditorium'
  status: boolean
}

const data: Row[] = [
  { id: 'R101', name: 'Room 101', building: 'Building A', capacity: 30, type: 'Classroom', status: true },
  { id: 'R102', name: 'Room 102', building: 'Building A', capacity: 25, type: 'Classroom', status: true },
  { id: 'R201', name: 'Physics Lab', building: 'Building B', capacity: 20, type: 'Laboratory', status: true },
  { id: 'R202', name: 'Chemistry Lab', building: 'Building B', capacity: 18, type: 'Laboratory', status: false },
  { id: 'R301', name: 'Auditorium 301', building: 'Building C', capacity: 80, type: 'Auditorium', status: true },
]

const typeColors: Record<string, string> = {
  Classroom: 'bg-blue-50 text-blue-700',
  Laboratory: 'bg-emerald-50 text-emerald-700',
  Auditorium: 'bg-purple-50 text-purple-700',
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-xs">{r.id}</span>,
  },
  { key: 'name', label: 'Room Name', render: (r) => <span className="font-bold text-slate-900">{r.name}</span> },
  { key: 'building', label: 'Building' },
  { key: 'capacity', label: 'Capacity', align: 'center' },
  {
    key: 'type',
    label: 'Type',
    render: (r) => (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${typeColors[r.type]}`}>
        {r.type}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} activeLabel="Available" inactiveLabel="Unavailable" />,
  },
]

export function ClassRoomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Academic' },
          { label: 'Classrooms' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Add Room" />
          </div>
        }
      />
      <DataTable
        title="Classrooms List"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'name', 'building', 'type'] as never[]}
        rowKey="id"
      />
    </div>
  )
}

