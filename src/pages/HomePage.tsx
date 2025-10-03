import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="space-y-24">
      {/* Seção Hero */}
      <section className="text-center pt-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-dark-text tracking-tight">
          Sua solução de serviços <br /> em um <span className="text-accent">único lugar</span>.
        </h1>
        <p className="mt-6 text-lg text-dark-subtle max-w-2xl mx-auto">
          Conectamos você aos melhores prestadores de serviço da sua região com confiança e agilidade. De reparos domésticos a aulas particulares.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Seção "Como Funciona" com ícones */}
      <section>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-dark-surface p-8 rounded-xl border border-transparent hover:border-accent transition-all duration-300">
            <h3 className="text-2xl font-semibold text-dark-text mb-3">1. Descreva o Serviço</h3>
            <p className="text-dark-subtle">Diga-nos o que você precisa. Detalhes ajudam a encontrar o profissional ideal.</p>
          </div>
          <div className="bg-dark-surface p-8 rounded-xl border border-transparent hover:border-accent transition-all duration-300">
            <h3 className="text-2xl font-semibold text-dark-text mb-3">2. Receba Propostas</h3>
            <p className="text-dark-subtle">Profissionais qualificados enviam orçamentos diretamente para você.</p>
          </div>
          <div className="bg-dark-surface p-8 rounded-xl border border-transparent hover:border-accent transition-all duration-300">
            <h3 className="text-2xl font-semibold text-dark-text mb-3">3. Contrate com Segurança</h3>
            <p className="text-dark-subtle">Escolha a melhor opção, agende e realize o pagamento com tranquilidade.</p>
          </div>
        </div>
      </section>
    </div>
  );
}