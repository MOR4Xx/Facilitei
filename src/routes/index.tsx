// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { AboutPage } from "../pages/AboutPage";
import { FAQPage } from "../pages/FAQPage";
import { LoginPage } from "../pages/LoginPage"; // 👈 IMPORTE
import { RegisterPage } from "../pages/RegisterPage"; // 👈 IMPORTE

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "faq",
        element: <FAQPage />,
      },
      {
        path: "login", // 👈 ADICIONE A ROTA
        element: <LoginPage />,
      },
      {
        path: "cadastro", // 👈 ADICIONE A ROTA
        element: <RegisterPage />,
      },
    ],
  },
]);