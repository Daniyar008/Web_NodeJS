import { useState, useRef, useEffect } from 'react'
import { Bot, ChevronDown, Loader2, Send, Sparkles, X } from 'lucide-react'

/* ── Types ───────────────────────────────────────────────────────────────── */
type Role = 'user' | 'bot'

interface Message {
    id: string
    role: Role
    text: string
    ts: string
}

/* ── Response bank ───────────────────────────────────────────────────────── */
const RESPONSE_BANK: { patterns: string[]; answers: string[] }[] = [
    {
        patterns: ['привет', 'здравствуй', 'добрый', 'доброе', 'hi', 'hello', 'йо', 'хай'],
        answers: [
            'Привет! Я EduBuddy 🤖 — ваш AI-помощник по учёбе. Задайте любой вопрос!',
            'Здравствуйте! Готов помочь с учёбой. С чего начнём?',
        ],
    },
    {
        patterns: ['математик', 'интеграл', 'уравнени', 'формул', 'теорем', 'алгебр', 'геометр'],
        answers: [
            'Математика — отличная тема! 📐 Разбейте задачу на шаги: выпишите дано, найдите подходящую формулу и применяйте её последовательно.',
            'При решении математических задач главное — понять, что именно ищется. Покажите условие, и я объясню алгоритм решения!',
        ],
    },
    {
        patterns: ['физик', 'ньютон', 'сила', 'ускорени', 'электр', 'магнит'],
        answers: [
            'В физике важно работать с единицами измерения — всегда переводите в СИ перед подстановкой в формулу. ⚡',
            'Попробуйте нарисовать схему задачи: силы, векторы, тела. Визуализация сильно помогает в физике!',
        ],
    },
    {
        patterns: ['химия', 'реакци', 'валентност', 'элемент', 'молекул', 'атом'],
        answers: [
            'В химии ключ — понять логику периодической таблицы. Группа и период сразу подскажут свойства элемента. 🧪',
            'При расстановке коэффициентов в реакциях используйте метод электронного баланса — это самый универсальный способ!',
        ],
    },
    {
        patterns: ['история', 'война', 'революци', 'дата', 'событи', 'эпох'],
        answers: [
            'Для запоминания дат попробуйте метод ассоциаций: свяжите год с чем-то личным или создайте смешную историю. 📜',
            'В истории важен контекст: почему событие произошло, каковы причины и последствия. Понимание лучше зубрёжки!',
        ],
    },
    {
        patterns: ['литератур', 'сочинени', 'роман', 'герой', 'анализ', 'книг'],
        answers: [
            'При анализе произведения всегда связывайте поступки героев с историческим контекстом — это даёт глубину ответу. 📚',
            'Структура хорошего сочинения: тезис → аргументы из текста → вывод. Не забывайте цитировать!',
        ],
    },
    {
        patterns: ['английск', 'english', 'слов', 'грамматик', 'топик', 'эссе'],
        answers: [
            'Для улучшения английского слушайте подкасты или смотрите сериалы с субтитрами — погружение работает лучше зубрёжки! 🎧',
            'В эссе на английском: введение (hook + thesis), 2-3 абзаца body, заключение. Используйте linking words — however, moreover, therefore. ✍️',
        ],
    },
    {
        patterns: ['тест', 'экзамен', 'готовить', 'подготов', 'проверочн'],
        answers: [
            'Для подготовки к тесту используйте метод интервальных повторений: повторяйте через 1 день, затем через 3, затем через 7. 📅',
            'Советую: просмотрите все темы, выделите слабые места, сосредоточьтесь на них. И делайте перерывы каждые 25 минут — техника Помодоро! ⏱️',
        ],
    },
    {
        patterns: ['домашн', 'задани', 'homework', 'дз'],
        answers: [
            'Начинайте с самых сложных задач, пока энергии больше всего. Разбейте большое задание на маленькие части и отдыхайте после каждой. 💪',
            'Выполняйте домашнее задание в одно и то же время каждый день — это помогает выработать полезную привычку!',
        ],
    },
    {
        patterns: ['мотив', 'устал', 'не хочу', 'скучно', 'лень', 'не могу'],
        answers: [
            'Понимаю! Попробуйте вознаградить себя после выполнения задания — маленькие победы складываются в большой успех! 🌟',
            'Вспомните свою цель — зачем вы учитесь. Даже небольшие ежедневные усилия через несколько лет дадут огромный результат. Вы справитесь! 💪',
        ],
    },
    {
        patterns: ['расписани', 'урок', 'занятие', 'пара', 'когда'],
        answers: [
            'Расписание занятий можно просмотреть в разделе «Расписание» в боковом меню. Там отображены все предстоящие уроки по дням! 📅',
        ],
    },
    {
        patterns: ['оценк', 'бал', 'отметк', 'gpa', 'успеваемост'],
        answers: [
            'Оценки и успеваемость отображаются в вашем профиле, вкладка «Успеваемость». Там можно отследить динамику по каждому предмету! 📊',
        ],
    },
    {
        patterns: ['задач', 'планировщик', 'канбан', 'task'],
        answers: [
            'Для управления задачами перейдите в раздел «Задачи» в боковом меню — там есть удобный Канбан-доска! 📋',
        ],
    },
    {
        patterns: ['спасибо', 'благодар', 'thanks', 'thank'],
        answers: [
            'Всегда пожалуйста! 😊 Обращайтесь, если ещё что-то понадобится.',
            'Рад помочь! Удачи с учёбой! 🍀',
        ],
    },
]

