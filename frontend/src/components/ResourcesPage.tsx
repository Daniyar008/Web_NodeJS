import { useRef, useState } from 'react'
import {
    Copy, ExternalLink, FileText, Film, Grid3X3, Link2, List,
    MoreHorizontal, Pin, PinOff, Plus, Search, Trash2, Upload, X,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import {
    initialCategories,
    initialResources,
} from '../data/resourcesData'
import type { ResourceCategory, ResourceItem, ResourceType } from '../data/resourcesData'
import { CourseShellLayout } from './CourseShellLayout'

// ─── Favicon component ────────────────────────────────────────────────────────

function Favicon({ item }: { item: ResourceItem }) {
    return (
        <div
            className="res-favicon"
            style={{ background: item.faviconBg, color: '#fff' }}
            aria-hidden="true"
        >
            <span>{item.favicon}</span>
        </div>
    )
}

// ─── Type icon ────────────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: ResourceType }) {
    if (type === 'video') return <Film size={11} />
    if (type === 'doc') return <FileText size={11} />
    if (type === 'file') return <Upload size={11} />
    return <Link2 size={11} />
}

// ─── Resource card (grid view) ───────────────────────────────────────────────

function ResourceCard({
    item, onPin, onDelete, onCopy,
}: {
    item: ResourceItem
    onPin: (id: string) => void
    onDelete: (id: string) => void
    onCopy: (url: string) => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="res-card">
            <div className="res-card-top">
                <Favicon item={item} />
                <div className="res-card-name-wrap">
                    <p className="res-card-name">{item.name}</p>
                    {item.description && <p className="res-card-desc">{item.description}</p>}
                </div>
                <div className="res-card-actions">
                    <button type="button" className="res-icon-btn" onClick={() => onPin(item.id)} aria-label="Pin">
                        {item.isPinned ? <Pin size={13} style={{ color: '#6c8cf8' }} /> : <PinOff size={13} />}
                    </button>
                    <div className="res-menu-wrap">
                        <button type="button" className="res-icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Ещё">
                            <MoreHorizontal size={13} />
                        </button>
                        {menuOpen && (
                            <div className="res-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                                <button type="button" onClick={() => { onCopy(item.url); setMenuOpen(false) }}>
                                    <Copy size={12} /> Копировать ссылку
                                </button>
                                <a href={item.url} target="_blank" rel="noreferrer" className="res-dropdown-link">
                                    <ExternalLink size={12} /> Открыть
                                </a>
                                <button type="button" className="danger" onClick={() => { onDelete(item.id); setMenuOpen(false) }}>
                                    <Trash2 size={12} /> Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="res-card-footer">
                <div className="res-tags">
                    {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="res-tag">{tag}</span>
                    ))}
                </div>
                <span className="res-card-meta">
                    <TypeIcon type={item.type} />
                    {item.fileSize ?? item.addedAt}
                </span>
            </div>

            <a
                href={item.type !== 'doc' ? item.url : undefined}
                target="_blank"
                rel="noreferrer"
                className="res-card-overlay"
                aria-label={`Открыть ${item.name}`}
            />
        </div>
    )
}

// ─── Resource row (list view) ─────────────────────────────────────────────────

