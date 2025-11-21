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
  id: string;
  nome: string;
  email: string;
  senha?: string;
  avatarUrl: string;
  telefone: string;
  endereco: Endereco;
  disponibilidade: string;
  notaTrabalhador: number;
  servicos: TipoServico[];
  servicoPrincipal: TipoServico;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  telefone: string;
  avatarUrl: string;
  notaCliente: number;
  endereco: Endereco;
}

export type TipoServico =
  // Construção e Reformas
  | "PEDREIRO"
  | "ELETRICISTA"
  | "ENCANADOR"
  | "PINTOR"
  | "GESSEIRO"
  | "AZULEJISTA"
  | "MARCENEIRO"
  | "SERRALHEIRO"
  // Serviços Domésticos
  | "DIARISTA"
  | "FAXINEIRA"
  | "PASSADEIRA"
  | "COZINHEIRA"
  | "CUIDADOR_IDOSOS"
  | "BABA"
  // Serviços Técnicos
  | "TECNICO_INFORMATICA"
  | "TECNICO_ELETRODOMESTICOS"
  | "INSTALADOR_AR_CONDICIONADO"
  | "TECNICO_REDES"
  | "INSTALADOR_CAMERAS"
  // Jardinagem e Exteriores
  | "JARDINEIRO"
  | "PAISAGISTA"
  | "DEDETIZADOR"
  | "LIMPADOR_PISCINA"
  // Educação e Aulas Particulares
  | "REFORCO_ESCOLAR"
  | "AULAS_INGLES"
  | "AULAS_MUSICA"
  | "AULAS_INFORMATICA"
  | "PERSONAL_TRAINER";

// --- 👇 ARRAY HELPER (para RegisterPage) ---
export const allServicosList: TipoServico[] = [
  "PEDREIRO",
  "ELETRICISTA",
  "ENCANADOR",
  "PINTOR",
  "GESSEIRO",
  "AZULEJISTA",
  "MARCENEIRO",
  "SERRALHEIRO",
  "DIARISTA",
  "FAXINEIRA",
  "PASSADEIRA",
  "COZINHEIRA",
  "CUIDADOR_IDOSOS",
  "BABA",
  "TECNICO_INFORMATICA",
  "TECNICO_ELETRODOMESTICOS",
  "INSTALADOR_AR_CONDICIONADO",
  "TECNICO_REDES",
  "INSTALADOR_CAMERAS",
  "JARDINEIRO",
  "PAISAGISTA",
  "DEDETIZADOR",
  "LIMPADOR_PISCINA",
  "REFORCO_ESCOLAR",
  "AULAS_INGLES",
  "AULAS_MUSICA",
  "AULAS_INFORMATICA",
  "PERSONAL_TRAINER",
];

// --- 👇 ESTRUTURA DE CATEGORIAS (O "SUSTO") ---
export type CategoriaGrupo =
  | "Construção e Reformas"
  | "Serviços Domésticos"
  | "Serviços Técnicos"
  | "Jardinagem e Exteriores"
  | "Educação e Aulas";

export const serviceCategories: Record<CategoriaGrupo, TipoServico[]> = {
  "Construção e Reformas": [
    "PEDREIRO",
    "ELETRICISTA",
    "ENCANADOR",
    "PINTOR",
    "GESSEIRO",
    "AZULEJISTA",
    "MARCENEIRO",
    "SERRALHEIRO",
  ],
  "Serviços Domésticos": [
    "DIARISTA",
    "FAXINEIRA",
    "PASSADEIRA",
    "COZINHEIRA",
    "CUIDADOR_IDOSOS",
    "BABA",
  ],
  "Serviços Técnicos": [
    "TECNICO_INFORMATICA",
    "TECNICO_ELETRODOMESTICOS",
    "INSTALADOR_AR_CONDICIONADO",
    "TECNICO_REDES",
    "INSTALADOR_CAMERAS",
  ],
  "Jardinagem e Exteriores": [
    "JARDINEIRO",
    "PAISAGISTA",
    "DEDETIZADOR",
    "LIMPADOR_PISCINA",
  ],
  "Educação e Aulas": [
    "REFORCO_ESCOLAR",
    "AULAS_INGLES",
    "AULAS_MUSICA",
    "AULAS_INFORMATICA",
    "PERSONAL_TRAINER",
  ],
};

// Helper para pegar todos os nomes dos grupos
export const allCategoryGroups = Object.keys(
  serviceCategories
) as CategoriaGrupo[];

export type StatusServico =
  | "SOLICITADO" // Cliente enviou, mas trabalhador não viu
  | "PENDENTE" // Está na fila do trabalhador
  | "EM_ANDAMENTO" // Trabalhador aceitou
  | "PENDENTE_APROVACAO" // Trabalhador solicitou finalização, cliente precisa aprovar
  | "FINALIZADO" // Trabalhador concluiu
  | "CANCELADO" // Cliente ou Trabalhador cancelou
  | "RECUSADO"; // Trabalhador recusou

export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  trabalhadorId: string;
  clienteId: string;
  disponibilidadeId: number;
  tipoServico: TipoServico;
  statusServico: StatusServico;
}

export interface AvaliacaoServico {
  id?: string; // O ID é opcional ao criar
  clienteId: string;
  servicoId: string;
  nota: number;
  comentario: string;
  fotos?: string[];
}

export interface AvaliacaoTrabalhador {
  id?: string;
  clienteId: string;
  trabalhadorId: string;
  servicoId: string; // 👈 Adicionado para rastreio
  nota: number;
  comentario: string;
  fotos?: string[];
  clienteNome?: string; // Para exibição
}

export interface AvaliacaoCliente {
  id?: string;
  trabalhadorId: string;
  clienteId: string;
  servicoId: string; // 👈 Adicionado para rastreio
  nota: number;
  comentario: string;
  fotos?: string[];
  trabalhadorNome?: string; // Para exibição
}
