import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../ui/PageHeader'

export function StudentProfilePage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Обзор')

  const student = {
    id: id || 'ST001',
    name: 'Александр Иванов',
    class: '8 А',
    rollNo: '24',
    email: 'a.ivanov@email.kz',
    phone: '+7 777 111 22 33',
    dob: '12.05.2010',
    gender: 'Мужской',
    address: 'ул. Достык, 15, кв. 42, Алматы',
    bloodGroup: 'A+',
    admissionDate: '01.09.2023',
    stats: {
      attendance: '95%',
      avgMark: '4.8',
      rank: '3/28',
      tasks: '12/15'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Профиль ученика — ${student.name}`}
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Люди', to: '/students' },
          { label: 'Профиль ученика' }
        ]}
      />

      {/* Header Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 relative" />
        <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6">
          <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-lg relative">
            <div className="w-full h-full rounded-[32px] bg-slate-100 flex items-center justify-center border-4 border-white overflow-hidden">
               <svg className="w-16 h-16 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-white shadow-sm" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{student.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">Ученик {student.class} класса</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {student.email}
              </span>
            </div>
          </div>
          <div className="flex gap-2 pb-2">
            <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-sm hover:opacity-90 transition-all">
              Редактировать
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Посещаемость', value: student.stats.attendance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Средний балл', value: student.stats.avgMark, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Ранг в классе', value: student.stats.rank, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Задания', value: student.stats.tasks, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-amber-500', bg: 'bg-amber-50' },
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-50 px-6">
              {['Обзор', 'Оценки', 'Посещаемость', 'Документы'].map((tab) => (
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
                       Личная информация
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                      {[
                        { label: 'Полное имя', value: student.name },
                        { label: 'Дата рождения', value: student.dob },
                        { label: 'Пол', value: student.gender },
                        { label: 'Группа крови', value: student.bloodGroup },
                        { label: 'Телефон', value: student.phone },
                        { label: 'Email', value: student.email },
                        { label: 'Адрес', value: student.address, full: true },
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

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Академические данные</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-400">ID Ученика</span>
                <span className="text-xs font-bold text-primary">{student.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-400">Класс</span>
                <span className="text-xs font-bold text-slate-700">{student.class}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-400">Дата приема</span>
                <span className="text-xs font-bold text-slate-700">{student.admissionDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Родители</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100" />
              <div>
                <div className="text-xs font-bold text-slate-900">Иван Иванов</div>
                <div className="text-[10px] font-bold text-slate-400">Отец • +7 777 000 11 22</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
