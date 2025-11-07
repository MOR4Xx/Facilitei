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
import { SolicitarServicoPage } from "../pages/SolicitarServicoPage";
import { TrabalhadorProfilePage } from "../pages/TrabalhadorProfilePage";
import { ClienteProfilePage } from "../pages/ClienteProfilePage";
import { ClienteSettingsPage } from "../pages/ClienteSettingsPage";
import { ChatPage } from "../pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // --- Rotas de Navegação Padrão ---
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "cadastro", element: <RegisterPage /> },

      // --- Perfis Públicos ---
      {
        path: "trabalhador/:id",
        element: <TrabalhadorProfilePage />,
      },
      {
        path: "cliente/:id",
        element: <ClienteProfilePage />,
      },

      // --- Hub Principal (Público por padrão) ---
      {
        path: "dashboard",
        children: [
          // --- Rotas Públicas do "Dashboard" ---
          {
            index: true, // Rota /dashboard
            element: <DashboardRootPage />, // Mostrará DashboardClientePage se não logado
          },
          {
            path: "solicitar", // Rota /dashboard/solicitar
            element: <SolicitarServicoPage />,
          },

          // --- Rotas Protegidas que EXIGEM login ---
          {
            element: <ProtectedRoute />, // Wrapper SÓ para rotas filhas privadas
            children: [
              {
                path: "configuracoes", // Rota /dashboard/configuracoes
                element: <ClienteSettingsPage />,
              },
              {
                path: "chat/:servicoId", // Rota /dashboard/chat/:id
                element: <ChatPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);