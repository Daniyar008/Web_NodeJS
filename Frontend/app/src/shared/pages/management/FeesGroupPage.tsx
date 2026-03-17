import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  feesGroup: string
  description: string
  status: boolean
}

const data: Row[] = [
  { id: 'FG80482', feesGroup: 'Tuition Fees', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80481', feesGroup: 'Monthly Fees', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80480', feesGroup: 'Class 1 General', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80479', feesGroup: 'Class 1 Lump Sum', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80478', feesGroup: 'Class 1-I Installment', description: 'The money that you pay to be taught', status: false },
  { id: 'FG80477', feesGroup: 'Class 1-II Installment', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80476', feesGroup: 'Class 1-III Installment', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80475', feesGroup: 'Discount', description: 'The money that you pay to be taught', status: false },
  { id: 'FG80474', feesGroup: 'Class 3-I Installment', description: 'The money that you pay to be taught', status: true },
  { id: 'FG80473', feesGroup: 'Class 4-I Installment', description: 'The money that you pay to be taught', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-semibold text-xs">{r.id}</span>,
  },
  { key: 'feesGroup', label: 'Группа оплаты' },
  {
    key: 'description',
    label: 'Описание',
    render: (r) => <span className="text-slate-500 text-xs">{r.description}</span>,
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export function FeesGroupPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Группы оплаты"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Управление' },
          { label: 'Группы оплаты' },
        ]}
        actions={
          <>
            <ExportButton />
            <AddButton label="Добавить группу" />
          </>
        }
      />
      <DataTable
        title="Список групп оплаты"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['id', 'feesGroup'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
