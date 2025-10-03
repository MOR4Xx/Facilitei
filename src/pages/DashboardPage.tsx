export function DashboardPage() {
  const servicosAtivos = [
    { id: 1, titulo: "Reparo Elétrico na Cozinha", profissional: "Maria Oliveira", status: "EM ANDAMENTO" },
    { id: 2, titulo: "Instalação de Ar Condicionado", profissional: "João da Silva", status: "AGENDADO" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Seu Painel</h1>
        <button className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
          Solicitar Novo Serviço
        </button>
      </div>

      <div className="bg-primary p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-white">Bem-vindo de volta, Carlos!</h2>
        <p className="mt-2 text-lg text-blue-200">Você tem {servicosAtivos.length} serviços ativos no momento.</p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6">Acompanhamento de Serviços</h2>
        <div className="space-y-4">
          {servicosAtivos.map((servico) => (
            <div key={servico.id} className="bg-dark-surface p-6 rounded-lg flex justify-between items-center transition-all hover:shadow-lg hover:bg-gray-700/50">
              <div>
                <h3 className="text-xl font-bold text-dark-text">{servico.titulo}</h3>
                <p className="text-dark-subtle">Profissional: {servico.profissional}</p>
              </div>
              <span className="text-accent font-semibold px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                {servico.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}