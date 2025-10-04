// src/pages/AboutPage.tsx
export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center text-accent">Sobre o Facilitei</h1>
      <p className="mt-6 text-lg text-center text-dark-subtle">
        Nossa missão é simplificar a forma como você encontra e contrata serviços locais, trazendo mais segurança, praticidade e qualidade para o seu dia a dia.
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">Nossa Visão</h2>
          <p className="text-dark-subtle">
            Acreditamos que todos merecem acesso fácil a profissionais qualificados e de confiança. O Facilitei nasceu da necessidade de criar uma ponte segura entre clientes e prestadores de serviço, eliminando a incerteza e a burocracia do processo de contratação.
          </p>
        </div>
        <div className="bg-dark-surface p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-dark-text mb-3">Nossos Valores</h3>
          <ul className="list-disc list-inside space-y-2 text-dark-text">
            <li><span className="font-semibold text-accent">Confiança:</span> Verificação e avaliação contínua dos profissionais.</li>
            <li><span className="font-semibold text-accent">Qualidade:</span> Compromisso com a excelência em cada serviço.</li>
            <li><span className="font-semibold text-accent">Simplicidade:</span> Uma plataforma intuitiva do início ao fim.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}