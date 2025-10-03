// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { AboutPage } from "../pages/AboutPage";
import { FAQPage } from "../pages/FAQPage"; // 👈 Importe a nova página

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
        path: "faq", // 👈 Adicione a nova rota
        element: <FAQPage />,
      },
    ],
  },
]);