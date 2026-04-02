import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    BookOpen,
    Shield,
    Zap,
    Settings,
    Code,
    Building2,
    ChevronDown,
    ArrowRight,
    LifeBuoy,
    FileText,
    Mail,
    MessageCircle,
    Send,
    HelpCircle,
    X,
    ExternalLink,
} from 'lucide-react'

const CATEGORIES = [
    { id: 'all',        label: 'Все статьи',       Icon: HelpCircle,  count: 35 },
    { id: 'start',      label: 'Начало работы',     Icon: BookOpen,    count: 8  },
    { id: 'auth',       label: 'Аутентификация',    Icon: Shield,      count: 5  },
    { id: 'billing',    label: 'Оплата и тарифы',   Icon: Zap,         count: 6  },
    { id: 'settings',   label: 'Настройки',         Icon: Settings,    count: 9  },
    { id: 'api',        label: 'API и интеграции',  Icon: Code,        count: 4  },
    { id: 'enterprise', label: 'Enterprise',        Icon: Building2,   count: 3  },
]

const ARTICLES = [
    { id: 1,  cat: 'start',      title: 'Быстрый старт',                      excerpt: 'Зарегистрируйтесь и начните первый курс за 5 минут',                   readTime: '3 мин', Icon: BookOpen   },
    { id: 2,  cat: 'start',      title: 'Навигация по платформе',              excerpt: 'Обзор всех разделов панели студента и их назначение',                  readTime: '5 мин', Icon: BookOpen   },
    { id: 3,  cat: 'start',      title: 'Настройка профиля',                  excerpt: 'Загрузите фото, заполните информацию о себе',                          readTime: '2 мин', Icon: BookOpen   },
    { id: 4,  cat: 'start',      title: 'Первый курс: от записи до диплома',  excerpt: 'Пошаговый путь студента через структуру курса',                         readTime: '6 мин', Icon: BookOpen   },
    { id: 5,  cat: 'auth',       title: 'Сброс пароля',                       excerpt: 'Шаги для восстановления доступа к аккаунту',                           readTime: '2 мин', Icon: Shield     },
    { id: 6,  cat: 'auth',       title: 'Двухфакторная аутентификация',       excerpt: 'Как включить 2FA для защиты аккаунта',                                 readTime: '4 мин', Icon: Shield     },
    { id: 7,  cat: 'auth',       title: 'Управление сессиями',                excerpt: 'Просмотр активных устройств и завершение сессий',                       readTime: '3 мин', Icon: Shield     },
    { id: 8,  cat: 'billing',    title: 'Тарифные планы',                     excerpt: 'Сравнение Free, Pro и Enterprise тарифов',                             readTime: '3 мин', Icon: Zap        },
    { id: 9,  cat: 'billing',    title: 'Способы оплаты',                     excerpt: 'Принимаемые карты и банковские переводы',                               readTime: '2 мин', Icon: Zap        },
    { id: 10, cat: 'billing',    title: 'Возврат средств',                    excerpt: 'Условия и сроки возврата платежей',                                     readTime: '3 мин', Icon: Zap        },
    { id: 11, cat: 'settings',   title: 'Уведомления',                       excerpt: 'Управление всеми типами push и email уведомлений',                     readTime: '3 мин', Icon: Settings   },
    { id: 12, cat: 'settings',   title: 'Язык и регион',                     excerpt: 'Смена языка интерфейса на RU / EN / KZ',                               readTime: '1 мин', Icon: Settings   },
    { id: 13, cat: 'settings',   title: 'Конфиденциальность',                excerpt: 'Настройки видимости профиля и данных',                                  readTime: '4 мин', Icon: Settings   },
    { id: 14, cat: 'api',        title: 'REST API — начало',                  excerpt: 'Получите API ключ и сделайте первый запрос',                            readTime: '7 мин', Icon: Code       },
    { id: 15, cat: 'api',        title: 'Webhooks',                           excerpt: 'Настройка уведомлений о событиях через webhook',                       readTime: '5 мин', Icon: Code       },
    { id: 16, cat: 'enterprise', title: 'SSO и LDAP',                        excerpt: 'Интеграция с корпоративными системами авторизации',                     readTime: '10 мин', Icon: Building2 },
    { id: 17, cat: 'enterprise', title: 'Массовое добавление пользователей', excerpt: 'Импорт пользователей через CSV или API',                                readTime: '8 мин', Icon: Building2  },
]

