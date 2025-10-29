// Tipos baseados no seu backend Java e no db.json

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Trabalhador {
  id: number;
  nome: string;
  email: string;
  avatarUrl: string; // 👈 ADICIONADO
  endereco: Endereco;
  disponibilidade: string;
  notaTrabalhador: number;
  servicos: TipoServico[]; // 👈 NOVO CAMPO: Lista de serviços que ele pode fazer
  servicoPrincipal: TipoServico; // 👈 NOVO CAMPO: Serviço de destaque
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  avatarUrl: string; // 👈 ADICIONADO
  notaCliente: number;
  endereco: Endereco;
}

// Usando os Enums que você tem no backend
export type TipoServico =
  | "PEDREIRO"
  | "ELETRICISTA"
  | "ENCANADOR"
  // ... adicione todos os outros tipos do seu Enum TipoServico.java
  | "INSTALADOR_AR_CONDICIONADO";

export type StatusServico =
  | "SOLICITADO" // Cliente enviou, mas trabalhador não viu
  | "PENDENTE" // Está na fila do trabalhador
  | "EM_ANDAMENTO" // Trabalhador aceitou
  | "FINALIZADO" // Trabalhador concluiu
  | "CANCELADO" // Cliente ou Trabalhador cancelou
  | "RECUSADO"; // Trabalhador recusou

export interface Servico {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  trabalhadorId: number;
  clienteId: number;
  disponibilidadeId: number;
  tipoServico: TipoServico;
  statusServico: StatusServico;
}

// Adicione aqui as outras interfaces conforme necessário (Avaliacao, Solicitacao, etc.)
