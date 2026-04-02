import type { ReactNode } from 'react'
import type { Language } from '../i18n/translations'
import { CourseShellLayout } from './CourseShellLayout'
import { TeacherShellLayout } from './TeacherShellLayout'
import { InstitutionShellLayout } from './InstitutionShellLayout'
import { ParentShellLayout } from './ParentShellLayout'

interface Props {
    language: Language
    onLanguageChange: (l: Language) => void
    children: ReactNode
}

/** Picks the correct shell layout based on the current user's role. */
export function RoleShellLayout({ language, onLanguageChange, children }: Props) {
    const role = localStorage.getItem('estudy-role') ?? 'student'
    switch (role) {
        case 'teacher':
            return <TeacherShellLayout language={language} onLanguageChange={onLanguageChange}>{children}</TeacherShellLayout>
        case 'institution':
            return <InstitutionShellLayout language={language} onLanguageChange={onLanguageChange}>{children}</InstitutionShellLayout>
        case 'parent':
            return <ParentShellLayout language={language} onLanguageChange={onLanguageChange}>{children}</ParentShellLayout>
        default:
            return <CourseShellLayout language={language} onLanguageChange={onLanguageChange}>{children}</CourseShellLayout>
    }
}
