import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const PERIODS = ['1 Урок\n09:00–09:45', '2 Урок\n10:00–10:45', '3 Урок\n11:00–11:45', '4 Урок\n12:00–12:45', '5 Урок\n13:30–14:15', '6 Урок\n14:30–15:15']

type Slot = { subject: string; teacher: string; room: string; color: string }

const TIMETABLE: Record<string, Record<string, Slot | null>> = {
  'Понедельник': {
    '1 Урок\n09:00–09:45': { subject: 'Математика', teacher: 'Иванов А.В.', room: '205', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    '2 Урок\n10:00–10:45': { subject: 'Физика', teacher: 'Петров В.И.', room: '101', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    '3 Урок\n11:00–11:45': { subject: 'Химия', teacher: 'Сидоров К.М.', room: 'Лаб-1', color: 'bg-teal-50 border-teal-200 text-teal-800' },
    '5 Урок\n13:30–14:15': { subject: 'История', teacher: 'Морозов Д.С.', room: '304', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  },
  'Вторник': {
    '1 Урок\n09:00–09:45': { subject: 'Информатика', teacher: 'Новиков П.Р.', room: 'Комп-2', color: 'bg-green-50 border-green-200 text-green-800' },
    '3 Урок\n11:00–11:45': { subject: 'Математика', teacher: 'Иванов А.В.', room: '205', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    '4 Урок\n12:00–12:45': { subject: 'Биология', teacher: 'Козлова Н.А.', room: 'Лаб-2', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    '5 Урок\n13:30–14:15': { subject: 'Физкультура', teacher: 'Орлов В.А.', room: 'Спортзал', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  },
}

export function TimeTablePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Расписание"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Расписание' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Изменить" />
          </div>
        }
      />

      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Выбрать класс:</span>
        {['8 А', '8 Б', '9 А', '9 Б', '10 А'].map((cls) => (
          <button
            key={cls}
            className="h-9 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition"
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">Недельное расписание — 8 А класс</span>
          <div className="flex gap-2">
            <button className="h-9 w-9 rounded-2xl border border-slate-100 bg-white grid place-items-center text-slate-400 hover:text-primary transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="h-9 w-9 rounded-2xl border border-slate-100 bg-white grid place-items-center text-slate-400 hover:text-primary transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-left font-bold text-slate-500 uppercase tracking-wider w-44 border-b border-r border-slate-100">
                  Время занятий
                </th>
                {DAYS.map((day) => (
                  <th key={day} className="py-4 px-4 text-center font-bold text-slate-900 uppercase tracking-wider border-b border-r border-slate-100 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, pi) => (
                <tr key={period} className={pi % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'}>
                  <td className="py-4 px-6 border-r border-slate-100 align-top">
                    <div className="font-bold text-slate-900 whitespace-pre-line leading-tight">{period}</div>
                  </td>
                  {DAYS.map((day) => {
                    const slot = TIMETABLE[day]?.[period]
                    return (
                      <td key={day} className="py-3 px-3 border-r border-slate-100 last:border-r-0 align-top">
                        {slot ? (
                          <div className={`rounded-2xl border p-3 ${slot.color} transition hover:scale-[1.02] cursor-pointer`}>
                            <div className="font-bold leading-tight mb-1">{slot.subject}</div>
                            <div className="text-[10px] font-bold opacity-80">{slot.teacher}</div>
                            <div className="text-[10px] font-medium opacity-60 mt-1">Каб: {slot.room}</div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[70px] rounded-2xl border border-dashed border-slate-100 flex items-center justify-center text-slate-300">
                            <span className="text-[10px] font-medium italic">Нет уроков</span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
