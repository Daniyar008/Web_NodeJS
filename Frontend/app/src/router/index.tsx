import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../shared/layouts/AuthLayout'
import { SignInPage } from '../shared/pages/auth/SignInPage'
import { LandingPage } from '../shared/pages/LandingPage'
import { TestPage } from '../shared/pages/TestPage'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/test', element: <TestPage /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <SignInPage /> },
    ],
  },
  { path: '*', element: <LandingPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