const FAQS = [
    { q: 'Как сбросить пароль?',                                              a: 'Перейдите на страницу входа и нажмите «Забыли пароль?». Введите email — вам придёт письмо со ссылкой для сброса.',                                    cat: 'auth'     },
    { q: 'Можно ли использовать один аккаунт на нескольких устройствах?',     a: 'Да, ваш аккаунт доступен с любых устройств. Авторизуйтесь с теми же данными — прогресс синхронизируется автоматически.',                               cat: 'start'    },
    { q: 'Как удалить учётную запись?',                                       a: 'Перейдите в Настройки → Безопасность → Удалить аккаунт. Данные удаляются в течение 30 дней.',                                                          cat: 'settings' },
    { q: 'Что включено в бесплатный тариф?',                                  a: 'Free-план включает: 5 курсов, базовый AI-ассистент, квизы и участие в турнирах без ограничений.',                                                      cat: 'billing'  },
    { q: 'Как настроить API интеграцию?',                                     a: 'В разделе Настройки → API скопируйте ваш ключ. Документация с примерами запросов доступна в разделе /docs/api.',                                       cat: 'api'      },
    { q: 'Как добавить ребёнка в родительский аккаунт?',                      a: 'В дашборде родителя нажмите «+ Добавить ребёнка» и введите его учётные данные или пригласительный код.',                                             cat: 'start'    },
    { q: 'Можно ли получить возврат денег?',                                  a: 'Да, в течение 14 дней после оплаты. Создайте тикет в поддержку с номером заказа — мы вернём средства в течение 3–5 рабочих дней.',                   cat: 'billing'  },
    { q: 'Как включить двухфакторную аутентификацию?',                        a: 'Перейдите в Настройки → Безопасность → 2FA. Выберите приложение-аутентификатор (Google Authenticator или аналог) и насканируйте QR-код.',             cat: 'auth'     },
]

