import { useState } from 'react'
import { Download, Award, Calendar, Building2 } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { RoleShellLayout } from './RoleShellLayout'

type Certificate = {
    id: string
    courseName: string
    issueDate: string
    institution: string
    grade: string
    hours: number
}

const SAMPLE_CERTS: Certificate[] = [
    { id: '1', courseName: 'Figma Basic to Advance', issueDate: '2026-01-15', institution: 'EduFuture Academy', grade: 'A', hours: 40 },
    { id: '2', courseName: 'UI/UX Masterclass', issueDate: '2025-12-20', institution: 'EduFuture Academy', grade: 'A+', hours: 60 },
    { id: '3', courseName: 'Graphic Design Pro', issueDate: '2025-11-10', institution: 'EduFuture Academy', grade: 'A', hours: 48 },
    { id: '4', courseName: 'Web Design Basics', issueDate: '2025-10-05', institution: 'EduFuture Academy', grade: 'B+', hours: 32 },
]

export function CertificatesPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [certs] = useState<Certificate[]>(SAMPLE_CERTS)

    const downloadPDF = (cert: Certificate) => {
        // Mock PDF download - in production connect to backend
        const text = `CERTIFICATE OF COMPLETION\n\nThis is to certify that\nСультангереев Данияр\n\nHas successfully completed the course:\n${cert.courseName}\n\nIssued by: ${cert.institution}\nDate: ${cert.issueDate}\nGrade: ${cert.grade}\nHours: ${cert.hours}`
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${cert.courseName}-${cert.issueDate}.pdf`
        a.click()
    }

    return (
        <RoleShellLayout language={language} onLanguageChange={onLanguageChange}>
            <div className="cert-root">
                <div className="cert-header">
                    <div>
                        <h1 className="cert-title">Ваши сертификаты</h1>
                        <p className="cert-sub">Загрузите и поделитесь вашими достижениями</p>
                    </div>
                    <Award size={40} color="#6366f1" />
                </div>

                {certs.length === 0 ? (
                    <div className="cert-empty">
                        <Award size={48} />
                        <p>У вас нет сертификатов</p>
                        <p style={{ fontSize: 13, color: '#64748b' }}>Завершите курсы, чтобы получить сертификаты</p>
                    </div>
                ) : (
                    <div className="cert-grid">
                        {certs.map(c => (
                            <div key={c.id} className="cert-card">
                                <div className="cert-card-header">
                                    <Award size={24} color="#6366f1" />
                                    <span className="cert-grade">{c.grade}</span>
                                </div>
                                <h3 className="cert-course">{c.courseName}</h3>
                                <div className="cert-meta">
                                    <div className="cert-meta-item">
                                        <Calendar size={12} />
                                        <span>{c.issueDate}</span>
                                    </div>
                                    <div className="cert-meta-item">
                                        <Building2 size={12} />
                                        <span>{c.institution}</span>
                                    </div>
                                </div>
                                <p className="cert-hours">{c.hours} часов обучения</p>
                                <button
                                    type="button"
                                    className="cert-btn"
                                    onClick={() => downloadPDF(c)}
                                >
                                    <Download size={14} /> Скачать PDF
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RoleShellLayout>
    )
}
