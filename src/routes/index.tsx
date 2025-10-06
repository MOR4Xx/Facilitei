// src/routes/index.tsx

import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { FAQPage } from "../pages/FAQPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute"; 
import { DashboardRootPage } from "../pages/DashboardRootPage"; 
import { SolicitarServicoPage } from "../pages/SolicitarServicoPage"; // 👈 IMPORT
import { TrabalhadorProfilePage } from "../pages/TrabalhadorProfilePage";

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
        element: <ProtectedRoute />, 
        children: [
          {
            index: true,
            element: <DashboardRootPage />, 
          },
          {
            path: "solicitar", // 👈 NOVA ROTA DE SOLICITAÇÃO
            element: <SolicitarServicoPage />,
          },
          {
            path: "trabalhador/:id", // 👈 NOVA ROTA DE PERFIL DINÂMICA
            element: <TrabalhadorProfilePage />,
          },
        ],
      },
    ],
  },
]);