import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { InstitutionAdminDashboard } from "../pages/InstitutionAdminDashboard";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
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
