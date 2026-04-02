import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { NotFoundPage } from './components/NotFoundPage'
import { AboutPage } from './components/AboutPage'
import { HelpPage } from './components/HelpPage'
import { HomeDashboard } from './components/HomeDashboard'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { ChatPage } from './components/ChatPage'
import { ProfilePage } from './components/ProfilePage'
import { ResourcesPage } from './components/ResourcesPage'
import { SettingsPage } from './components/SettingsPage'
import { SchedulePage } from './components/SchedulePage'
import { CourseDetailsPage } from './components/CourseDetailsPage'
import { CoursesPage } from './components/CoursesPage'
import { TeacherWorkspacePage } from './components/TeacherWorkspacePage'
import { TeacherCourseBuilderPage } from './components/TeacherCourseBuilderPage'
import { TeacherDashboardPage } from './components/TeacherDashboardPage'
import { TeacherCoursesPage } from './components/TeacherCoursesPage'
import { TeacherStudentsPage } from './components/TeacherStudentsPage'
import { TeacherAnalyticsPage } from './components/TeacherAnalyticsPage'
import { InstitutionDashboardPage } from './components/InstitutionDashboardPage'
import { InstitutionStructurePage } from './components/InstitutionStructurePage'
import { InstitutionUsersPage } from './components/InstitutionUsersPage'
import { InstitutionAcademicPage } from './components/InstitutionAcademicPage'
import { InstitutionAnalyticsPage } from './components/InstitutionAnalyticsPage'
import { InstitutionCoursesPage } from './components/InstitutionCoursesPage'
import { InstitutionFinancePage } from './components/InstitutionFinancePage'
import { InstitutionTournamentsPage } from './components/InstitutionTournamentsPage'
import { InstitutionCommunicationsPage } from './components/InstitutionCommunicationsPage'
import { InstitutionIntegrationsPage } from './components/InstitutionIntegrationsPage'
import { InstitutionSettingsPage } from './components/InstitutionSettingsPage'
import { ParentDashboardPage } from './components/ParentDashboardPage'
import { ParentGradesPage } from './components/ParentGradesPage'
import { ParentAttendancePage } from './components/ParentAttendancePage'
import { ParentHomeworkPage } from './components/ParentHomeworkPage'
import { ParentMotivationPage } from './components/ParentMotivationPage'
import { ParentAchievementsPage } from './components/ParentAchievementsPage'
import { StudentTaskPage } from './components/StudentTaskPage'
import { StudentTournamentsPage } from './components/StudentTournamentsPage'
import { ContentLibraryPage } from './components/ContentLibraryPage'
import { StudentAchievementsPage } from './components/StudentAchievementsPage'
import { StudentProgressPage } from './components/StudentProgressPage'
import { TeacherGradesPage } from './components/TeacherGradesPage'
import { TeacherSchedulePage } from './components/TeacherSchedulePage'
import { NotificationsPage } from './components/NotificationsPage'
import { CertificatesPage } from './components/CertificatesPage'
import { SearchPage } from './components/SearchPage'
import { LeaderboardPage } from './components/LeaderboardPage'
import { TeacherProfilePage } from './components/TeacherProfilePage'
import { InstitutionAdmissionsPage } from './components/InstitutionAdmissionsPage'
import { TeacherReportsPage } from './components/TeacherReportsPage'
import { PlacementTestPage } from './components/PlacementTestPage'
import { ProforientationPage } from './components/ProforientationPage'
import { CoursePlayerPage } from './components/CoursePlayerPage'
import { XpShopPage } from './components/XpShopPage'
import { CheckoutPage } from './components/CheckoutPage'
import { RoleGuard } from './components/RoleGuard'
import { AuthGuard } from './components/AuthGuard'
import type { Language } from './i18n/translations'

type AuthRole = 'student' | 'teacher' | 'parent' | 'institution'

function isAuthRole(value: string | undefined): value is AuthRole {
  return value === 'student' || value === 'teacher' || value === 'parent' || value === 'institution'
}

