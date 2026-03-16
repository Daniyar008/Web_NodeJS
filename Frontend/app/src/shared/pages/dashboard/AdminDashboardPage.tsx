function StatCard({
  label,
  value,
  chip,
}: {
  label: string
  value: string
  chip?: { text: string; tone: 'green' | 'amber' | 'red' }
}) {
  const tone =
    chip?.tone === 'green'
      ? 'bg-emerald-50 text-emerald-600'
      : chip?.tone === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : chip?.tone === 'red'
          ? 'bg-rose-50 text-rose-600'
          : 'bg-slate-50 text-slate-600'

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
        </div>
        {chip ? (
          <div className={`px-2 py-1 rounded-full text-[11px] font-semibold ${tone}`}>
            {chip.text}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">Панель / Админ</div>
          <h2 className="text-xl font-semibold text-slate-900">С возвращением</h2>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
          Учебный год: <span className="font-semibold text-slate-900">2024 / 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Всего учеников" value="3654" chip={{ text: '+2.4%', tone: 'green' }} />
        <StatCard label="Всего учителей" value="284" chip={{ text: '+1.1%', tone: 'green' }} />
        <StatCard label="Всего родителей" value="162" chip={{ text: '+0.8%', tone: 'amber' }} />
        <StatCard label="Всего классов" value="82" chip={{ text: '-0.2%', tone: 'red' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-900">Сбор платежей</div>
            <div className="text-xs text-slate-500">Этот месяц</div>
          </div>
          <div className="h-72 rounded-xl bg-bg grid place-items-center text-slate-400 text-sm">
            График (заглушка)
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-900">Заявки на отпуск</div>
            <div className="text-xs text-primary font-semibold cursor-pointer">Смотреть все</div>
          </div>
          <div className="space-y-3">
            {[
              ['Джеймс', 'Отпуск: 12–15 мая', 'Одобрено'],
              ['Тереза', 'Отпуск: 17–18 мая', 'На рассмотрении'],
              ['Хендрита', 'Отпуск: 21–22 мая', 'Отклонено'],
            ].map(([name, meta, status]) => (
              <div key={name} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{name}</div>
                  <div
                    className={[
                      'text-[11px] font-semibold px-2 py-1 rounded-full',
                      status === 'Одобрено'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status === 'На рассмотрении'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-700',
                    ].join(' ')}
                  >
                    {status}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">{meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

