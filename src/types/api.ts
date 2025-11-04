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
  senha: string; 
  avatarUrl: string; 
  telefone: string; 
  endereco: Endereco;
  disponibilidade: string;
  notaTrabalhador: number;
  servicos: TipoServico[]; 
  servicoPrincipal: TipoServico;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  senha: string; 
  telefone: string;
  avatarUrl: string; 
  notaCliente: number;
  endereco: Endereco;
}

// Usando os Enums que você tem no backend
export type TipoServico =
  | "PEDREIRO"
  | "ELETRICISTA"
  | "ENCANADOR"
  // ... adicionar todos os outros tipos do seu Enum TipoServico.java
  | "INSTALADOR_AR_CONDICIONADO";

export type StatusServico =
  | "SOLICITADO" // Cliente enviou, mas trabalhador não viu
  | "PENDENTE" // Está na fila do trabalhador
  | "EM_ANDAMENTO" // Trabalhador aceitou
  | "PENDENTE_APROVACAO" // Trabalhador solicitou finalização, cliente precisa aprovar
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

export interface AvaliacaoServico {
  id?: number; // O ID é opcional ao criar
  clienteId: number;
  servicoId: number;
  nota: number;
  comentario: string;
  fotos?: string[];
}

export interface AvaliacaoTrabalhador {
  id?: number;
  clienteId: number;
  trabalhadorId: number;
  servicoId: number; // 👈 Adicionado para rastreio
  nota: number;
  comentario: string;
  fotos?: string[];
  clienteNome?: string; // Para exibição
}

export interface AvaliacaoCliente {
  id?: number;
  trabalhadorId: number;
  clienteId: number;
  servicoId: number; // 👈 Adicionado para rastreio
  nota: number;
  comentario: string;
  fotos?: string[];
  trabalhadorNome?: string; // Para exibição
}