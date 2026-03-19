import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 lg:px-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight uppercase">EduFuture</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Возможности</a>
          <a href="#roles" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Роли</a>
          <a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Тарифы</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">Войти</Link>
          <Link to="/register" className="h-11 px-6 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center">
            Начать бесплатно
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
               NEW: Геймификация 2.0
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Образование будущего через <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primaryDark">геймификацию</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Платформа, где учиться интересно, а учить — легко. Мы объединяем современные технологии и игровые механики для достижения лучших результатов.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto h-14 px-10 bg-primary text-white text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center">
                Создать аккаунт
              </Link>
              <button className="w-full sm:w-auto h-14 px-10 bg-white border border-slate-200 text-slate-900 text-base font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Для учреждений
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
               {[
                 { label: 'Учеников', count: '10K+' },
                 { label: 'Учителей', count: '500+' },
                 { label: 'Школ', count: '50+' },
               ].map(stat => (
                 <div key={stat.label}>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.count}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
          <div className="flex-1 relative">
             <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-emerald-400/20 blur-3xl opacity-50 rounded-full animate-pulse" />
             <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070" 
                  alt="Dashboard Preview" 
                  className="rounded-[32px] w-full"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Единая система для всех</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Индивидуальные решения для каждой роли</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { role: 'Школы', desc: 'Управление структурой, массовый импорт и детальная аналитика.', color: 'bg-primary' },
              { role: 'Учителя', desc: 'Создание курсов, управление тестами и автоматическая проверка.', color: 'bg-emerald-500' },
              { role: 'Ученики', desc: 'Геймифицированное обучение, ачивки и турниры.', color: 'bg-amber-500' },
              { role: 'Родители', desc: 'Прозрачная лента успеваемости и мониторинг в реальном времени.', color: 'bg-rose-500' },
            ].map(item => (
              <div key={item.role} className="p-8 rounded-[38px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${item.color} mb-6 flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.role}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 lg:px-20 bg-slate-50 leading-relaxed text-slate-500">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Тарифные планы</h2>
            <p className="text-slate-500 text-lg font-medium">Выберите подходящий вариант для вашего масштаба</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Базовый', price: 'Бесплатно', features: ['До 30 учеников', 'Базовые функции', 'Светлая тема'], primary: false },
              { name: 'Профессиональный', price: '9,900₸ / мес', features: ['До 300 учеников', 'Геймификация', 'Все отчеты', 'Приоритетная поддержка'], primary: true },
              { name: 'Корпоративный', price: 'Индивидуально', features: ['Неограниченно', 'Свой домен', 'Интеграции API'], primary: false },
            ].map(plan => (
              <div key={plan.name} className={`p-10 rounded-[42px] border ${plan.primary ? 'bg-white border-primary border-2 shadow-2xl scale-105' : 'bg-white/50 border-slate-100 shadow-sm'} relative overflow-hidden`}>
                {plan.primary && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-[20px]">Популярный</div>}
                <div className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">{plan.name}</div>
                <div className="text-4xl font-black text-slate-900 mb-8">{plan.price}</div>
                <ul className="space-y-4 mb-10">
                   {plan.features.map(f => (
                     <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <svg className={`w-5 h-5 ${plan.primary ? 'text-primary' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {f}
                     </li>
                   ))}
                </ul>
                <button className={`w-full h-14 rounded-2xl text-sm font-black transition-all ${plan.primary ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  Выбрать план
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white px-6 lg:px-20 border-t border-slate-100">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               </div>
               <span className="text-lg font-black text-slate-900 tracking-tight">EduFuture</span>
            </div>
            <div className="text-slate-400 text-xs font-bold">© 2024 EduFuture. Все права защищены.</div>
            <div className="flex gap-6">
               <a href="#" className="text-slate-400 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest">Privacy</a>
               <a href="#" className="text-slate-400 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest">Terms</a>
            </div>
         </div>
      </footer>
    </div>
  )
}
