import { PageHeader } from '../../ui/PageHeader'

const NOTIFICATIONS = [
  { id: 1, type: 'academic', title: 'Оценка по физике', text: 'Учитель Сидоров К.М. выставил оценку "5" за ДЗ.', time: '10 мин. назад', unread: true, icon: '🎓' },
  { id: 2, type: 'system', title: 'Обновление платформы', text: 'Добавлены новые функции геймификации и личный кабинет родителя.', time: '2 часа назад', unread: true, icon: '⚙️' },
  { id: 3, type: 'social', title: 'Новое сообщение', text: 'Анна Макарова отправила вам сообщение в мессенджере.', time: '5 часов назад', unread: false, icon: '💬' },
  { id: 4, type: 'gamification', title: 'Новая ачивка!', text: 'Вы получили достижение "Первые шаги" за завершение первого урока.', time: 'Вчера', unread: false, icon: '🏆' },
]

export function NotificationsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Уведомления"
        breadcrumbs={[{ label: 'Связь', to: '/messenger' }, { label: 'Уведомления' }]}
      />

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <div className="flex gap-4">
              {['Все', 'Академические', 'Системные'].map((tab, i) => (
                 <button key={tab} className={`h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab}
                 </button>
              ))}
           </div>
           <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Отметить все как прочитанные</button>
        </div>

        <div className="divide-y divide-slate-100">
           {NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`p-8 hover:bg-slate-50 transition-all flex gap-6 group relative ${n.unread ? 'bg-primary/5' : ''}`}>
                 {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                 <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                    {n.icon}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <h3 className={`text-base font-black tracking-tight ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed truncate">{n.text}</p>
                    <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="h-8 px-4 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all">Открыть</button>
                       <button className="h-8 px-4 rounded-xl bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Скрыть</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        <div className="p-8 bg-slate-50/50 flex justify-center border-t border-slate-100">
           <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Показать более ранние уведомления</button>
        </div>
      </div>
    </div>
  )
}