function ResourceRow({
    item, onPin, onDelete, onCopy,
}: {
    item: ResourceItem
    onPin: (id: string) => void
    onDelete: (id: string) => void
    onCopy: (url: string) => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="res-row">
            <Favicon item={item} />
            <div className="res-row-info">
                <p className="res-row-name">{item.name}</p>
                {item.description && <p className="res-row-desc">{item.description}</p>}
            </div>
            <div className="res-tags res-row-tags">
                {item.tags.map((tag) => (
                    <span key={tag} className="res-tag">{tag}</span>
                ))}
            </div>
            <span className="res-row-by">{item.addedBy}</span>
            <span className="res-row-date">{item.addedAt}</span>
            <div className="res-row-btns">
                <button type="button" className="res-icon-btn" onClick={() => onPin(item.id)} aria-label="Закрепить">
                    {item.isPinned ? <Pin size={13} style={{ color: '#6c8cf8' }} /> : <PinOff size={13} />}
                </button>
                <button type="button" className="res-icon-btn" onClick={() => onCopy(item.url)} aria-label="Копировать ссылку">
                    <Copy size={13} />
                </button>
                <div className="res-menu-wrap">
                    <button type="button" className="res-icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Ещё">
                        <MoreHorizontal size={13} />
                    </button>
                    {menuOpen && (
                        <div className="res-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                            <a href={item.url} target="_blank" rel="noreferrer" className="res-dropdown-link">
                                <ExternalLink size={12} /> Открыть
                            </a>
                            <button type="button" className="danger" onClick={() => { onDelete(item.id); setMenuOpen(false) }}>
                                <Trash2 size={12} /> Удалить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Add Resource Modal ───────────────────────────────────────────────────────

type AddResourceModalProps = {
    categories: ResourceCategory[]
    defaultCategoryId: string
    onClose: () => void
    onAdd: (item: ResourceItem) => void
}

function AddResourceModal({ categories, defaultCategoryId, onClose, onAdd }: AddResourceModalProps) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [desc, setDesc] = useState('')
    const [catId, setCatId] = useState(defaultCategoryId)
    const [type, setType] = useState<ResourceType>('link')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>([])

    function addTag() {
        const t = tagInput.trim()
        if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
        setTagInput('')
    }

    function handleSubmit() {
        if (!name.trim()) return
        onAdd({
            id: `r_${Date.now()}`,
            categoryId: catId,
            name: name.trim(),
            url: url.trim() || '#',
            favicon: name.slice(0, 2).toUpperCase(),
            faviconBg: '#9099a8',
            description: desc.trim() || undefined,
            tags,
            addedBy: 'Вы',
            addedAt: 'только что',
            isPinned: false,
            type,
        })
        onClose()
    }

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header">
                    <h3>Добавить ресурс</h3>
                    <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
                </div>

                <div className="profile-form-grid">
                    <div className="profile-field">
                        <label className="profile-field-label">Название</label>
                        <input className="profile-field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="medium.com" aria-label="Название" />
                    </div>
                    <div className="profile-field">
                        <label className="profile-field-label">Тип</label>
                        <select className="profile-field-select" value={type} onChange={(e) => setType(e.target.value as ResourceType)} aria-label="Тип ресурса">
                            <option value="link">Ссылка</option>
                            <option value="video">Видео</option>
                            <option value="doc">Документ</option>
                            <option value="file">Файл</option>
                        </select>
                    </div>
                </div>

                <div className="profile-field">
                    <label className="profile-field-label">URL</label>
                    <input className="profile-field-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." aria-label="URL" />
                </div>

                <div className="profile-field">
                    <label className="profile-field-label">Категория</label>
                    <select className="profile-field-select" value={catId} onChange={(e) => setCatId(e.target.value)} aria-label="Категория">
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                </div>

                <div className="profile-field">
                    <label className="profile-field-label">Описание (необязательно)</label>
                    <input className="profile-field-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Краткое описание…" aria-label="Описание" />
                </div>

                <div className="profile-field">
                    <label className="profile-field-label">Теги (Enter для добавления)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            className="profile-field-input"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                            placeholder="дизайн, ux, …"
                            aria-label="Добавить тег"
                            style={{ flex: 1 }}
                        />
                        <button type="button" className="chat-modal-create" style={{ padding: '0 14px' }} onClick={addTag}>+</button>
                    </div>
                    {tags.length > 0 && (
                        <div className="chat-member-picker" style={{ marginTop: '6px' }}>
                            {tags.map((t) => (
                                <span key={t} className="res-tag" style={{ cursor: 'pointer' }} onClick={() => setTags((prev) => prev.filter((x) => x !== t))}>
                                    {t} ×
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="chat-modal-footer">
                    <button type="button" className="chat-modal-cancel" onClick={onClose}>Отмена</button>
                    <button type="button" className="chat-modal-create" onClick={handleSubmit} disabled={!name.trim()}>Добавить</button>
                </div>
            </div>
        </div>
    )
}

// ─── Add Category Modal ───────────────────────────────────────────────────────

const CAT_COLORS = [
    { color: '#6c8cf8', bg: '#edf0fe' },
    { color: '#43c38d', bg: '#e7f9f2' },
    { color: '#f86c8c', bg: '#fde8ee' },
    { color: '#fba94c', bg: '#fff4e5' },
    { color: '#a78bfa', bg: '#f0eaff' },
    { color: '#f97316', bg: '#fff0e5' },
    { color: '#64748b', bg: '#f1f5f9' },
    { color: '#10b981', bg: '#ecfdf5' },
]

function AddCategoryModal({
    onClose, onCreate,
}: { onClose: () => void; onCreate: (cat: ResourceCategory) => void }) {
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('📁')
    const [picked, setPicked] = useState(0)

    function handleCreate() {
        if (!name.trim()) return
        onCreate({
            id: `cat_${Date.now()}`,
            name: name.trim(),
            icon,
            color: CAT_COLORS[picked].color,
            bgColor: CAT_COLORS[picked].bg,
        })
        onClose()
    }

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header">
                    <h3>Новая категория</h3>
                    <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
                </div>

                <div className="profile-form-grid" style={{ gridTemplateColumns: '64px 1fr' }}>
                    <div className="profile-field">
                        <label className="profile-field-label">Иконка</label>
                        <input className="profile-field-input" value={icon} onChange={(e) => setIcon(e.target.value)} aria-label="Иконка" style={{ textAlign: 'center', fontSize: '20px' }} />
                    </div>
                    <div className="profile-field">
                        <label className="profile-field-label">Название</label>
                        <input className="profile-field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Видео, Статьи…" aria-label="Название категории" />
                    </div>
                </div>

                <div className="profile-field">
                    <label className="profile-field-label">Цвет</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {CAT_COLORS.map((c, i) => (
                            <button
                                key={i} type="button" aria-label={`Цвет ${i + 1}`}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: c.color, border: picked === i ? '3px solid #202736' : '2px solid transparent',
                                    cursor: 'pointer', transition: 'border 0.15s',
                                }}
                                onClick={() => setPicked(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="chat-modal-footer">
                    <button type="button" className="chat-modal-cancel" onClick={onClose}>Отмена</button>
                    <button type="button" className="chat-modal-create" onClick={handleCreate} disabled={!name.trim()}>Создать</button>
                </div>
            </div>
        </div>
    )
}

// ─── Copied toast ─────────────────────────────────────────────────────────────

function CopiedToast({ show }: { show: boolean }) {
    if (!show) return null
    return (
        <div className="res-toast">
            <Copy size={13} /> Ссылка скопирована
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function ResourcesPage({ language, onLanguageChange }: Props) {
    const [categories, setCategories] = useState<ResourceCategory[]>(initialCategories)
    const [resources, setResources] = useState<ResourceItem[]>(initialResources)
    const [activeCatId, setActiveCatId] = useState('cat_blog')
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all')
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
    const [showAddRes, setShowAddRes] = useState(false)
    const [showAddCat, setShowAddCat] = useState(false)
    const [copied, setCopied] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const cat = categories.find((c) => c.id === activeCatId)
    const catItems = resources.filter((r) => r.categoryId === activeCatId)

    const filtered = catItems.filter((r) => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.description?.toLowerCase().includes(search.toLowerCase()) ||
            r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        const matchType = typeFilter === 'all' || r.type === typeFilter
        return matchSearch && matchType
    })

    // pinned first
    const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

    function togglePin(id: string) {
        setResources((prev) => prev.map((r) => r.id === id ? { ...r, isPinned: !r.isPinned } : r))
    }
    function deleteResource(id: string) {
        setResources((prev) => prev.filter((r) => r.id !== id))
    }
    function copyLink(url: string) {
        navigator.clipboard.writeText(url).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    function addResource(item: ResourceItem) {
        setResources((prev) => [...prev, item])
    }
    function addCategory(cat: ResourceCategory) {
        setCategories((prev) => [...prev, cat])
        setActiveCatId(cat.id)
    }

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Ресурсы"
            activePage="resources"
        >
            <div className="res-page">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="res-header">
                    <div className="res-header-left">
                        <h2 className="res-title">Мои ресурсы</h2>
                        {cat && (
                            <span
                                className="res-header-badge"
                                style={{ background: cat.bgColor, color: cat.color }}
                            >
                                {cat.icon} {catItems.length} ресурс{catItems.length === 1 ? '' : catItems.length < 5 ? 'а' : 'ов'}
                            </span>
                        )}
                    </div>

                    <div className="res-header-right">
                        {/* Search */}
                        <div className="res-search">
                            <Search size={14} className="res-search-icon" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Поиск ресурсов…"
                                aria-label="Поиск ресурсов"
                            />
                            {search && (
                                <button type="button" className="res-search-clear" onClick={() => setSearch('')} aria-label="Очистить"><X size={12} /></button>
                            )}
                        </div>

                        {/* View toggle */}
                        <div className="res-view-toggle">
                            <button
                                type="button"
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                aria-label="Список"
                            >
                                <List size={15} />
                            </button>
                            <button
                                type="button"
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                aria-label="Сетка"
                            >
                                <Grid3X3 size={15} />
                            </button>
                        </div>

                        {/* Add button */}
                        <button type="button" className="res-add-btn" onClick={() => setShowAddRes(true)}>
                            <Plus size={15} /> Добавить
                        </button>
                        <button type="button" className="res-add-cat-btn" onClick={() => setShowAddCat(true)}>
                            <Plus size={15} /> Категория
                        </button>
                    </div>
                </div>

                {/* ── Category tabs ───────────────────────────────────────────── */}
                <div className="res-tabs-bar">
                    <div className="res-tabs">
                        {categories.map((c) => {
                            const count = resources.filter((r) => r.categoryId === c.id).length
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    className={activeCatId === c.id ? 'res-tab active' : 'res-tab'}
                                    style={activeCatId === c.id ? { color: c.color, borderBottomColor: c.color } : {}}
                                    onClick={() => { setActiveCatId(c.id); setSearch(''); setTypeFilter('all') }}
                                >
                                    <span className="res-tab-icon">{c.icon}</span>
                                    {c.name}
                                    <span
                                        className="res-tab-count"
                                        style={activeCatId === c.id ? { background: c.bgColor, color: c.color } : {}}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Type filter */}
                    <div className="res-type-chips">
                        {(['all', 'link', 'video', 'doc', 'file'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={typeFilter === t ? 'chat-chip active' : 'chat-chip'}
                                onClick={() => setTypeFilter(t)}
                            >
                                {t === 'all' ? 'Все' : t === 'link' ? 'Ссылки' : t === 'video' ? 'Видео' : t === 'doc' ? 'Docs' : 'Файлы'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Content ─────────────────────────────────────────────────── */}
                {sorted.length === 0 ? (
                    <div className="res-empty">
                        <p className="res-empty-icon">🔍</p>
                        <p className="res-empty-text">Ничего не найдено</p>
                        <button type="button" className="res-add-btn" onClick={() => setShowAddRes(true)}>
                            <Plus size={14} /> Добавить первый ресурс
                        </button>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="res-list">
                        {/* List header */}
                        <div className="res-list-header">
                            <span style={{ flex: '0 0 44px' }} />
                            <span style={{ flex: 1 }}>Название</span>
                            <span className="res-col-tags">Теги</span>
                            <span className="res-col-by">Добавил</span>
                            <span className="res-col-date">Дата</span>
                            <span style={{ width: '100px' }} />
                        </div>
                        {sorted.map((item) => (
                            <ResourceRow
                                key={item.id}
                                item={item}
                                onPin={togglePin}
                                onDelete={deleteResource}
                                onCopy={copyLink}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="res-grid">
                        {sorted.map((item) => (
                            <ResourceCard
                                key={item.id}
                                item={item}
                                onPin={togglePin}
                                onDelete={deleteResource}
                                onCopy={copyLink}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddRes && (
                <AddResourceModal
                    categories={categories}
                    defaultCategoryId={activeCatId}
                    onClose={() => setShowAddRes(false)}
                    onAdd={addResource}
                />
            )}
            {showAddCat && (
                <AddCategoryModal onClose={() => setShowAddCat(false)} onCreate={addCategory} />
            )}

            {/* Toast */}
            <CopiedToast show={copied} />

            {/* Hidden file input for future file upload */}
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} aria-label="Загрузить файл" />
        </CourseShellLayout>
    )
}
