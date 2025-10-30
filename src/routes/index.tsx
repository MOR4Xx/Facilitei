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
import { ClienteProfilePage } from "../pages/ClienteProfilePage"; // 👈 IMPORTAR
import { ClienteSettingsPage } from "../pages/ClienteSettingsPage"; // 👈 IMPORTAR
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
        path: "dashboard",
        element: <ProtectedRoute />, 
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
            path: "trabalhador/:id", 
            element: <TrabalhadorProfilePage />,
          },
          {
            path: "cliente/:id", // 👈 NOVA ROTA PÚBLICA DE CLIENTE
            element: <ClienteProfilePage />,
          },
           {
            path: "configuracoes", // 👈 NOVA ROTA PRIVADA DE EDIÇÃO
            element: <ClienteSettingsPage />,
          },
          {
            path: "chat/:servicoId", // Recebe o ID do serviço pela URL
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);