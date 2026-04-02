import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../lib/api'
import type { ReactNode } from 'react'

export function AuthGuard({ children }: { children: ReactNode }) {
    const token = getAccessToken()
    if (!token) {
        const role = localStorage.getItem('estudy-role') ?? 'student'
        return <Navigate to={`/login/${role}`} replace />
    }
    return <>{children}</>
}
