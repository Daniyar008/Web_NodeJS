import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthGuard } from '../components/AuthGuard'

describe('AuthGuard', () => {
    it('redirects to /auth when no token is stored', () => {
        localStorage.clear()
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthGuard>
                    <div data-testid="protected">Secret</div>
                </AuthGuard>
            </MemoryRouter>,
        )
        // AuthGuard should not render children
        expect(screen.queryByTestId('protected')).toBeNull()
    })

    it('renders children when access token exists', () => {
        localStorage.setItem('estudy-access', 'mock-token')
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthGuard>
                    <div data-testid="protected">Secret</div>
                </AuthGuard>
            </MemoryRouter>,
        )
        expect(screen.getByTestId('protected')).toBeInTheDocument()
    })
})
