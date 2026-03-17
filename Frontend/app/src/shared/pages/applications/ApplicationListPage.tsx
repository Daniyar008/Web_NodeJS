import { DataTable, type Column } from '../../ui/DataTable'
import { PageHeader, ExportButton, StatusBadge } from '../../ui/PageHeader'

type Row = {
  id: string
  applicantName: string
  targetClass: string
  submissionDate: string
  phone: string
  status: 'new' | 'pending' | 'approved' | 'rejected'
}

const data: Row[] = [
  { id: 'APP001', applicantName: 'Кирилл Ермолаев', targetClass: '1 А', submissionDate: '10.03.2024', phone: '+7 777 999 88 77', status: 'new' },
  { id: 'APP002', applicantName: 'Алена Волкова', targetClass: '5 Б', submissionDate: '12.03.2024', phone: '+7 777 888 77 66', status: 'pending' },
  { id: 'APP003', applicantName: 'Максим Степанов', targetClass: '8 А', submissionDate: '14.03.2024', phone: '+7 777 777 66 55', status: 'approved' },
  { id: 'APP004', applicantName: 'Ольга Белова', targetClass: '3 В', submissionDate: '15.03.2024', phone: '+7 777 666 55 44', status: 'rejected' },
  { id: 'APP005', applicantName: 'Роман Сорокин', targetClass: '10 А', submissionDate: '16.03.2024', phone: '+7 777 555 44 33', status: 'new' },
]

const getStatusConfig = (status: Row['status']) => {
  switch (status) {
    case 'new': return { label: 'Новая', color: 'bg-blue-500' }
    case 'pending': return { label: 'В ожидании', color: 'bg-amber-500' }
    case 'approved': return { label: 'Одобрена', color: 'bg-emerald-500' }
    case 'rejected': return { label: 'Отклонена', color: 'bg-rose-500' }
  }
}

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID Заявки',
    render: (r) => <span className="text-primary font-bold text-[11px] uppercase tracking-tight">{r.id}</span>,
  },
  {
    key: 'applicantName',
    label: 'Заявитель',
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-900 tracking-tight leading-none mb-1">{r.applicantName}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.phone}</span>
      </div>
    ),
  },
  { 
    key: 'targetClass', 
    label: 'Целевой класс',
    align: 'center',
    render: (r) => <span className="text-xs font-bold text-slate-700">{r.targetClass}</span>
  },
  { 
    key: 'submissionDate', 
    label: 'Дата подачи',
    render: (r) => <span className="text-xs text-slate-500">{r.submissionDate}</span>
  },
  {
    key: 'status',
    label: 'Статус',
    render: (r) => {
      const config = getStatusConfig(r.status)
      return (
        <span className={`px-2 py-1 rounded-lg text-white text-[10px] font-bold ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    key: 'actions',
    label: 'Действия',
    align: 'right',
    render: () => (
      <div className="flex items-center justify-end gap-2">
         <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
         </button>
         <button className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
      </div>
    )
  }
]

export function ApplicationListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Заявки на поступление"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Приложения' },
          { label: 'Список заявок' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
          </div>
        }
      />
      <DataTable
        title="Новые анкеты"
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        searchKeys={['applicantName', 'targetClass', 'id'] as never[]}
        rowKey="id"
      />
    </div>
  )
}
