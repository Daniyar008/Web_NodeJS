import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'

/* ── Questions ─────────────────────────────────────────────────── */
interface Question {
    id: number
    text: string
    options: { text: string; trait: string }[]
}

// Each answer maps to a trait: A=Analyse, C=Creative, S=Social, T=Tech, B=Business, N=Nature
const QUESTIONS: Question[] = [
    {
        id: 1,
        text: 'Как вы предпочитаете решать сложные проблемы?',
        options: [
            { text: 'Анализирую данные и ищу закономерности', trait: 'A' },
            { text: 'Придумываю нестандартные решения', trait: 'C' },
            { text: 'Обсуждаю с командой и прихожу к консенсусу', trait: 'S' },
            { text: 'Пишу код или использую технологии', trait: 'T' },
        ],
    },
    {
        id: 2,
        text: 'Что вам нравится делать в свободное время?',
        options: [
            { text: 'Читать книги и учиться новому', trait: 'A' },
            { text: 'Рисовать, создавать, проектировать', trait: 'C' },
            { text: 'Общаться с друзьями, волонтёрить', trait: 'S' },
            { text: 'Собирать гаджеты, программировать', trait: 'T' },
        ],
    },
    {
        id: 3,
        text: 'Какие предметы вам даются легче всего?',
        options: [
            { text: 'Математика и точные науки', trait: 'A' },
            { text: 'Искусство, музыка, литература', trait: 'C' },
            { text: 'Обществознание, история, языки', trait: 'S' },
            { text: 'Информатика и физика', trait: 'T' },
        ],
    },
    {
        id: 4,
        text: 'В каком рабочем окружении вы чувствуете себя лучше?',
        options: [
            { text: 'Тихий офис, самостоятельная работа', trait: 'A' },
            { text: 'Творческая студия, открытое пространство', trait: 'C' },
            { text: 'Работа с людьми, командный офис', trait: 'S' },
            { text: 'Лаборатория, технологическое пространство', trait: 'T' },
        ],
    },
    {
        id: 5,
        text: 'Что вас больше мотивирует в работе?',
        options: [
            { text: 'Поиск ответов и решение загадок', trait: 'A' },
            { text: 'Создание красивых и значимых вещей', trait: 'C' },
            { text: 'Помощь другим и изменение жизни к лучшему', trait: 'S' },
            { text: 'Создание новых технологий и систем', trait: 'T' },
        ],
    },
    {
        id: 6,
        text: 'Как вы лучше воспринимаете информацию?',
        options: [
            { text: 'Через цифры, таблицы и графики', trait: 'A' },
            { text: 'Через образы, символы и аналогии', trait: 'C' },
            { text: 'Через истории, примеры из жизни', trait: 'S' },
            { text: 'Через практические эксперименты', trait: 'T' },
        ],
    },
    {
        id: 7,
        text: 'Какую роль вы обычно занимаете в группе?',
        options: [
            { text: 'Аналитик — ищу факты и проверяю идеи', trait: 'A' },
            { text: 'Генератор идей — придумываю решения', trait: 'C' },
            { text: 'Координатор — сплачиваю команду', trait: 'S' },
            { text: 'Технический исполнитель — делаю', trait: 'T' },
        ],
    },
    {
        id: 8,
        text: 'Каким вы видите своё будущее через 10 лет?',
        options: [
            { text: 'Учёный или исследователь в своей области', trait: 'A' },
            { text: 'Создатель — режиссёр, дизайнер, архитектор', trait: 'C' },
            { text: 'Руководитель социальных проектов или учитель', trait: 'S' },
            { text: 'Инженер или разработчик передовых технологий', trait: 'T' },
        ],
    },
    {
        id: 9,
        text: 'Что вас больше привлекает в будущей карьере?',
        options: [
            { text: 'Высокая зарплата и стабильность', trait: 'B' },
            { text: 'Возможность самовыражения', trait: 'C' },
            { text: 'Общественная значимость', trait: 'S' },
            { text: 'Возможность менять мир технологиями', trait: 'T' },
        ],
    },
    {
        id: 10,
        text: 'Вы предпочитаете работать с…',
        options: [
            { text: 'Данными и числами', trait: 'A' },
            { text: 'Идеями и концепциями', trait: 'C' },
            { text: 'Людьми и командами', trait: 'S' },
            { text: 'Кодом и машинами', trait: 'T' },
        ],
    },
    {
        id: 11,
        text: 'Какое занятие вас не утомляет, даже если вы занимаетесь много часов?',
        options: [
            { text: 'Изучение и анализ сложных тем', trait: 'A' },
            { text: 'Рисование, написание текстов, музыка', trait: 'C' },
            { text: 'Помощь и обучение других', trait: 'S' },
            { text: 'Кодинг, сборка, эксперименты', trait: 'T' },
        ],
    },
    {
        id: 12,
        text: 'Что первое приходит в голову, когда вы слышите слово «успех»?',
        options: [
            { text: 'Научное открытие или важное исследование', trait: 'A' },
            { text: 'Признания и знаменитость в творческой сфере', trait: 'C' },
            { text: 'Благодарность и влияние на жизни людей', trait: 'S' },
            { text: 'Продукт, которым пользуются миллионы', trait: 'T' },
        ],
    },
]

