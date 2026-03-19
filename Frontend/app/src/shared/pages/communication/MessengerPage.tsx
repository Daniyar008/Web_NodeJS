import { PageHeader } from '../../ui/PageHeader'

const CHATS = [
  { id: 1, name: 'Анна Макарова', role: 'Учитель математики', lastMsg: 'ДЗ проверено, отличная работа!', time: '10:45', unread: 2, online: true },
  { id: 2, name: 'Родительский комитет', role: 'Группа 8А', lastMsg: 'Собрание завтра в 18:00', time: '09:20', unread: 0, online: false },
  { id: 3, name: 'EduBuddy', role: 'AI-ассистент', lastMsg: 'Как я могу помочь тебе сегодня?', time: 'Вчера', unread: 0, online: true, isAi: true },
]

export function MessengerPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-8">
      {/* Left: Chats List */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6 flex-shrink-0">
         <PageHeader title="Сообщения" breadcrumbs={[{ label: 'Связь' }]} />
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100">
               <div className="relative">
                  <input className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Поиск диалогов..." />
                  <svg className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {CHATS.map(chat => (
                  <button key={chat.id} className={`w-full p-6 text-left rounded-[32px] transition-all flex items-center justify-between group ${chat.id === 1 ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white hover:bg-slate-50'}`}>
                     <div className="flex items-center gap-5 min-w-0">
                        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl relative flex-shrink-0 ${chat.isAi ? 'bg-gradient-to-tr from-[#06b6d4] to-primary text-white' : 'bg-slate-100'}`}>
                           {chat.isAi ? '🤖' : chat.name[0]}
                           {chat.online && <div className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${chat.id === 1 ? 'bg-emerald-400' : 'bg-emerald-500'}`} />}
                        </div>
                        <div className="min-w-0">
                           <div className={`text-base font-black tracking-tight truncate ${chat.id === 1 ? 'text-white' : 'text-slate-900 group-hover:text-primary transition-colors'}`}>{chat.name}</div>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 truncate ${chat.id === 1 ? 'text-white/60' : 'text-slate-400'}`}>{chat.lastMsg}</p>
                        </div>
                     </div>
                     <div className="text-right flex-shrink-0 ml-4">
                        <div className={`text-[9px] font-black uppercase tracking-widest ${chat.id === 1 ? 'text-white/40' : 'text-slate-300'}`}>{chat.time}</div>
                        {chat.unread > 0 && <div className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[9px] font-black ${chat.id === 1 ? 'bg-white text-primary' : 'bg-primary text-white'}`}>{chat.unread}</div>}
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Right: Message Window */}
      <div className="flex-1 flex flex-col bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
         
         {/* Detail Header */}
         <div className="relative p-8 px-10 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg">А</div>
               <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Анна Макарова</h4>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">• В сети</p>
               </div>
            </div>
            <div className="flex gap-3">
               <button className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:bg-white hover:border-primary/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               </button>
               <button className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:bg-white hover:border-primary/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
               </button>
            </div>
         </div>

         {/* Messages Area */}
         <div className="relative flex-1 overflow-y-auto p-10 space-y-10 z-0">
            <div className="flex justify-center">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-100">Сегодня</span>
            </div>
            
            <div className="flex gap-4 max-w-[80%]">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-black text-xs text-slate-400">А</div>
               <div className="space-y-2">
                  <div className="p-6 bg-white rounded-[32px] rounded-tl-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                     Привет, Данияр! Я посмотрела твое решение уравнений по математике. 
                     Блестящая работа, особенно во второй части.
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pl-2">10:42</div>
               </div>
            </div>

            <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
               <div className="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center font-black text-xs text-white">Д</div>
               <div className="space-y-2 items-end flex flex-col">
                  <div className="p-6 bg-primary rounded-[32px] rounded-tr-lg shadow-xl shadow-primary/20 text-sm font-medium text-white leading-relaxed">
                     Спасибо большое! Квантовая физика помогла мне лучше понять теорию вероятностей.
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pr-2">10:44</div>
               </div>
            </div>

            <div className="flex gap-4 max-w-[80%]">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-black text-xs text-slate-400">А</div>
               <div className="space-y-2">
                  <div className="p-6 bg-white rounded-[32px] rounded-tl-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                     ДЗ проверено, отличная работа! Заходи по ссылке на новый модуль.
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pl-2">10:45</div>
               </div>
            </div>
         </div>

         {/* Input Area */}
         <div className="relative p-8 px-10 bg-white border-t border-slate-100 z-10">
            <div className="flex items-center gap-4">
               <button className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
               </button>
               <input className="flex-1 h-14 px-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:bg-white" placeholder="Напишите сообщение..." />
               <button className="h-14 px-8 rounded-[24px] bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                  Отправить
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
