import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import type { Servico } from '../types/api'; // 👈 IMPORTAMOS O TIPO DAQUI

// A função de fetch continua a mesma
const fetchServicos = async (): Promise<Servico[]> => {
  const response = await fetch('http://localhost:3333/servicos');
  if (!response.ok) {
    throw new Error('Não foi possível buscar os serviços.');
  }
  return response.json();
};

export function DashboardPage() {
  // O useQuery agora sabe exatamente o que esperar, graças à importação
  const { data: servicos, isLoading, error } = useQuery<Servico[]>({
    queryKey: ['servicos'],
    queryFn: fetchServicos,
  });

  if (isLoading) {
    return <Typography>Carregando serviços...</Typography>;
  }

  if (error) {
    return <Typography className="text-red-500">Erro: {error.message}</Typography>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <Typography as="h1">Seu Painel</Typography>
        <Button>Solicitar Novo Serviço</Button>
      </div>

      <Card className="bg-primary mb-12">
        <Typography as="h2" className="text-white">Bem-vindo de volta, Carlos!</Typography>
        <p className="mt-2 text-lg text-blue-200">
          Você tem {servicos?.length || 0} serviços ativos no momento.
        </p>
      </Card>

      <div>
        <Typography as="h2" className="mb-6">Acompanhamento de Serviços</Typography>
        <div className="space-y-4">
          {servicos?.map((servico) => (
            <Card key={servico.id} className="flex justify-between items-center">
              <div>
                <Typography as="h3">{servico.titulo}</Typography>
                <Typography as="p">Profissional: ID {servico.trabalhadorId}</Typography>
              </div>
              <span className="text-accent font-semibold px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                {/* Usando a propriedade correta do tipo 'Servico' */}
                {servico.statusServico} 
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}