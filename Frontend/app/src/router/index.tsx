import { Navigate, Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../shared/layouts/AuthLayout'
import { DashboardLayout } from '../shared/layouts/DashboardLayout'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'

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
import { StudentDashboardPage } from '../shared/pages/dashboard/StudentDashboardPage'
import { TeacherDashboardPage } from '../shared/pages/dashboard/TeacherDashboardPage'
import { ParentDashboardPage } from '../shared/pages/dashboard/ParentDashboardPage'
import { InstitutionDashboardPage } from '../shared/pages/management/InstitutionDashboardPage'
import { MessengerPage } from '../shared/pages/communication/MessengerPage'
import { NotificationsPage } from '../shared/pages/communication/NotificationsPage'
import { ApplicationListPage } from '../shared/pages/applications/ApplicationListPage'
import { LandingPage } from '../shared/pages/LandingPage'
import { SettingsPage } from '../shared/pages/settings/SettingsPage'

// Academic pages
import { ClassListPage } from '../shared/pages/academic/ClassListPage'
import { ClassRoomPage } from '../shared/pages/academic/ClassRoomPage'
import { ClassRoutinePage } from '../shared/pages/academic/ClassRoutinePage'
import { SectionPage } from '../shared/pages/academic/SectionPage'
import { SubjectPage } from '../shared/pages/academic/SubjectPage'
import { SyllabusPage } from '../shared/pages/academic/SyllabusPage'
import { TimeTablePage } from '../shared/pages/academic/TimeTablePage'
import { HomeWorkPage } from '../shared/pages/academic/HomeWorkPage'
import { KanbanPage } from '../shared/pages/academic/KanbanPage'
import { ExamListPage } from '../shared/pages/academic/ExamListPage'
import { ExamSchedulePage } from '../shared/pages/academic/ExamSchedulePage'
import { CoursePlayerPage } from '../shared/pages/academic/CoursePlayerPage'
import { AchievementsPage } from '../shared/pages/academic/AchievementsPage'
import { GradebookPage } from '../shared/pages/academic/GradebookPage'

// Management pages
import { FeesGroupPage } from '../shared/pages/management/FeesGroupPage'
import { StaffPage } from '../shared/pages/management/StaffPage'
import { InventoryPage } from '../shared/pages/management/InventoryPage'
import { LibraryPage } from '../shared/pages/management/LibraryPage'

// People pages
import { StudentListPage } from '../shared/pages/people/StudentListPage'
import { TeacherListPage } from '../shared/pages/people/TeacherListPage'
import { ParentListPage } from '../shared/pages/people/ParentListPage'
import { GuardianListPage } from '../shared/pages/people/GuardianListPage'

// Reports
import { AttendanceReportPage } from '../shared/pages/reports/AttendanceReportPage'
import { StudentReportPage } from '../shared/pages/reports/StudentReportPage'
import { ClassReportPage } from '../shared/pages/reports/ClassReportPage'

// Profiles
import { StudentProfilePage } from '../shared/pages/profiles/StudentProfilePage'
import { TeacherProfilePage } from '../shared/pages/profiles/TeacherProfilePage'

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
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      // Main
      { path: '/', element: <AdminDashboardPage /> },
      { path: '/landing', element: <LandingPage /> },
      { path: '/institution-dashboard', element: <InstitutionDashboardPage /> },
      { path: '/teacher-dashboard', element: <TeacherDashboardPage /> },
      { path: '/parent-dashboard', element: <ParentDashboardPage /> },
      { path: '/student-dashboard', element: <StudentDashboardPage /> },
      { path: '/applications', element: <ApplicationListPage /> },
      { path: '/messenger', element: <MessengerPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/settings', element: <SettingsPage /> },

      // Academic
      { path: '/classes', element: <ClassListPage /> },
      { path: '/class-room', element: <ClassRoomPage /> },
      { path: '/class-routine', element: <ClassRoutinePage /> },
      { path: '/section', element: <SectionPage /> },
      { path: '/subject', element: <SubjectPage /> },
      { path: '/syllabus', element: <SyllabusPage /> },
      { path: '/course-player', element: <CoursePlayerPage /> },
      { path: '/time-table', element: <TimeTablePage /> },
      { path: '/home-work', element: <HomeWorkPage /> },
      { path: '/kanban', element: <KanbanPage /> },
      { path: '/exams', element: <ExamListPage /> },
      { path: '/exam-schedule', element: <ExamSchedulePage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/gradebook', element: <GradebookPage /> },

      // Management
      { path: '/fees-group', element: <FeesGroupPage /> },
      { path: '/staff', element: <StaffPage /> },
      { path: '/inventory', element: <InventoryPage /> },
      { path: '/library', element: <LibraryPage /> },

      // People
      { path: '/students', element: <StudentListPage /> },
      { path: '/students/:id', element: <StudentProfilePage /> },
      { path: '/teachers', element: <TeacherListPage /> },
      { path: '/teachers/:id', element: <TeacherProfilePage /> },
      { path: '/parents', element: <ParentListPage /> },
      { path: '/guardians', element: <GuardianListPage /> },

      // Reports
      { path: '/reports/attendance', element: <AttendanceReportPage /> },
      { path: '/reports/student', element: <StudentReportPage /> },
      { path: '/reports/class', element: <ClassReportPage /> },
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
