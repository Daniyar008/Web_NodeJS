import { Navigate, Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../shared/layouts/AuthLayout'
import { DashboardLayout } from '../shared/layouts/DashboardLayout'

// Auth pages
import { SignInPage } from '../shared/pages/auth/SignInPage'
import { SignUpPage } from '../shared/pages/auth/SignUpPage'
import { ForgotPasswordPage } from '../shared/pages/auth/ForgotPasswordPage'
import { VerifyEmailPage } from '../shared/pages/auth/VerifyEmailPage'
import { TwoFactorPage } from '../shared/pages/auth/TwoFactorPage'
import { ResetPasswordPage } from '../shared/pages/auth/ResetPasswordPage'
import { ResetSuccessPage } from '../shared/pages/auth/ResetSuccessPage'

// Dashboard
import { AdminDashboardPage } from '../shared/pages/dashboard/AdminDashboardPage'

// Academic pages
import { ClassListPage } from '../shared/pages/academic/ClassListPage'
import { ClassRoomPage } from '../shared/pages/academic/ClassRoomPage'
import { ClassRoutinePage } from '../shared/pages/academic/ClassRoutinePage'
import { SectionPage } from '../shared/pages/academic/SectionPage'
import { SubjectPage } from '../shared/pages/academic/SubjectPage'
import { SyllabusPage } from '../shared/pages/academic/SyllabusPage'
import { TimeTablePage } from '../shared/pages/academic/TimeTablePage'
import { HomeWorkPage } from '../shared/pages/academic/HomeWorkPage'
import { ExamListPage } from '../shared/pages/academic/ExamListPage'
import { ExamSchedulePage } from '../shared/pages/academic/ExamSchedulePage'

// Management pages
import { FeesGroupPage } from '../shared/pages/management/FeesGroupPage'

// People pages
import { StudentListPage } from '../shared/pages/people/StudentListPage'
import { TeacherListPage } from '../shared/pages/people/TeacherListPage'
import { ParentListPage } from '../shared/pages/people/ParentListPage'
import { GuardianListPage } from '../shared/pages/people/GuardianListPage'

// Reports
import { AttendanceReportPage } from '../shared/pages/reports/AttendanceReportPage'

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
      // Main
      { path: '/', element: <AdminDashboardPage /> },

      // Academic
      { path: '/classes', element: <ClassListPage /> },
      { path: '/class-room', element: <ClassRoomPage /> },
      { path: '/class-routine', element: <ClassRoutinePage /> },
      { path: '/section', element: <SectionPage /> },
      { path: '/subject', element: <SubjectPage /> },
      { path: '/syllabus', element: <SyllabusPage /> },
      { path: '/time-table', element: <TimeTablePage /> },
      { path: '/home-work', element: <HomeWorkPage /> },
      { path: '/exams', element: <ExamListPage /> },
      { path: '/exam-schedule', element: <ExamSchedulePage /> },

      // Management
      { path: '/fees-group', element: <FeesGroupPage /> },

       // People
      { path: '/students', element: <StudentListPage /> },
      { path: '/teachers', element: <TeacherListPage /> },
      { path: '/parents', element: <ParentListPage /> },
      { path: '/guardians', element: <GuardianListPage /> },

      // Reports
      { path: '/reports/attendance', element: <AttendanceReportPage /> },
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
