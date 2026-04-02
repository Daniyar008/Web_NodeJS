import { useState } from 'react'
import { ShoppingBag, CheckCircle2, Package, Zap, Star, Palette, Smile, Shield } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { useXP } from '../lib/xpStore'
import type { Language } from '../i18n/translations'

/* ── Types ─────────────────────────────────────────────────────── */
type ItemCategory = 'avatar' | 'theme' | 'emoji' | 'badge'
interface ShopItem {
    id: string
    name: string
    description: string
    price: number
    category: ItemCategory
    icon: string
    color: string
}

/* ── Shop items data ────────────────────────────────────────────── */
const SHOP_ITEMS: ShopItem[] = [
    // Avatars / Frames
    { id: 'av1', name: 'Золотая рамка', description: 'Золотая рамка вокруг аватара', price: 200, category: 'avatar', icon: '🥇', color: '#f59e0b' },
    { id: 'av2', name: 'Радужная рамка', description: 'Переливающаяся рамка с градиентом', price: 500, category: 'avatar', icon: '🌈', color: '#8b5cf6' },
    { id: 'av3', name: 'Неоновая рамка', description: 'Яркое неоновое свечение', price: 750, category: 'avatar', icon: '⚡', color: '#06b6d4' },
    { id: 'av4', name: 'Огненная рамка', description: 'Пылающий огненный контур', price: 1000, category: 'avatar', icon: '🔥', color: '#ef4444' },
    // Themes
    { id: 'th1', name: 'Тёмная тема', description: 'Переключите интерфейс в тёмный режим', price: 300, category: 'theme', icon: '🌙', color: '#1e293b' },
    { id: 'th2', name: 'Тема "Океан"', description: 'Синие и бирюзовые тона', price: 400, category: 'theme', icon: '🌊', color: '#0ea5e9' },
    { id: 'th3', name: 'Тема "Лес"', description: 'Спокойные зелёные тона', price: 400, category: 'theme', icon: '🌿', color: '#10b981' },
    { id: 'th4', name: 'Тема "Закат"', description: 'Тёплые оранжево-розовые тона', price: 600, category: 'theme', icon: '🌅', color: '#f97316' },
    // Emoji decorations
    { id: 'em1', name: 'Корона 👑', description: 'Корона рядом с именем', price: 150, category: 'emoji', icon: '👑', color: '#f59e0b' },
    { id: 'em2', name: 'Ракета 🚀', description: 'Ракета рядом с именем', price: 100, category: 'emoji', icon: '🚀', color: '#6366f1' },
    { id: 'em3', name: 'Алмаз 💎', description: 'Алмаз рядом с именем', price: 250, category: 'emoji', icon: '💎', color: '#06b6d4' },
    { id: 'em4', name: 'Звезда ⭐', description: 'Звезда рядом с именем', price: 80, category: 'emoji', icon: '⭐', color: '#f59e0b' },
    // Badges
    { id: 'bd1', name: 'Значок "Отличник"', description: 'Показывает вашу успеваемость', price: 500, category: 'badge', icon: '🎓', color: '#6366f1' },
    { id: 'bd2', name: 'Значок "Чемпион"', description: 'Для победителей турниров', price: 800, category: 'badge', icon: '🏆', color: '#f59e0b' },
    { id: 'bd3', name: 'Значок "Помощник"', description: 'За помощь другим ученикам', price: 350, category: 'badge', icon: '🤝', color: '#10b981' },
    { id: 'bd4', name: 'Значок VIP', description: 'Эксклюзивный статус VIP', price: 1500, category: 'badge', icon: '💫', color: '#8b5cf6' },
]

const CATEGORIES: { key: ItemCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Все', icon: <ShoppingBag size={14} /> },
    { key: 'avatar', label: 'Рамки', icon: <Shield size={14} /> },
    { key: 'theme', label: 'Темы', icon: <Palette size={14} /> },
    { key: 'emoji', label: 'Декор', icon: <Smile size={14} /> },
    { key: 'badge', label: 'Значки', icon: <Star size={14} /> },
]

