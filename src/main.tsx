// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // 👈 Importe o RouterProvider
import { router } from "./routes"; // 👈 Importe nosso roteador
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Substitua o <App /> pelo <RouterProvider /> */}
    <RouterProvider router={router} />
  </StrictMode>
);