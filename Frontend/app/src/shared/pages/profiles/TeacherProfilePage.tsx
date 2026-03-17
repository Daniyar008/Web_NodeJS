import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../ui/PageHeader'

export function TeacherProfilePage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Обзор')

  const teacher = {
    id: id || 'T001',
    name: 'Марина Соколова',
    subject: 'Математика',
    experience: '12 лет',
    email: 'm.sokolova@school.edu',
    phone: '+7 701 555 44 33',
    dob: '15.03.1985',
    qualification: 'Магистр педагогических наук',
    address: 'пр. Абая, 120, кв. 15, Алматы',
    joiningDate: '15.08.2018',
    stats: {
      classes: '6',
      students: '156',
      attendance: '98%',
      performance: 'Высокая'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Профиль учителя — ${teacher.name}`}
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Люди', to: '/teachers' },
          { label: 'Профиль учителя' }
        ]}
      />

      {/* Header Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500/20 to-blue-500/5 relative" />
        <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6">
          <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-lg relative">
            <div className="w-full h-full rounded-[32px] bg-slate-100 flex items-center justify-center border-4 border-white overflow-hidden">
               <svg className="w-16 h-16 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{teacher.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">Учитель {teacher.subject}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {teacher.email}
              </span>
            </div>
          </div>
          <div className="flex gap-2 pb-2">
            <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-sm hover:opacity-90 transition-all">
              Написать
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Классов', value: teacher.stats.classes, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Учеников', value: teacher.stats.students, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Посещаемость', value: teacher.stats.attendance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Успеваемость', value: teacher.stats.performance, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-50 px-6">
              {['Обзор', 'Расписание', 'Классы', 'Материалы'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                </button>
              ))}
            </div>
            <div className="p-8">
              {activeTab === 'Обзор' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <span className="w-1 h-4 bg-primary rounded-full" />
                       Профессиональные данные
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                      {[
                        { label: 'Квалификация', value: teacher.qualification },
                        { label: 'Опыт работы', value: teacher.experience },
                        { label: 'Дата вступления в должность', value: teacher.joiningDate },
                        { label: 'Специализация', value: teacher.subject },
                        { label: 'Дата рождения', value: teacher.dob },
                        { label: 'Телефон', value: teacher.phone },
                        { label: 'Email', value: teacher.email },
                        { label: 'Адрес проживания', value: teacher.address, full: true },
                      ].map((item) => (
                        <div key={item.label} className={item.full ? 'sm:col-span-2' : ''}>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                          <div className="text-sm font-bold text-slate-700">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Рабочая информация</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                 <span className="text-xs font-bold text-slate-400">ID Учителя</span>
                 <span className="text-xs font-bold text-primary">{teacher.id}</span>
               </div>
               <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                 <span className="text-xs font-bold text-slate-400">Статус</span>
                 <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase">Активен</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