export function HelpPage() {
    const navigate = useNavigate()
    const [activeCat, setActiveCat] = useState('all')
    const [searchQ, setSearchQ]     = useState('')
    const [openFaq, setOpenFaq]     = useState<number | null>(null)
    const [faqCat, setFaqCat]       = useState('all')
    const [supportOpen, setSupportOpen] = useState(false)
    const [ticketMode, setTicketMode]   = useState(false)
    const [ticketForm, setTicketForm]   = useState({ name: '', email: '', subject: '', message: '' })
    const [ticketSent, setTicketSent]   = useState(false)

    function openSupport() { setSupportOpen(true); setTicketMode(false); setTicketSent(false) }
    function closeSupport() { setSupportOpen(false); setTicketMode(false); setTicketSent(false) }
    function sendTicket(e: React.FormEvent) {
        e.preventDefault()
        // In production this would POST to an API
        setTicketSent(true)
    }

    const filtered = ARTICLES.filter(a => {
        const matchCat = activeCat === 'all' || a.cat === activeCat
        const q = searchQ.toLowerCase()
        const matchQ = q === '' || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
        return matchCat && matchQ
    })

    const filteredFaqs = FAQS.filter(f => faqCat === 'all' || f.cat === faqCat)

    return (
        <div className="hp-root">

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <section className="hp-hero">
                <button type="button" className="hp-back-btn" onClick={() => navigate(-1)}>
                    ← Назад
                </button>
                <div className="hp-hero-badge"><LifeBuoy size={14} /> Центр поддержки</div>
                <h1 className="hp-hero-title">Как мы можем помочь?</h1>
                <p className="hp-hero-sub">Поищите среди статей, гайдов и популярных вопросов</p>

                <form className="hp-search-form" onSubmit={e => e.preventDefault()}>
                    <div className="hp-search-inner">
                        <Search size={18} className="hp-search-icon" />
                        <input
                            className="hp-search-input"
                            placeholder="Поиск по статьям..."
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                        />
                        {searchQ && (
                            <button type="button" className="hp-search-clear" onClick={() => setSearchQ('')}>✕</button>
                        )}
                    </div>
                </form>

                <div className="hp-quick-chips">
                    {CATEGORIES.slice(1).map(c => (
                        <button
                            key={c.id}
                            type="button"
                            className={`hp-chip ${activeCat === c.id ? 'active' : ''}`}
                            onClick={() => setActiveCat(c.id === activeCat ? 'all' : c.id)}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Two-column layout ─────────────────────────────────────────────── */}
            <div className="hp-layout">

                {/* Left: category sidebar */}
                <aside className="hp-sidebar">
                    <p className="hp-sidebar-label">Разделы</p>
                    {CATEGORIES.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            className={`hp-cat-btn ${activeCat === c.id ? 'active' : ''}`}
                            onClick={() => setActiveCat(c.id)}
                        >
                            <c.Icon size={15} />
                            <span>{c.label}</span>
                            <span className="hp-cat-count">{c.count}</span>
                        </button>
                    ))}

                    <div className="hp-sidebar-contact">
                        <LifeBuoy size={18} />
                        <div>
                            <p>Не нашли ответ?</p>
                            <button type="button" onClick={openSupport}>
                                Написать в поддержку →
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right: articles grid */}
                <main className="hp-articles">
                    <div className="hp-articles-head">
                        <p className="hp-articles-count">
                            {filtered.length} {filtered.length === 1 ? 'статья' : filtered.length < 5 ? 'статьи' : 'статей'}
                        </p>
                        {searchQ && (
                            <span className="hp-articles-query">по запросу «{searchQ}»</span>
                        )}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="hp-empty">
                            <HelpCircle size={44} />
                            <p>Ничего не найдено</p>
                            <span>Попробуйте изменить запрос или выбрать другой раздел</span>
                        </div>
                    ) : (
                        <div className="hp-articles-grid">
                            {filtered.map(a => (
                                <div key={a.id} className="hp-article-card">
                                    <div className="hp-article-icon">
                                        <a.Icon size={20} />
                                    </div>
                                    <div className="hp-article-body">
                                        <h3 className="hp-article-title">{a.title}</h3>
                                        <p className="hp-article-excerpt">{a.excerpt}</p>
                                    </div>
                                    <div className="hp-article-footer">
                                        <span className="hp-article-time">⏱ {a.readTime}</span>
                                        <button type="button" className="hp-article-link">
                                            Читать <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

            </div>

            {/* ── FAQ ──────────────────────────────────────────────────────────── */}
            <section className="hp-faq">
                <div className="hp-faq-inner">
                    <h2 className="hp-faq-title">Популярные вопросы</h2>
                    <p className="hp-faq-sub">Ответы на самые частые обращения в поддержку</p>

                    <div className="hp-faq-chips">
                        <button
                            type="button"
                            className={`hp-chip ${faqCat === 'all' ? 'active' : ''}`}
                            onClick={() => setFaqCat('all')}
                        >
                            Все
                        </button>
                        {CATEGORIES.slice(1).map(c => (
                            <button
                                key={c.id}
                                type="button"
                                className={`hp-chip ${faqCat === c.id ? 'active' : ''}`}
                                onClick={() => setFaqCat(c.id)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="hp-faq-list">
                        {filteredFaqs.map((f, i) => (
                            <div key={i} className={`hp-faq-item ${openFaq === i ? 'open' : ''}`}>
                                <button
                                    type="button"
                                    className="hp-faq-q"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span>{f.q}</span>
                                    <ChevronDown size={16} className="hp-faq-chevron" />
                                </button>
                                {openFaq === i && (
                                    <div className="hp-faq-a">{f.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────────── */}
            <section className="hp-cta">
                <div className="hp-cta-inner">
                    <div className="hp-cta-icon"><LifeBuoy size={36} /></div>
                    <h2 className="hp-cta-title">Нужна дополнительная помощь?</h2>
                    <p className="hp-cta-sub">
                        Наша команда поддержки отвечает в течение нескольких часов
                    </p>
                    <div className="hp-cta-btns">
                        <button type="button" className="hp-cta-primary" onClick={openSupport}>
                            <MessageCircle size={16} /> Написать в поддержку
                        </button>
                        <button type="button" className="hp-cta-secondary">
                            <FileText size={16} /> Документация
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <footer className="hp-footer">
                <div className="hp-footer-inner">
                    <p className="hp-footer-brand">EduFuture</p>
                    <div className="hp-footer-links">
                        <button type="button" onClick={() => navigate('/')}>Главная</button>
                        <button type="button" onClick={() => navigate('/about')}>О нас</button>
                        <button type="button" onClick={() => navigate('/courses')}>Курсы</button>
                        <button type="button" onClick={() => navigate('/chat')}>Чат</button>
                    </div>
                    <p className="hp-footer-copy">© 2025 EduFuture. Все права защищены.</p>
                </div>
            </footer>

            {/* ── Support Contact Modal ─────────────────────────────────────────── */}
            {supportOpen && (
                <div className="sp-backdrop" onClick={closeSupport}>
                    <div className="sp-modal" onClick={e => e.stopPropagation()}>
                        <button type="button" className="sp-close" onClick={closeSupport}><X size={18} /></button>

                        {ticketSent ? (
                            <div className="sp-sent">
                                <div className="sp-sent-icon">✅</div>
                                <h3>Тикет отправлен!</h3>
                                <p>Мы ответим в течение 24 часов на указанный email.</p>
                                <button type="button" className="sp-btn-primary" onClick={closeSupport}>Готово</button>
                            </div>
                        ) : ticketMode ? (
                            <>
                                <button type="button" className="sp-back" onClick={() => setTicketMode(false)}>← Назад</button>
                                <h2 className="sp-title">Создать тикет</h2>
                                <p className="sp-sub">Опишите проблему — мы свяжемся с вами</p>
                                <form className="sp-form" onSubmit={sendTicket}>
                                    <div className="sp-field-row">
                                        <div className="sp-field">
                                            <label>Имя</label>
                                            <input required value={ticketForm.name} onChange={e => setTicketForm(f => ({ ...f, name: e.target.value }))} placeholder="Ваше имя" />
                                        </div>
                                        <div className="sp-field">
                                            <label>Email</label>
                                            <input required type="email" value={ticketForm.email} onChange={e => setTicketForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                                        </div>
                                    </div>
                                    <div className="sp-field">
                                        <label>Тема</label>
                                        <input required value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="Кратко опишите проблему" />
                                    </div>
                                    <div className="sp-field">
                                        <label>Сообщение</label>
                                        <textarea required rows={4} value={ticketForm.message} onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))} placeholder="Подробное описание ситуации..." />
                                    </div>
                                    <button type="submit" className="sp-btn-primary"><Send size={15} /> Отправить</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="sp-header">
                                    <LifeBuoy size={28} className="sp-header-icon" />
                                    <h2 className="sp-title">Свяжитесь с нами</h2>
                                    <p className="sp-sub">Выберите удобный способ связи</p>
                                </div>
                                <div className="sp-options">
                                    <a
                                        className="sp-option"
                                        href="mailto:support@edufuture.kz?subject=Запрос в поддержку"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <div className="sp-option-icon sp-opt-email"><Mail size={22} /></div>
                                        <div className="sp-option-body">
                                            <p className="sp-option-title">Email</p>
                                            <p className="sp-option-desc">support@edufuture.kz</p>
                                        </div>
                                        <ExternalLink size={14} className="sp-option-arrow" />
                                    </a>
                                    <a
                                        className="sp-option"
                                        href="https://t.me/edufuture_support"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <div className="sp-option-icon sp-opt-tg">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 1 0 24 12 12.017 12.017 0 0 0 11.944 0zm5.01 7.77-1.73 8.16c-.13.58-.47.72-.95.45l-2.62-1.93-1.26 1.22a.66.66 0 0 1-.53.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L7.29 14.63l-2.56-.8c-.56-.17-.57-.56.12-.83l9.98-3.85c.46-.17.87.11.72.62z"/></svg>
                                        </div>
                                        <div className="sp-option-body">
                                            <p className="sp-option-title">Telegram</p>
                                            <p className="sp-option-desc">@edufuture_support</p>
                                        </div>
                                        <ExternalLink size={14} className="sp-option-arrow" />
                                    </a>
                                    <button type="button" className="sp-option" onClick={() => setTicketMode(true)}>
                                        <div className="sp-option-icon sp-opt-ticket"><FileText size={22} /></div>
                                        <div className="sp-option-body">
                                            <p className="sp-option-title">Создать тикет</p>
                                            <p className="sp-option-desc">Оформить запрос в поддержку</p>
                                        </div>
                                        <ArrowRight size={14} className="sp-option-arrow" />
                                    </button>
                                    <button type="button" className="sp-option" onClick={() => { closeSupport(); navigate('/chat') }}>
                                        <div className="sp-option-icon sp-opt-chat"><MessageCircle size={22} /></div>
                                        <div className="sp-option-body">
                                            <p className="sp-option-title">Чат поддержки</p>
                                            <p className="sp-option-desc">Ответим в течение нескольких часов</p>
                                        </div>
                                        <ArrowRight size={14} className="sp-option-arrow" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}
