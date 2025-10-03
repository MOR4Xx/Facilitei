// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 👈 IMPORTE
import { router } from "./routes";
import "./index.css";

// Crie uma instância do client
const queryClient = new QueryClient(); // 👈 CRIE O CLIENT

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Envolva o RouterProvider com o QueryClientProvider */}
    <QueryClientProvider client={queryClient}> {/* 👈 ENVOLVA AQUI */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);