// src/components/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* ATUALIZADO: Padding py-6 em telas pequenas, py-12 em médias e maiores */}
      <main className="flex-grow container mx-auto px-6 py-6 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}