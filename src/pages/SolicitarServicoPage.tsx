// src/pages/SolicitarServicoPage.tsx

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Typography } from '../components/ui/Typography';
import {
  type Trabalhador,
  type TipoServico,
  type CategoriaGrupo,
  serviceCategories,
  allCategoryGroups,
} from '../types/api';
import { TrabalhadorCard } from '../components/ui/TrabalhadorCard';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { RatingFilter } from '../components/ui/RatingFilter';
import {
  BuildingIcon,
  HomeIcon,
  WrenchIcon,
  LeafIcon,
  BookIcon,
  SparklesIcon,
} from '../components/ui/CategoryIcons';

// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 👇 --- CORREÇÃO AQUI --- 👇
// (Este objeto estava faltando)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};
// 👆 --- FIM DA CORREÇÃO --- 👆

// --- FUNÇÃO DE BUSCA ---
const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const response = await fetch('http://localhost:3333/trabalhadores');
  if (!response.ok) throw new Error('Não foi possível buscar os trabalhadores.');
  return response.json();
};

// --- HELPER DE ÍCONES ---
const categoryIcons: Record<CategoriaGrupo | 'TODOS', JSX.Element> = {
  'TODOS': <SparklesIcon className="w-8 h-8" />,
  'Construção e Reformas': <BuildingIcon className="w-8 h-8" />,
  'Serviços Domésticos': <HomeIcon className="w-8 h-8" />,
  'Serviços Técnicos': <WrenchIcon className="w-8 h-8" />,
  'Jardinagem e Exteriores': <LeafIcon className="w-8 h-8" />,
  'Educação e Aulas': <BookIcon className="w-8 h-8" />,
};

