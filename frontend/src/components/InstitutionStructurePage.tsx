import { useEffect, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'
import { institution as instApi, type Institution } from '../lib/api'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type Department = { id: string; name: string; _count?: { classes: number } }
type SchoolClass = { id: string; name: string; year: number; departmentId: string }

export function InstitutionStructurePage({ language, onLanguageChange }: Props) {
    const [instId, setInstId] = useState<string | null>(null)
    const [departments, setDepartments] = useState<Department[]>([])
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const [newDeptName, setNewDeptName] = useState('')
    const [newClass, setNewClass] = useState({ name: '', year: new Date().getFullYear().toString(), departmentId: '' })
    const [modal, setModal] = useState<'department' | 'class' | null>(null)

    useEffect(() => {
        instApi.list().then(list => {
            if (list.length === 0) return
            const inst = list[0]
            setInstId(inst.id)
            return instApi.get(inst.id)
        }).then((inst?: Institution) => {
            if (!inst) return
            setDepartments(inst.departments ?? [])
            setClasses(inst.classes ?? [])
            if (inst.departments?.length) setNewClass(p => ({ ...p, departmentId: inst.departments![0].id }))
        }).catch(() => { })
    }, [])

    async function addDepartment() {
        if (!instId || !newDeptName.trim()) return
        try {
            const created = await instApi.createDepartment(instId, { name: newDeptName.trim() })
            setDepartments(prev => [...prev, created])
            setNewDeptName('')
            setModal(null)
        } catch { /* ignore */ }
    }

    async function deleteDepartment(deptId: string) {
        if (!instId) return
        try {
            await instApi.deleteDepartment(instId, deptId)
            setDepartments(prev => prev.filter(d => d.id !== deptId))
        } catch { /* ignore */ }
    }

    async function addClass() {
        if (!instId || !newClass.name.trim() || !newClass.departmentId) return
        try {
            const created = await instApi.createClass(instId, {
                name: newClass.name.trim(),
                year: Number(newClass.year) || new Date().getFullYear(),
                departmentId: newClass.departmentId,
            })
            setClasses(prev => [...prev, created])
            setNewClass(p => ({ ...p, name: '' }))
            setModal(null)
        } catch { /* ignore */ }
    }

    async function deleteClass(classId: string) {
        if (!instId) return
        try {
            await instApi.deleteClass(instId, classId)
            setClasses(prev => prev.filter(c => c.id !== classId))
        } catch { /* ignore */ }
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
                    <h3>Подразделения (кафедры / МО)</h3>
                    <div className="inst-table-like">
                        {departments.map(dep => (
                            <div key={dep.id} className="inst-row">
                                <strong>{dep.name}</strong>
                                <span>{dep._count?.classes ?? 0} классов</span>
                                <button type="button" className="inst-btn ghost" style={{ color: '#ef4444', fontSize: 12 }} onClick={() => deleteDepartment(dep.id)}>Удалить</button>
                            </div>
                        ))}
                        {departments.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13 }}>Нет подразделений</p>}
                    </div>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={() => setModal('department')}>Добавить подразделение</button>
                        <span className="inst-chip">Подразделений: {departments.length}</span>
                    </div>
                </article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Классы / группы</h3>
                    <div className="inst-table-like">
                        {classes.map(c => {
                            const dept = departments.find(d => d.id === c.departmentId)
                            return (
                                <div key={c.id} className="inst-row">
                                    <strong>{c.name}</strong>
                                    <span>{c.year} год</span>
                                    <span>{dept?.name ?? '—'}</span>
                                    <button type="button" className="inst-btn ghost" style={{ color: '#ef4444', fontSize: 12 }} onClick={() => deleteClass(c.id)}>Удалить</button>
                                </div>
                            )
                        })}
                        {classes.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13 }}>Нет классов</p>}
                    </div>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={() => setModal('class')}>Добавить класс</button>
                        <span className="inst-chip">Классов: {classes.length}</span>
                    </div>
                </article>
            </section>

            {modal && (
                <div className="inst-modal-backdrop" onClick={() => setModal(null)}>
                    <div className="inst-modal" onClick={event => event.stopPropagation()}>
                        <div className="inst-modal-head">
                            <h3>{modal === 'department' ? 'Новое подразделение' : 'Новый класс'}</h3>
                            <button type="button" className="inst-btn ghost" onClick={() => setModal(null)}>Закрыть</button>
                        </div>
                        {modal === 'department' ? (
                            <>
                                <div className="inst-form-grid">
                                    <input className="inst-input" placeholder="Название МО/кафедры" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} />
                                </div>
                                <div className="inst-toolbar end">
                                    <button type="button" className="inst-btn ghost" onClick={() => setModal(null)}>Отмена</button>
                                    <button type="button" className="inst-btn" onClick={addDepartment}>Сохранить</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="inst-form-grid">
                                    <input className="inst-input" placeholder="Название класса (напр. 8А)" value={newClass.name} onChange={e => setNewClass(p => ({ ...p, name: e.target.value }))} />
                                    <input className="inst-input" placeholder="Год" type="number" value={newClass.year} onChange={e => setNewClass(p => ({ ...p, year: e.target.value }))} />
                                    <select className="inst-input" value={newClass.departmentId} onChange={e => setNewClass(p => ({ ...p, departmentId: e.target.value }))}>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="inst-toolbar end">
                                    <button type="button" className="inst-btn ghost" onClick={() => setModal(null)}>Отмена</button>
                                    <button type="button" className="inst-btn" onClick={addClass}>Сохранить</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </InstitutionShellLayout>
    )
}
