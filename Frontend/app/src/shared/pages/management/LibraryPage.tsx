import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, AddButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  title: string
  author: string
  category: string
  quantity: number
  price: string
  status: boolean
}

const data: Row[] = [
  { id: 'LIB001', title: 'Основы математики', author: 'Иванов П.С.', category: 'Учебники', quantity: 45, price: '850 ₸', status: true },
  { id: 'LIB002', title: 'Физика для всех', author: 'Петров А.К.', category: 'Научпоп', quantity: 12, price: '1200 ₸', status: true },
  { id: 'LIB003', title: 'Мировая история', author: 'Сидоров М.В.', category: 'История', quantity: 30, price: '1500 ₸', status: true },
  { id: 'LIB004', title: 'Алгоритмы и данные', author: 'Новиков Д.А.', category: 'Программирование', quantity: 8, price: '2500 ₸', status: false },
  { id: 'LIB005', title: 'Классическая литература', author: 'Пушкин А.С.', category: 'Литература', quantity: 100, price: '500 ₸', status: true },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'title',
    label: 'Название книги',
    render: (r) => <span className="font-bold text-slate-800 tracking-tight">{r.title}</span>,
  },
  { key: 'author', label: 'Автор' },
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
    label: 'Статус',
    render: (r) => <StatusBadge status={r.status} activeLabel="В наличии" inactiveLabel="Выдано" />,
  },
]

export function LibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Библиотека"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Управление' },
          { label: 'Библиотека' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Добавить книгу" />
          </div>
        }
      />
      <DataTable
        title="Книжный фонд"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['title', 'author', 'category']}
        rowKey="id"
      />
    </div>
  )
}
