// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 👈 IMPORTE
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import "./index.css";

// Crie uma instância do client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita recarregar ao trocar de aba
      staleTime: 1000 * 60 * 5, // Mantém os dados "frescos" por 5 minutos
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Envolva o RouterProvider com o QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* 👈 ENVOLVA AQUI */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111E35", // Cor 'dark.surface'
            color: "#E2E8F0", // Cor 'dark.text'
            border: "1px solid #0D9488", // Cor 'primary'
          },
          success: {
            iconTheme: {
              primary: "#A3E635", // Cor 'accent'
              secondary: "#111E35",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444", // Cor 'status.danger'
              secondary: "#111E35",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
