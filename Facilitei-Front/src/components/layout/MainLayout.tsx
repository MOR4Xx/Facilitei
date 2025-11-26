import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* AQUI ESTÁ O PULO DO GATO: 
         Adicionei 'pt-24 md:pt-28' (padding-top) para empurrar o conteúdo 
         para baixo e não ficar escondido atrás do Header fixo.
      */}
      <main className="flex-grow container mx-auto px-6 pb-12 pt-24 md:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
