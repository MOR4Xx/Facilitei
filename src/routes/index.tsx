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
// 1. Importar a nova página Raiz
import { SettingsRootPage } from "../pages/SettingsRootPage"; 
import { ChatPage } from "../pages/ChatPage";

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
        path: "trabalhador/:id",
        element: <TrabalhadorProfilePage />,
      },
      {
        path: "cliente/:id",
        element: <ClienteProfilePage />,
      },

      {
        path: "dashboard",
        children: [
          {
            index: true, 
            element: <DashboardRootPage />, 
          },
          {
            path: "solicitar",
            element: <SolicitarServicoPage />,
          },

          {
            element: <ProtectedRoute />, 
            children: [
              {
                path: "configuracoes", 
                // 2. Usar a SettingsRootPage aqui
                element: <SettingsRootPage />, 
              },
              {
                path: "chat/:servicoId",
                element: <ChatPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);