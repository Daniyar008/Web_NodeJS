import { useState } from 'react'
import { Download } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

const REPORTS = [
    { class: '8A Design', students: 22, avgScore: 84, attendance: 92, completion: 78 },
    { class: '9B Product', students: 18, avgScore: 78, attendance: 88, completion: 65 },
]

export function TeacherReportsPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [exportType, setExportType] = useState<'csv' | 'pdf'>('csv')

    const exportReport = () => {
        let content = ''
        if (exportType === 'csv') {
            content = 'Class,Students,Avg Score,Attendance,Completion\n'
            REPORTS.forEach(r => {
                content += `${r.class},${r.students},${r.avgScore},${r.attendance},${r.completion}\n`
            })
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'reports.csv'
            link.click()
        }
    }

    return (
        <TeacherShellLayout language={language} onLanguageChange={onLanguageChange} title="Аналитика" activePage="t-analytics">
            <div className="tr-root">
                <div className="tr-header">
                    <h1 className="tr-title">Отчёты и аналитика</h1>
                    <p className="tr-sub">Статистика по классам и прогресс студентов</p>
                </div>

                <div className="tr-controls">
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select value={exportType} onChange={(e) => setExportType(e.target.value as 'csv' | 'pdf')} style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                        </select>
                        <button type="button" className="tr-btn primary" onClick={exportReport}>
                            <Download size={14} /> Скачать
                        </button>
                    </div>
                </div>

                <div className="tr-cards">
                    {REPORTS.map((r, i) => (
                        <div key={i} className="tr-card">
                            <h3>{r.class}</h3>
                            <div className="tr-stats">
                                <div className="tr-stat">
                                    <span className="tr-label">Студентов</span>
                                    <span className="tr-value">{r.students}</span>
                                </div>
                                <div className="tr-stat">
                                    <span className="tr-label">Средний балл</span>
                                    <span className="tr-value">{r.avgScore}%</span>
                                </div>
                                <div className="tr-stat">
                                    <span className="tr-label">Посещаемость</span>
                                    <span className="tr-value">{r.attendance}%</span>
                                </div>
                                <div className="tr-stat">
                                    <span className="tr-label">Завершено курсов</span>
                                    <span className="tr-value">{r.completion}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </TeacherShellLayout>
    )
}
