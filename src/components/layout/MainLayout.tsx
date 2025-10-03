// src/components/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    // 👇 ATUALIZE ESTA LINHA 👇
    <div className="flex flex-col min-h-screen bg-background-dark text-text-light">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}