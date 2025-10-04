// src/routes/index.tsx

import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { FAQPage } from "../pages/FAQPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute"; // 👈 IMPORT
import { DashboardRootPage } from "../pages/DashboardRootPage"; // 👈 IMPORT

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "cadastro", element: <RegisterPage /> },
      {
        path: "dashboard",
        element: <ProtectedRoute />, // 👈 ROTA PROTEGIDA
        children: [
          {
            index: true,
            element: <DashboardRootPage />, // 👈 RENDERIZA O ESCOLHEDOR DE DASHBOARD
          },
        ],
      },
    ],
  },
]);
