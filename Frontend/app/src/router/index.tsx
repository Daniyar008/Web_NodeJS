import { Navigate, Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../shared/layouts/AuthLayout'
import { DashboardLayout } from '../shared/layouts/DashboardLayout'
import { SignInPage } from '../shared/pages/auth/SignInPage'
import { SignUpPage } from '../shared/pages/auth/SignUpPage'
import { ForgotPasswordPage } from '../shared/pages/auth/ForgotPasswordPage'
import { VerifyEmailPage } from '../shared/pages/auth/VerifyEmailPage'
import { TwoFactorPage } from '../shared/pages/auth/TwoFactorPage'
import { ResetPasswordPage } from '../shared/pages/auth/ResetPasswordPage'
import { ResetSuccessPage } from '../shared/pages/auth/ResetSuccessPage'
import { AdminDashboardPage } from '../shared/pages/dashboard/AdminDashboardPage'
import { ClassListPage } from '../shared/pages/academic/ClassListPage'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <SignInPage /> },
      { path: '/register', element: <SignUpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/2fa', element: <TwoFactorPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/reset-success', element: <ResetSuccessPage /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <AdminDashboardPage /> },
      { path: '/classes', element: <ClassListPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

export function AppOutlet() {
  return <Outlet />
}

