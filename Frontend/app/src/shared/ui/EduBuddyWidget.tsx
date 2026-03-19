import { useState } from 'react'

export function EduBuddyWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[400px] h-[600px] bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-8 bg-gradient-to-tr from-[#06b6d4] to-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-md">🤖</div>
               <div>
                  <h4 className="text-lg font-black tracking-tight">EduBuddy AI</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Ваш личный ассистент</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="p-5 bg-white rounded-[24px] rounded-tl-lg shadow-sm border border-slate-100 text-[13px] font-medium text-slate-600 leading-relaxed">
                   Привет! Я EduBuddy. Чем я могу помочь тебе с учебой сегодня? 🚀
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-3 pt-4">
                {[
                  'Объясни квантовую запутанность',
                  'Когда у меня ближайший тест?',
                  'Помоги с домашним заданием',
                  'Как повысить мой уровень XP?',
                ].map(q => (
                   <button key={q} className="p-4 rounded-2xl bg-white border border-slate-100 text-[11px] font-bold text-slate-500 text-left hover:border-primary hover:text-primary transition-all shadow-sm">
                      {q}
                   </button>
                ))}
             </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 flex items-center gap-4">
             <input className="flex-1 h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Спросите о чем-нибудь..." />
             <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
             </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[30px] shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-primary shadow-primary/40'}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <span className="animate-pulse">🤖</span>
        )}
        {!isOpen && (
           <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 border-4 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white">1</div>
        )}
      </button>
    </div>
  )
}