function App() {
  const [language, setLanguage] = useState<Language>('ru')
  const resolveRole = (value: string | undefined): AuthRole => (isAuthRole(value) ? value : 'student')

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ─────────────────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<AuthPage mode="login" role="student" />} />
        <Route path="/register" element={<AuthPage mode="register" role="student" />} />
        <Route path="/login/:role" element={<AuthRoleRoute mode="login" resolveRole={resolveRole} />} />
        <Route path="/register/:role" element={<AuthRoleRoute mode="register" resolveRole={resolveRole} />} />

        {/* ── Student (auth-guarded) ──────────────────────────────── */}
        <Route path="/dashboard" element={<AuthGuard><HomeDashboard language={language} onLanguageChange={setLanguage} /></AuthGuard>} />
        <Route path="/courses" element={<AuthGuard><CoursesPage language={language} onLanguageChange={setLanguage} /></AuthGuard>} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/chat" element={<ChatPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/profile" element={<ProfilePage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/schedule" element={<SchedulePage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/resources" element={<ResourcesPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/settings" element={<SettingsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/tasks" element={<StudentTaskPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/tournaments" element={<StudentTournamentsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/library" element={<ContentLibraryPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/achievements" element={<StudentAchievementsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/progress" element={<StudentProgressPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/proftest" element={<ProforientationPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/shop" element={<XpShopPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<CoursePlayerPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/checkout" element={<AuthGuard><CheckoutPage language={language} onLanguageChange={setLanguage} /></AuthGuard>} />

        {/* ── Teacher (role-guarded) ──────────────────────────────────── */}
        <Route path="/teacher" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherWorkspacePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/schedule" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherSchedulePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/dashboard" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherDashboardPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/courses" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherCoursesPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/courses/new" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherCourseBuilderPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/students" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherStudentsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/analytics" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherAnalyticsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/reports" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherReportsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/chat" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <ChatPage language={language} onLanguageChange={setLanguage} variant="teacher" />
          </RoleGuard>
        } />
        <Route path="/teacher/settings" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <SettingsPage language={language} onLanguageChange={setLanguage} variant="teacher" />
          </RoleGuard>
        } />
        <Route path="/teacher/grades" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherGradesPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/notifications" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <NotificationsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/help" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <HelpPage />
          </RoleGuard>
        } />
        <Route path="/teacher/search" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <SearchPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/leaderboard" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <LeaderboardPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/certificates" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <CertificatesPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/profile" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <ProfilePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />

        {/* ── Institution (role-guarded) ────────────────────────────── */}
        <Route path="/institution" element={<Navigate to="/institution/dashboard" replace />} />
        <Route path="/institution/dashboard" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionDashboardPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/structure" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionStructurePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/users" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionUsersPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/academic" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionAcademicPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/analytics" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionAnalyticsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/courses" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionCoursesPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/finance" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionFinancePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/tournaments" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionTournamentsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/communications" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionCommunicationsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/integrations" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionIntegrationsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/settings" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionSettingsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/admissions" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <InstitutionAdmissionsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/notifications" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <NotificationsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/help" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <HelpPage />
          </RoleGuard>
        } />
        <Route path="/institution/search" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <SearchPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/institution/profile" element={
          <RoleGuard requiredRole="institution" fallback="/login/institution">
            <ProfilePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />

        {/* ── Global / Shared Pages ──────────────────────────────────── */}
        <Route path="/search" element={<SearchPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/leaderboard" element={<LeaderboardPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/notifications" element={<NotificationsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/certificates" element={<CertificatesPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/teachers/:id" element={<TeacherProfilePage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/placement-test" element={<PlacementTestPage language={language} onLanguageChange={setLanguage} />} />

        {/* ── Parent (role-guarded) ────────────────────────────────── */}
        <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="/parent/dashboard" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentDashboardPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/grades" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentGradesPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/attendance" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentAttendancePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/homework" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentHomeworkPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/motivation" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentMotivationPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/chat" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ChatPage language={language} onLanguageChange={setLanguage} variant="parent" />
          </RoleGuard>
        } />
        <Route path="/parent/courses" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <CoursesPage language={language} onLanguageChange={setLanguage} variant="parent" />
          </RoleGuard>
        } />
        <Route path="/parent/achievements" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ParentAchievementsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/settings" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <SettingsPage language={language} onLanguageChange={setLanguage} variant="parent" />
          </RoleGuard>
        } />
        <Route path="/parent/notifications" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <NotificationsPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/help" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <HelpPage />
          </RoleGuard>
        } />
        <Route path="/parent/search" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <SearchPage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/parent/profile" element={
          <RoleGuard requiredRole="parent" fallback="/login/parent">
            <ProfilePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />

        {/* ── Fallback ────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function AuthRoleRoute({ mode, resolveRole }: { mode: 'login' | 'register'; resolveRole: (value: string | undefined) => AuthRole }) {
  const params = useParams<{ role?: string }>()
  const role = resolveRole(params.role)
  return <AuthPage mode={mode} role={role} />
}

export default App

