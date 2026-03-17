import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Профиль')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Настройки"
        breadcrumbs={[
          { label: 'Панель', to: '/' },
          { label: 'Настройки' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: 'Общие', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { id: 'Профиль', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'Уведомления', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { id: 'Безопасность', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
              {tab.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8">
              {activeTab === 'Профиль' && (
                <div className="space-y-8">
                  <header>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Персональные данные</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Обновите вашу информацию и фото профиля</p>
                  </header>

                  <div className="flex items-center gap-6 p-6 rounded-[24px] bg-slate-50 border border-slate-100">
                    <div className="w-20 h-20 rounded-[28px] bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-slate-400">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-primary text-white text-[11px] font-bold rounded-xl shadow-sm hover:opacity-90 transition-all">Загрузить фото</button>
                      <button className="ml-3 px-4 py-2 text-rose-500 text-[11px] font-bold rounded-xl hover:bg-rose-50 transition-all">Удалить</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Имя</label>
                      <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Администратор" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="admin@preskool.edu" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Био</label>
                       <textarea className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" defaultValue="Главный администратор системы PreSkool." />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Уведомления' && (
                <div className="space-y-8">
                  <header>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Уведомления</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Выберите способы получения важной информации</p>
                  </header>

                  <div className="space-y-4">
                    {[
                      { id: 'email', title: 'Email уведомления', desc: 'Получать отчеты и новости на почту' },
                      { id: 'push', title: 'Push уведомления', desc: 'Уведомления в браузере о важных событиях' },
                      { id: 'sms', title: 'SMS оповещения', desc: 'Срочные сообщения о пропусках и ЧП' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-[24px] bg-slate-50 border border-slate-100">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.title}</div>
                          <div className="text-[10px] font-bold text-slate-400">{item.desc}</div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'sms'} />
                           <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