// --- COMPONENTE PRINCIPAL ---
export function SolicitarServicoPage() {
  // --- ESTADOS DOS FILTROS ---
  const [selectedGroup, setSelectedGroup] =
    useState<CategoriaGrupo | 'TODOS'>('TODOS');
  const [selectedService, setSelectedService] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [locationTerm, setLocationTerm] = useState('');

  const {
    data: trabalhadores,
    isLoading,
    isError,
  } = useQuery<Trabalhador[]>({
    queryKey: ['allTrabalhadores'],
    queryFn: fetchTrabalhadores,
  });

  // --- LÓGICA DE FILTRAGEM ---
  const filteredTrabalhadores = useMemo(() => {
    if (!trabalhadores) return [];

    const normSearchTerm = searchTerm.toLowerCase();
    const normLocationTerm = locationTerm.toLowerCase();

    return trabalhadores.filter(t => {
      // 1. Filtro de Grupo de Categoria
      if (selectedGroup !== 'TODOS' && 
          !serviceCategories[selectedGroup].some(s => t.servicos.includes(s))) {
        return false;
      }
      
      // 2. Filtro de Serviço Específico
      if (selectedService !== 'TODOS' && !t.servicos.includes(selectedService as TipoServico)) {
        return false;
      }
      
      // 3. Filtro de Nota
      if (t.notaTrabalhador < minRating) {
        return false;
      }
      
      // 4. Filtro de Nome
      if (normSearchTerm && !t.nome.toLowerCase().includes(normSearchTerm)) {
        return false;
      }
      
      // 5. Filtro de Localização (Cidade ou Estado)
      if (normLocationTerm && 
          !t.endereco.cidade.toLowerCase().includes(normLocationTerm) &&
          !t.endereco.estado.toLowerCase().includes(normLocationTerm)) {
        return false;
      }
      
      return true;
    });
  }, [trabalhadores, selectedGroup, selectedService, searchTerm, minRating, locationTerm]);

  // Lista de serviços para o dropdown, baseada no grupo selecionado
  const availableServices = useMemo(() => {
    if (selectedGroup === 'TODOS') return [];
    return serviceCategories[selectedGroup];
  }, [selectedGroup]);

  // Handler para trocar o grupo
  const handleGroupChange = (group: CategoriaGrupo | 'TODOS') => {
    setSelectedGroup(group);
    setSelectedService('TODOS'); // Reseta o serviço específico
  };

  // Helper para formatar o nome do serviço (PEDREIRO -> Pedreiro)
  const formatServiceName = (service: string) => {
    return service.replace(/_/g, ' ').toLowerCase();
  };

  // Estilo base para os inputs/selects do filtro
  const filterInputStyle = `
    w-full 
    bg-dark-surface 
    border-2 
    border-primary/50 
    rounded-lg 
    p-3 
    text-dark-text 
    placeholder-dark-subtle/50
    transition-all duration-300
    focus:outline-none 
    focus:border-accent 
    focus:shadow-glow-accent/50
  `;

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Buscando Profissionais...</Typography>
        <p className="text-dark-subtle mt-4">Aguarde, estamos conectando você.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Erro na Busca!</Typography>
        <p className="text-dark-subtle mt-4">Não foi possível conectar ao servidor (db.json).</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="text-center">
        <Typography as="h1" className="!text-accent mb-2">
          Encontre o Profissional Ideal
        </Typography>
        <Typography as="p" className="text-lg max-w-3xl mx-auto">
          Comece selecionando uma categoria ou use os filtros avançados.
        </Typography>
      </motion.div>

      {/* --- O "SUSTO" (SELETOR DE CATEGORIAS VISUAL) --- */}
      <motion.div
        variants={itemVariants} // 👈 Agora 'itemVariants' existe
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {['TODOS', ...allCategoryGroups].map(group => {
          const isSelected = selectedGroup === group;
          const groupName = group as CategoriaGrupo | 'TODOS';
          return (
            <motion.div
              key={groupName}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => handleGroupChange(groupName)}
                className={`
                  flex flex-col items-center justify-center 
                  w-full h-32 md:h-36 
                  p-4 rounded-xl 
                  border-2 
                  cursor-pointer transition-all duration-300
                  ${isSelected
                    ? 'bg-accent/20 border-accent shadow-glow-accent'
                    : 'bg-dark-surface/70 backdrop-blur-lg border-primary/20 hover:border-primary/60'
                  }
                `}
              >
                <span className={isSelected ? 'text-accent' : 'text-primary/70'}>
                  {categoryIcons[groupName]}
                </span>
                <Typography as="span" className={`
                  !text-sm font-semibold text-center mt-3
                  ${isSelected ? '!text-accent' : '!text-dark-text'}
                `}>
                  {groupName}
                </Typography>
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* --- PAINEL DE FILTROS AVANÇADOS --- */}
      <Card variants={itemVariants} className="!bg-dark-surface/90 p-6"> 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          {/* Filtro 1: Serviço Específico (Dinâmico) */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-primary mb-2">
              Serviço Específico
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={filterInputStyle}
              disabled={selectedGroup === 'TODOS'} 
            >
              <option value="TODOS">
                {selectedGroup === 'TODOS' ? 'Selecione um grupo primeiro' : `Todos de ${selectedGroup}`}
              </option>
              {availableServices.map(service => (
                <option key={service} value={service} className="bg-dark-surface capitalize">
                  {formatServiceName(service)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro 2: Nome */}
          <Input
            label="Nome do Profissional"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: João da Silva"
          />

          {/* Filtro 3: Localização */}
          <Input
            label="Localização (Cidade/UF)"
            name="location"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            placeholder="Ex: São Paulo ou SP"
          />
          
          {/* Filtro 4: Nota Mínima (NOVO COMPONENTE) */}
           <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Nota Mínima
            </label>
            <RatingFilter
              rating={minRating}
              onRatingChange={setMinRating}
            />
          </div>

        </div>
      </Card>

      {/* --- GRADE DE RESULTADOS --- */}
      <AnimatePresence>
        <motion.div
          layout 
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTrabalhadores.length > 0 ? (
            filteredTrabalhadores.map((trabalhador) => (
              <TrabalhadorCard key={trabalhador.id} trabalhador={trabalhador} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:col-span-2 lg:col-span-4 text-center py-10"
            >
              <Card className="p-10 border-dashed border-dark-subtle/30">
                <Typography as="p" className="text-xl text-dark-subtle">
                  Nenhum profissional encontrado com esses filtros.
                </Typography>
                <Typography as="p" className="!text-base !text-dark-subtle mt-2">
                  Tente ajustar sua busca.
                </Typography>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}