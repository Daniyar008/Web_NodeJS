import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  name: string
  category: string
  quantity: number
  price: string
  status: boolean
}

const data: Row[] = [
  { id: 'INV001', name: 'Цифровой проектор', category: 'Электроника', quantity: 12, price: '450.00 $', status: true },
  { id: 'INV002', name: 'Лабораторные микроскопы', category: 'Наука', quantity: 24, price: '120.00 $', status: true },
  { id: 'INV003', name: 'Офисные кресла', category: 'Мебель', quantity: 50, price: '85.00 $', status: true },
  { id: 'INV004', name: 'Баскетбольные мячи', category: 'Спорт', quantity: 30, price: '25.00 $', status: true },
  { id: 'INV005', name: 'Набор библиотечных книг', category: 'Книги', quantity: 500, price: '5,000.00 $', status: false },
  { id: 'INV006', name: 'Школьные доски', category: 'Мебель', quantity: 15, price: '150.00 $', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'name',
    label: 'Название предмета',
    render: (r) => <span className="font-bold text-slate-800 tracking-tight">{r.name}</span>,
  },
  { 
    key: 'category', 
    label: 'Категория',
    render: (r) => (
      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
        {r.category}
      </span>
    )
  },
  { 
    key: 'quantity', 
    label: 'Кол-во',
    render: (r) => <span className="text-slate-900 font-bold">{r.quantity}</span>
  },
  { 
    key: 'price', 
    label: 'Цена за ед.',
    render: (r) => <span className="text-slate-500 font-medium">{r.price}</span>
  },
  {
    key: 'status',
    label: 'Наличие',
    render: (r) => <StatusBadge status={r.status} activeLabel="В наличии" inactiveLabel="Отсутствует" />,
  },
]

export function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Инвентарь"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Управление' },
          { label: 'Инвентарь' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить предмет" />
          </div>
        }
      />
      <DataTable
        title="Складской инвентарь"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['name', 'category']}
        rowKey="id"
      />
    </div>
  )
}