/* ── Profiles ──────────────────────────────────────────────────── */
interface CareerProfile {
    trait: string
    title: string
    emoji: string
    desc: string
    careers: { emoji: string; title: string }[]
    unis: string[]
    traits: string[]
    color: string
}

const PROFILES: Record<string, CareerProfile> = {
    A: {
        trait: 'A', emoji: '🔬', title: 'Аналитик-исследователь',
        desc: 'Вы обладаете острым умом, любите работать с данными и искать скрытые закономерности. Ваши сильные стороны — логика, внимание к деталям и способность решать сложные задачи.',
        careers: [
            { emoji: '📊', title: 'Data Scientist' },
            { emoji: '🔬', title: 'Учёный-исследователь' },
            { emoji: '📈', title: 'Финансовый аналитик' },
            { emoji: '🧮', title: 'Экономист' },
        ],
        unis: ['НУ', 'КазНУ', 'KBTU'],
        traits: ['Логическое мышление', 'Аналитика', 'Точность', 'Любознательность'],
        color: '#3b82f6',
    },
    C: {
        trait: 'C', emoji: '🎨', title: 'Творческий новатор',
        desc: 'Вы мыслите образами и концепциями, умеете создавать что-то из ничего. Ваши сильные стороны — оригинальность, воображение и способность видеть мир через другую призму.',
        careers: [
            { emoji: '🎨', title: 'UX/UI Дизайнер' },
            { emoji: '🎬', title: 'Режиссёр' },
            { emoji: '✍️', title: 'Контент-мейкер' },
            { emoji: '🏛️', title: 'Архитектор' },
        ],
        unis: ['НУ', 'KazArtDes', 'SDU'],
        traits: ['Креативность', 'Визуальное мышление', 'Оригинальность'],
        color: '#db2777',
    },
    S: {
        trait: 'S', emoji: '🤝', title: 'Социальный лидер',
        desc: 'Вы умеете работать с людьми: слышать, мотивировать, объединять. Ваши сильные стороны — empathy, коммуникация и желание изменить общество к лучшему.',
        careers: [
            { emoji: '👩‍🏫', title: 'Педагог' },
            { emoji: '⚖️', title: 'Юрист' },
            { emoji: '🧑‍⚕️', title: 'Психолог' },
            { emoji: '🌍', title: 'Менеджер НПО' },
        ],
        unis: ['КазНУ', 'НУ', 'МУИТ'],
        traits: ['Эмпатия', 'Лидерство', 'Коммуникация', 'Организаторские способности'],
        color: '#10b981',
    },
    T: {
        trait: 'T', emoji: '💻', title: 'Технический инженер',
        desc: 'Вы мыслите системно и любите разбираться в том, как всё работает. Ваши сильные стороны — инженерное мышление, алгоритмизация и нацеленность на результат.',
        careers: [
            { emoji: '💻', title: 'Software Engineer' },
            { emoji: '🤖', title: 'AI/ML Engineer' },
            { emoji: '🔒', title: 'Кибербезопасность' },
            { emoji: '⚙️', title: 'DevOps инженер' },
        ],
        unis: ['МУИТ', 'KBTU', 'НУ', 'Satbayev'],
        traits: ['Системное мышление', 'Алгоритмика', 'Внимание к деталям'],
        color: '#7c3aed',
    },
    B: {
        trait: 'B', emoji: '💼', title: 'Бизнес-стратег',
        desc: 'Вы ориентированы на результат и умеете видеть деловые возможности. Ваши сильные стороны — стратегическое мышление, предприимчивость и нацеленность на победу.',
        careers: [
            { emoji: '💼', title: 'Предприниматель' },
            { emoji: '📊', title: 'Менеджер проектов' },
            { emoji: '🏦', title: 'Финансовый директор' },
            { emoji: '🌐', title: 'Бизнес-аналитик' },
        ],
        unis: ['НУ', 'SDU', 'KIMEP'],
        traits: ['Стратегическое мышление', 'Риск-менеджмент', 'Лидерство'],
        color: '#f59e0b',
    },
}

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function ProforientationPage({ language, onLanguageChange }: Props) {
    const [step, setStep] = useState(0)       // 0 = intro, 1..N = questions, N+1 = results
    const [answers, setAnswers] = useState<Record<number, string>>({}) // qId → trait

    const total = QUESTIONS.length
    const q = step >= 1 && step <= total ? QUESTIONS[step - 1] : null
    const answered = answers[q?.id ?? 0]

    const handleAnswer = (trait: string) => {
        if (!q) return
        setAnswers(prev => ({ ...prev, [q.id]: trait }))
    }

    const next = () => setStep(s => s + 1)
    const prev = () => setStep(s => Math.max(1, s - 1))

    const reset = () => { setStep(0); setAnswers({}) }

    /* Compute result */
    const tally = Object.values(answers).reduce<Record<string, number>>((acc, t) => {
        acc[t] = (acc[t] || 0) + 1
        return acc
    }, {})

    const sorted = Object.entries(tally)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    const topTrait = sorted[0]?.[0] ?? 'T'
    const topProfile = PROFILES[topTrait] ?? PROFILES['T']

    const showResults = step > total

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Профориентация"
            activePage="proftest"
        >
            <div className="prof-page">

                {/* Hero */}
                <div className="prof-hero">
                    <h1>🧭 Тест на профориентацию</h1>
                    <p>12 вопросов помогут определить вашу профессиональную траекторию и подходящие специальности</p>
                    <div className="prof-hero-meta">
                        <span className="prof-hero-tag">⏱ 5–7 минут</span>
                        <span className="prof-hero-tag">12 вопросов</span>
                        <span className="prof-hero-tag">Научная основа: RIASEC</span>
                    </div>
                </div>

                {/* Intro screen */}
                {step === 0 && (
                    <div className="prof-q-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
                        <div style={{ fontSize: 56, marginBottom: 20 }}>🎯</div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', marginBottom: 10 }}>
                            Узнайте свой профессиональный тип
                        </h2>
                        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
                            Этот тест основан на научных методологиях. Отвечайте честно — нет правильных или неправильных ответов. Результат поможет вам выбрать направление обучения и специальность.
                        </p>
                        <button type="button" className="prof-btn primary" style={{ padding: '13px 36px', fontSize: 15 }} onClick={() => setStep(1)}>
                            Начать тест →
                        </button>
                    </div>
                )}

                {/* Question screen */}
                {q && !showResults && (
                    <>
                        <div className="prof-progress-bar">
                            <span className="prof-prog-label">Прогресс</span>
                            <div className="prof-prog-track">
                                <div className="prof-prog-fill" style={{ width: `${((step - 1) / total) * 100}%` }} />
                            </div>
                            <span className="prof-prog-steps">{step} / {total}</span>
                        </div>

                        <div className="prof-q-card">
                            <div className="prof-q-num">Вопрос {step} из {total}</div>
                            <div className="prof-q-text">{q.text}</div>
                            <div className="prof-options">
                                {q.options.map(opt => (
                                    <button
                                        key={opt.trait}
                                        type="button"
                                        className={`prof-option${answered === opt.trait ? ' selected' : ''}`}
                                        onClick={() => handleAnswer(opt.trait)}
                                    >
                                        <span className="prof-option-radio" />
                                        <span className="prof-option-text">{opt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="prof-nav-row">
                            <button type="button" className="prof-btn secondary" onClick={prev} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ChevronLeft size={16} /> Назад
                            </button>
                            <button
                                type="button"
                                className="prof-btn primary"
                                disabled={!answered}
                                style={{ opacity: answered ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}
                                onClick={next}
                            >
                                {step === total ? 'Получить результат' : 'Далее'}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </>
                )}

                {/* Results screen */}
                {showResults && (
                    <div className="prof-results-card">
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <div style={{ fontSize: 60, marginBottom: 14 }}>{topProfile.emoji}</div>
                            <div className="prof-results-title">Ваш тип: {topProfile.title}</div>
                            <div className="prof-results-sub">{topProfile.desc}</div>
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1f2937', marginBottom: 14 }}>
                            🎯 Подходящие карьеры
                        </h3>
                        <div className="prof-career-grid">
                            {topProfile.careers.map((c, i) => (
                                <div
                                    key={c.title}
                                    className={`prof-career-card${i === 0 ? ' top' : ''}`}
                                    style={{ background: i === 0 ? '#eff6ff' : '#f8fafc' }}
                                >
                                    <span className="prof-career-emoji">{c.emoji}</span>
                                    <div className="prof-career-name">{c.title}</div>
                                    <div className="prof-career-match" style={{ color: topProfile.color }}>
                                        {95 - i * 7}% совпадение
                                    </div>
                                    <div className="prof-career-bar">
                                        <div className="prof-career-fill" style={{ width: `${95 - i * 7}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1f2937', margin: '20px 0 12px' }}>
                            🏛️ Рекомендуемые вузы
                        </h3>
                        <div className="prof-traits" style={{ marginBottom: 20 }}>
                            {topProfile.unis.map(u => (
                                <span key={u} className="prof-trait" style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 12 }}>
                                    🎓 {u}
                                </span>
                            ))}
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1f2937', margin: '0 0 10px' }}>
                            ✨ Ваши сильные черты
                        </h3>
                        <div className="prof-traits">
                            {topProfile.traits.map(t => (
                                <span key={t} className="prof-trait">{t}</span>
                            ))}
                        </div>

                        {/* Secondary matches */}
                        {sorted.slice(1).length > 0 && (
                            <>
                                <h3 style={{ fontSize: 13, fontWeight: 800, color: '#6b7280', margin: '20px 0 10px' }}>
                                    Дополнительные совпадения
                                </h3>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {sorted.slice(1).map(([t]) => {
                                        const p = PROFILES[t]
                                        if (!p) return null
                                        return (
                                            <div key={t} style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e8eaf0', borderRadius: 14, padding: '12px 14px', textAlign: 'center' }}>
                                                <div style={{ fontSize: 24 }}>{p.emoji}</div>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginTop: 4 }}>{p.title}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}

                        <button type="button" className="prof-retake-btn" style={{ marginTop: 24 }} onClick={reset}>
                            <RotateCcw size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                            Пройти тест заново
                        </button>
                    </div>
                )}
            </div>
        </CourseShellLayout>
    )
}
