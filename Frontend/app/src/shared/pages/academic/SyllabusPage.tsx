import { PageHeader, ExportButton, AddButton } from '../../ui/PageHeader'

type Course = {
  id: string
  title: string
  subject: string
  teacher: string
  lessons: number
  progress?: number
  image: string
  category: string
  color: string
}

const COURSES: Course[] = [
  { id: 'C001', title: 'Основы квантовой физики', subject: 'Физика', teacher: 'Петров В.А.', lessons: 24, progress: 68, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070', category: 'Science', color: 'bg-blue-500' },
  { id: 'C002', title: 'Алгебра и начала анализа', subject: 'Математика', teacher: 'Иванова С.М.', lessons: 42, progress: 25, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070', category: 'Math', color: 'bg-indigo-500' },
  { id: 'C003', title: 'История древнего мира', subject: 'История', teacher: 'Сидорова Т.Ю.', lessons: 18, image: 'https://images.unsplash.com/photo-1461360370896-922622d12ff1?q=80&w=2070', category: 'History', color: 'bg-amber-500' },
  { id: 'C004', title: 'Программирование на Python', subject: 'Информатика', teacher: 'Морозов К.Г.', lessons: 32, progress: 10, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070', category: 'CS', color: 'bg-emerald-500' },
  { id: 'C005', title: 'Литература XIX века', subject: 'Литература', teacher: 'Ахматова А.А.', lessons: 12, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070', category: 'Arts', color: 'bg-rose-500' },
  { id: 'C006', title: 'Химия для начинающих', subject: 'Химия', teacher: 'Менделеев Д.И.', lessons: 15, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', category: 'Science', color: 'bg-purple-500' },
]

export function SyllabusPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Библиотека курсов"
        breadcrumbs={[
          { label: 'Панель управления', to: '/' },
          { label: 'Академическое' },
          { label: 'Библиотека курсов' },
        ]}
        actions={
          <div className="flex gap-2">
            <ExportButton />
            <AddButton label="Создать курс" />
          </div>
        }
      />

      {/* Categories / Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
         {['Все', 'Science', 'Math', 'History', 'CS', 'Arts', 'Languages'].map((cat, i) => (
            <button 
              key={cat} 
              className={`h-10 px-6 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
               {cat}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {COURSES.map(course => (
          <div key={course.id} className="bg-white rounded-[42px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
            <div className="relative h-56">
               <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="absolute top-5 left-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${course.color} shadow-lg shadow-black/20`}>
                     {course.category}
                  </span>
               </div>
               {course.progress !== undefined && (
                  <div className="absolute bottom-5 right-5">
                     <div className="h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center font-black text-xs text-primary">
                        {course.progress}%
                     </div>
                  </div>
               )}
            </div>
            
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {course.title}
                  </h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{course.teacher} • {course.subject}</p>
               </div>

               {course.progress !== undefined && (
                  <div className="space-y-2">
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${course.color} rounded-full transition-all duration-1000 ease-out`} 
                          style={{ width: `${course.progress}%` }} 
                        />
                     </div>
                  </div>
               )}

               <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                     </svg>
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{course.lessons} уроков</span>
                  </div>
                  <button className="h-11 px-6 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
                    {course.progress !== undefined ? 'Продолжить' : 'Начать'}
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
