import { useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

const BRANCHES = [
    { name: 'Главный корпус', classes: 24, lead: 'А. Токтарова' },
    { name: 'Корпус №2', classes: 18, lead: 'Д. Исмаилов' },
    { name: 'Филиал STEM-центр', classes: 9, lead: 'Н. Садыкова' },
]

type Branch = { id: string; name: string; classes: number; lead: string }
type Department = { id: string; name: string; head: string }

export function InstitutionStructurePage({ language, onLanguageChange }: Props) {
    const [branches, setBranches] = useState<Branch[]>(
        BRANCHES.map((b, idx) => ({ id: `b${idx + 1}`, ...b })),
    )
    const [departments, setDepartments] = useState<Department[]>([
        { id: 'd1', name: 'МО математики', head: 'А. Сейтказина' },
        { id: 'd2', name: 'МО языков', head: 'Н. Куаныш' },
        { id: 'd3', name: 'МО естественных наук', head: 'Р. Байтенов' },
    ])
    const [newBranch, setNewBranch] = useState({ name: '', classes: '0', lead: '' })
    const [newDepartment, setNewDepartment] = useState({ name: '', head: '' })

    function addBranch() {
        if (!newBranch.name.trim() || !newBranch.lead.trim()) return
        const value = Number.parseInt(newBranch.classes || '0', 10)
        setBranches((prev) => [
            ...prev,
            { id: `b${Date.now()}`, name: newBranch.name.trim(), classes: Number.isNaN(value) ? 0 : value, lead: newBranch.lead.trim() },
        ])
        setNewBranch({ name: '', classes: '0', lead: '' })
    }

    function addDepartment() {
        if (!newDepartment.name.trim() || !newDepartment.head.trim()) return
        setDepartments((prev) => [...prev, { id: `d${Date.now()}`, name: newDepartment.name.trim(), head: newDepartment.head.trim() }])
        setNewDepartment({ name: '', head: '' })
    }

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Структура и иерархия"
            subtitle="Управление филиалами, подразделениями и подчиненностью"
            activePage="i-structure"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Иерархия управления</h3>
                    <div className="inst-tree">
                        <p>Учреждение</p>
                        <p>├── Директор</p>
                        <p>├── Завучи по направлениям</p>
                        <p>├── Руководители МО / кафедр</p>
                        <p>├── Методисты</p>
                        <p>└── Учителя и кураторы классов</p>
                    </div>
                </article>

                <article className="inst-card tall">
                    <h3>Филиалы и корпуса</h3>
                    <div className="inst-table-like">
                        {branches.map((b) => (
                            <div key={b.name} className="inst-row">
                                <strong>{b.name}</strong>
                                <span>{b.classes} классов/групп</span>
                                <span>Ответственный: {b.lead}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card">
                    <h3>Добавить филиал/корпус</h3>
                    <div className="inst-form-grid">
                        <input className="inst-input" placeholder="Название филиала" value={newBranch.name} onChange={(e) => setNewBranch((p) => ({ ...p, name: e.target.value }))} />
                        <input className="inst-input" placeholder="Количество классов" type="number" value={newBranch.classes} onChange={(e) => setNewBranch((p) => ({ ...p, classes: e.target.value }))} />
                        <input className="inst-input" placeholder="Ответственный" value={newBranch.lead} onChange={(e) => setNewBranch((p) => ({ ...p, lead: e.target.value }))} />
                    </div>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={addBranch}>Добавить филиал</button>
                    </div>
                </article>

                <article className="inst-card">
                    <h3>Методические объединения / кафедры</h3>
                    <div className="inst-table-like">
                        {departments.map((dep) => (
                            <div key={dep.id} className="inst-row">
                                <strong>{dep.name}</strong>
                                <span>Руководитель: {dep.head}</span>
                            </div>
                        ))}
                    </div>
                    <div className="inst-form-grid">
                        <input className="inst-input" placeholder="Название МО/кафедры" value={newDepartment.name} onChange={(e) => setNewDepartment((p) => ({ ...p, name: e.target.value }))} />
                        <input className="inst-input" placeholder="Руководитель" value={newDepartment.head} onChange={(e) => setNewDepartment((p) => ({ ...p, head: e.target.value }))} />
                    </div>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={addDepartment}>Добавить подразделение</button>
                    </div>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
