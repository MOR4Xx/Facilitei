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

      // PERFIL PÚBLICO (Acesso Livre)
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
            element: <DashboardRootPage />, // PÚBLICO (Decide dentro se é visita ou cliente)
          },
          {
            path: "solicitar",
            element: <SolicitarServicoPage />, // PÚBLICO (Busca de profissionais)
          },

          // ROTAS PROTEGIDAS (Exigem Login)
          {
            element: <ProtectedRoute />, 
            children: [
              {
                path: "configuracoes", 
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