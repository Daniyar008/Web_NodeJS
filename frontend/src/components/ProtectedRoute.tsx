import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import type { RootState } from '../app/store'

type Props = {
    children: ReactNode
    allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
    const token = useSelector((s: RootState) => s.auth.accessToken)
    const user = useSelector((s: RootState) => s.auth.user)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role.toUpperCase())) {
        return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
}
