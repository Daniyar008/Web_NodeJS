import { createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'dashboard/:role', element: <DashboardPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
])