const DEFAULT_ANSWERS = [
    'Хороший вопрос! Уточните, по какому предмету или теме вам нужна помощь, и я постараюсь помочь подробнее.',
    'Понял ваш запрос! Расскажите, с каким предметом возникли сложности, и мы разберёмся вместе.',
    'Конечно, помогу разобраться! Напишите чуть подробнее — что именно вызывает затруднение?',
]

const QUICK_PROMPTS = [
    'Помоги с домашним заданием',
    'Как готовиться к тесту?',
    'Объясни тему',
    'Мотивируй меня',
]

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getResponse(input: string): string {
    const lower = input.toLowerCase()
    for (const group of RESPONSE_BANK) {
        if (group.patterns.some(p => lower.includes(p))) {
            return group.answers[Math.floor(Math.random() * group.answers.length)]
        }
    }
    return DEFAULT_ANSWERS[Math.floor(Math.random() * DEFAULT_ANSWERS.length)]
}

const now = () =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const genId = () => Math.random().toString(36).slice(2, 9)

const WELCOME: Message = {
    id: 'welcome',
    role: 'bot',
    text: 'Привет! Я EduBuddy 🤖 — ваш AI-помощник по учёбе. Задайте любой вопрос или выберите подсказку ниже!',
    ts: now(),
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function EduBuddy() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([WELCOME])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typing])

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 220)
    }, [open])

    const send = (text: string) => {
        if (!text.trim() || typing) return
        const userMsg: Message = { id: genId(), role: 'user', text: text.trim(), ts: now() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setTyping(true)
        setTimeout(() => {
            setTyping(false)
            const botMsg: Message = { id: genId(), role: 'bot', text: getResponse(text), ts: now() }
            setMessages(prev => [...prev, botMsg])
        }, 850 + Math.random() * 550)
    }

    const showQuickPrompts = messages.length <= 1 && !typing

    return (
        <>
            {/* ── Floating action button ── */}
            <button
                type="button"
                className={`buddy-fab${open ? ' open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label="EduBuddy AI помощник"
                title="EduBuddy AI"
            >
                {open ? <ChevronDown size={22} /> : <Sparkles size={22} />}
            </button>

            {/* ── Chat panel ── */}
            <div
                className={`buddy-panel${open ? ' open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="EduBuddy AI помощник"
            >
                {/* Header */}
                <div className="buddy-header">
                    <div className="buddy-header-info">
                        <div className="buddy-avatar">
                            <Bot size={18} />
                        </div>
                        <div>
                            <p className="buddy-name">EduBuddy AI</p>
                            <p className="buddy-status">Онлайн · всегда готов помочь</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="buddy-close-btn"
                        onClick={() => setOpen(false)}
                        aria-label="Закрыть EduBuddy"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div className="buddy-messages">
                    {messages.map(m => (
                        <div key={m.id} className={`buddy-bubble-row${m.role === 'user' ? ' user' : ''}`}>
                            {m.role === 'bot' && (
                                <div className="buddy-bot-icon" aria-hidden="true">
                                    <Bot size={14} />
                                </div>
                            )}
                            <div className="buddy-bubble-wrap">
                                <div className={`buddy-bubble${m.role === 'user' ? ' user' : ''}`}>
                                    {m.text}
                                </div>
                                <span className="buddy-ts">{m.ts}</span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {typing && (
                        <div className="buddy-bubble-row">
                            <div className="buddy-bot-icon" aria-hidden="true">
                                <Bot size={14} />
                            </div>
                            <div className="buddy-bubble-wrap">
                                <div className="buddy-bubble">
                                    <div className="buddy-typing-dots" aria-label="EduBuddy печатает">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Quick prompts (show only at start) */}
                {showQuickPrompts && (
                    <div className="buddy-quick-prompts">
                        {QUICK_PROMPTS.map(q => (
                            <button
                                key={q}
                                type="button"
                                className="buddy-quick-btn"
                                onClick={() => send(q)}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input bar */}
                <div className="buddy-input-bar">
                    <input
                        ref={inputRef}
                        className="buddy-input"
                        placeholder="Задайте вопрос..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                send(input)
                            }
                        }}
                        aria-label="Сообщение EduBuddy"
                    />
                    <button
                        type="button"
                        className="buddy-send-btn"
                        onClick={() => send(input)}
                        disabled={!input.trim() || typing}
                        aria-label="Отправить"
                    >
                        {typing
                            ? <Loader2 size={15} style={{ animation: 'buddy-spin 1s linear infinite' }} />
                            : <Send size={15} />
                        }
                    </button>
                </div>
            </div>
        </>
    )
}
