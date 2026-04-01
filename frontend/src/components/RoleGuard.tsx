import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface RoleGuardProps {
    requiredRole: 'student' | 'teacher' | 'institution'
    children: ReactNode
    fallback?: string
}

export function RoleGuard({ requiredRole, children, fallback = '/dashboard' }: RoleGuardProps) {
    const navigate = useNavigate()
    const role = localStorage.getItem('estudy-role') ?? 'student'
    const allowed = role === requiredRole

    useEffect(() => {
        if (!allowed) {
            navigate(fallback, { replace: true })
        }
    }, [allowed, navigate, fallback])

    if (!allowed) return null
    return <>{children}</>
}