/* ══════════════════════════════════════════════════════════════════ */
export function XpShopPage({
    language,
    onLanguageChange,
}: {
    language: Language
    onLanguageChange: (l: Language) => void
}) {
    const { xp, xpInLevel, level, levelTitle, addXP } = useXP()
    const [tab, setTab] = useState<'shop' | 'inventory'>('shop')
    const [category, setCategory] = useState<ItemCategory | 'all'>('all')
    const [owned, setOwned] = useState<Set<string>>(new Set(['em4']))   // star owned by default
    const [equipped, setEquipped] = useState<Set<string>>(new Set())
    const [toast, setToast] = useState<string | null>(null)

    const coins = xp   // XP = coins 1:1

    const visibleItems = tab === 'inventory'
        ? SHOP_ITEMS.filter(it => owned.has(it.id))
        : SHOP_ITEMS.filter(it => category === 'all' || it.category === category)

    function buy(item: ShopItem) {
        if (coins < item.price || owned.has(item.id)) return
        // Deduct XP (negative addXP)
        addXP(-item.price)
        setOwned(prev => new Set([...prev, item.id]))
        showToast(`${item.icon} «${item.name}» куплено!`)
    }

    function toggleEquip(item: ShopItem) {
        setEquipped(prev => {
            const s = new Set(prev)
            if (s.has(item.id)) s.delete(item.id); else s.add(item.id)
            return s
        })
    }

    function showToast(msg: string) {
        setToast(msg)
        setTimeout(() => setToast(null), 2500)
    }

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Магазин"
            activePage="shop"
        >
            <div className="shop-page">

                {/* ── Header ────────────────────────────────────────── */}
                <div className="shop-header">
                    <div className="shop-header-left">
                        <h1 className="shop-title">Магазин</h1>
                        <p className="shop-subtitle">Трать XP-монеты на уникальные элементы персонализации</p>
                    </div>
                    <div className="shop-balance-card">
                        <Zap size={18} className="shop-balance-icon" />
                        <div>
                            <div className="shop-balance-value">{coins.toLocaleString('ru')} XP</div>
                            <div className="shop-balance-label">Ур. {level} · {levelTitle}</div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ──────────────────────────────────────────── */}
                <div className="shop-tabs">
                    <button className={`shop-tab ${tab === 'shop' ? 'active' : ''}`} onClick={() => setTab('shop')}>
                        <ShoppingBag size={15} /> Магазин
                    </button>
                    <button className={`shop-tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>
                        <Package size={15} /> Инвентарь
                        {owned.size > 0 && <span className="shop-tab-badge">{owned.size}</span>}
                    </button>
                </div>

                {/* ── Category filter (shop only) ───────────────────── */}
                {tab === 'shop' && (
                    <div className="shop-filters">
                        {CATEGORIES.map(c => (
                            <button
                                key={c.key}
                                className={`shop-filter-btn ${category === c.key ? 'active' : ''}`}
                                onClick={() => setCategory(c.key)}
                            >
                                {c.icon} {c.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Grid ──────────────────────────────────────────── */}
                {visibleItems.length === 0 ? (
                    <div className="shop-empty">
                        <Package size={40} style={{ opacity: .3 }} />
                        <p>Инвентарь пуст</p>
                        <button className="shop-go-shop" onClick={() => setTab('shop')}>Перейти в магазин</button>
                    </div>
                ) : (
                    <div className="shop-grid">
                        {visibleItems.map(item => {
                            const isOwned = owned.has(item.id)
                            const isEquipped = equipped.has(item.id)
                            const canAfford = coins >= item.price
                            return (
                                <div
                                    key={item.id}
                                    className={`shop-item ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`}
                                    style={{ '--item-color': item.color } as React.CSSProperties}
                                >
                                    <div className="shop-item-icon-wrap" style={{ background: item.color + '22' }}>
                                        <span className="shop-item-emoji">{item.icon}</span>
                                    </div>
                                    <div className="shop-item-info">
                                        <span className="shop-item-name">{item.name}</span>
                                        <span className="shop-item-desc">{item.description}</span>
                                    </div>
                                    <div className="shop-item-bottom">
                                        {!isOwned ? (
                                            <>
                                                <span className={`shop-item-price ${!canAfford ? 'unaffordable' : ''}`}>
                                                    <Zap size={12} />{item.price} XP
                                                </span>
                                                <button
                                                    className="shop-buy-btn"
                                                    disabled={!canAfford}
                                                    onClick={() => buy(item)}
                                                >
                                                    {canAfford ? 'Купить' : 'Мало XP'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="shop-owned-label"><CheckCircle2 size={13} /> Куплено</span>
                                                <button
                                                    className={`shop-equip-btn ${isEquipped ? 'active' : ''}`}
                                                    onClick={() => toggleEquip(item)}
                                                >
                                                    {isEquipped ? 'Снять' : 'Надеть'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* ── XP info strip ─────────────────────────────────── */}
                <div className="shop-xp-strip">
                    <div className="shop-xp-row">
                        <span className="shop-xp-label">XP до следующего уровня</span>
                        <span className="shop-xp-val">{xpInLevel} / 500</span>
                    </div>
                    <div className="shop-xp-bar">
                        <div className="shop-xp-fill" style={{ width: `${Math.round(xpInLevel / 500 * 100)}%` }} />
                    </div>
                    <p className="shop-xp-hint">Проходи уроки и тесты, чтобы зарабатывать XP-монеты</p>
                </div>

                {/* ── Toast ─────────────────────────────────────────── */}
                {toast && (
                    <div className="shop-toast">{toast}</div>
                )}
            </div>
        </CourseShellLayout>
    )
}
