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
  endereco: Endereco;
  disponibilidade: string;
  notaTrabalhador: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  notaCliente: number;
  endereco: Endereco;
}

// Usando os Enums que você tem no backend
export type TipoServico =
  | 'PEDREIRO'
  | 'ELETRICISTA'
  | 'ENCANADOR'
  // ... adicione todos os outros tipos do seu Enum TipoServico.java
  | 'INSTALADOR_AR_CONDICIONADO';

export type StatusServico =
  | 'SOLICITADO'
  | 'EM_ANDAMENTO'
  | 'FINALIZADO'
  // ... adicione todos os outros status do seu Enum StatusServico.java
  | 'PENDENTE';

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