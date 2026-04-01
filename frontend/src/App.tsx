import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
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
import { RoleGuard } from './components/RoleGuard'
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
        <Route path="/login" element={<AuthPage mode="login" role="student" />} />
        <Route path="/register" element={<AuthPage mode="register" role="student" />} />
        <Route path="/login/:role" element={<AuthRoleRoute mode="login" resolveRole={resolveRole} />} />
        <Route path="/register/:role" element={<AuthRoleRoute mode="register" resolveRole={resolveRole} />} />

        {/* ── Student ────────────────────────────────────────────────── */}
        <Route path="/dashboard" element={<HomeDashboard language={language} onLanguageChange={setLanguage} />} />
        <Route path="/courses" element={<CoursesPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/chat" element={<ChatPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/profile" element={<ProfilePage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/schedule" element={<SchedulePage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/resources" element={<ResourcesPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/settings" element={<SettingsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/tasks" element={<StudentTaskPage language={language} onLanguageChange={setLanguage} />} />
        <Route path="/tournaments" element={<StudentTournamentsPage language={language} onLanguageChange={setLanguage} />} />

        {/* ── Teacher (role-guarded) ──────────────────────────────────── */}
        <Route path="/teacher" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherWorkspacePage language={language} onLanguageChange={setLanguage} />
          </RoleGuard>
        } />
        <Route path="/teacher/schedule" element={
          <RoleGuard requiredRole="teacher" fallback="/login/teacher">
            <TeacherWorkspacePage language={language} onLanguageChange={setLanguage} />
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
            <TeacherWorkspacePage language={language} onLanguageChange={setLanguage} />
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

        {/* ── Fallback ────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
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

