import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { CourseEditor } from "../pages/CourseEditor";
import { DashboardPage } from "../pages/DashboardPage";
import { InstitutionAdminDashboard } from "../pages/InstitutionAdminDashboard";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { MainLayout } from "../layouts/MainLayout";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TeacherDashboard } from "../pages/TeacherDashboard";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "unauthorized", element: <UnauthorizedPage /> },
            {
                path: "dashboard/institution_admin",
                element: (
                    <ProtectedRoute allowedRoles={["INSTITUTION_ADMIN"]}>
                        <InstitutionAdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "dashboard/teacher",
                element: (
                    <ProtectedRoute allowedRoles={["TEACHER", "INSTITUTION_ADMIN"]}>
                        <TeacherDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "courses/:id/edit",
                element: (
                    <ProtectedRoute allowedRoles={["TEACHER", "INSTITUTION_ADMIN"]}>
                        <CourseEditor />
                    </ProtectedRoute>
                ),
            },
            {
                path: "dashboard/:role",
                element: (
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                ),
            },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
