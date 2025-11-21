import { useState, useMemo, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import {
  type Trabalhador,
  type TipoServico,
  type CategoriaGrupo,
  serviceCategories,
  allCategoryGroups,
} from "../types/api";
import { TrabalhadorCard } from "../components/ui/TrabalhadorCard";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { RatingFilter } from "../components/ui/RatingFilter";
import {
  BuildingIcon,
  HomeIcon,
  WrenchIcon,
  LeafIcon,
  BookIcon,
  SparklesIcon,
} from "../components/ui/CategoryIcons";
import { api } from "../lib/api";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const { data } = await api.get("/trabalhadores/listar");
  return data;
};

const categoryIcons: Record<CategoriaGrupo | "TODOS", ReactElement> = {
  TODOS: <SparklesIcon className="w-8 h-8" />,
  "Construção e Reformas": <BuildingIcon className="w-8 h-8" />,
  "Serviços Domésticos": <HomeIcon className="w-8 h-8" />,
  "Serviços Técnicos": <WrenchIcon className="w-8 h-8" />,
  "Jardinagem e Exteriores": <LeafIcon className="w-8 h-8" />,
  "Educação e Aulas": <BookIcon className="w-8 h-8" />,
};

export function SolicitarServicoPage() {
  const [selectedGroup, setSelectedGroup] = useState<CategoriaGrupo | "TODOS">(
    "TODOS"
  );
  const [selectedService, setSelectedService] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [locationTerm, setLocationTerm] = useState("");

  const {
    data: trabalhadores,
    isLoading,
    isError,
  } = useQuery<Trabalhador[]>({
    queryKey: ["allTrabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  // --- LÓGICA DE FILTRAGEM BLINDADA ---
  const filteredTrabalhadores = useMemo(() => {
    if (!trabalhadores) return [];

    const normSearchTerm = searchTerm.toLowerCase();
    const normLocationTerm = locationTerm.toLowerCase();

    return trabalhadores.filter((t) => {
      // Garante que t.servicos é um array (evita crash se vier null)
      const servicos = t.servicos || [];

      // 1. Filtro de Grupo
      if (
        selectedGroup !== "TODOS" &&
        !serviceCategories[selectedGroup].some((s) => servicos.includes(s))
      ) {
        return false;
      }

      // 2. Filtro de Serviço Específico
      if (
        selectedService !== "TODOS" &&
        !servicos.includes(selectedService as TipoServico)
      ) {
        return false;
      }

      // 3. Filtro de Nota
      if ((t.notaTrabalhador || 0) < minRating) {
        return false;
      }

      // 4. Filtro de Nome
      if (normSearchTerm && !t.nome.toLowerCase().includes(normSearchTerm)) {
        return false;
      }

      // 5. Filtro de Localização (Com proteção para endereço null)
      if (normLocationTerm) {
        const cidade = t.endereco?.cidade?.toLowerCase() || "";
        const estado = t.endereco?.estado?.toLowerCase() || "";
        if (
          !cidade.includes(normLocationTerm) &&
          !estado.includes(normLocationTerm)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    trabalhadores,
    selectedGroup,
    selectedService,
    searchTerm,
    minRating,
    locationTerm,
  ]);

  const availableServices = useMemo(() => {
    if (selectedGroup === "TODOS") return [];
    return serviceCategories[selectedGroup];
  }, [selectedGroup]);

  const handleGroupChange = (group: CategoriaGrupo | "TODOS") => {
    setSelectedGroup(group);
    setSelectedService("TODOS");
  };

  const formatServiceName = (service: string) => {
    return service.replace(/_/g, " ").toLowerCase();
  };

  const filterInputStyle = `
    w-full bg-dark-surface border-2 border-primary/50 rounded-lg p-3 
    text-dark-text placeholder-dark-subtle/50 transition-all duration-300
    focus:outline-none focus:border-accent focus:shadow-glow-accent/50
  `;

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Buscando Profissionais...</Typography>
        <p className="text-dark-subtle mt-4">
          Aguarde, estamos conectando você.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Erro na Busca!</Typography>
        <p className="text-dark-subtle mt-4">
          Não foi possível conectar ao servidor.
        </p>
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
        <Typography
          as="h1"
          className="!text-accent !text-3xl sm:!text-4xl mb-2"
        >
          Encontre o Profissional Ideal
        </Typography>
        <Typography as="p" className="text-lg max-w-3xl mx-auto">
          Selecione uma categoria ou use os filtros para achar quem você
          precisa.
        </Typography>
      </motion.div>

      {/* SELETOR DE CATEGORIAS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {["TODOS", ...allCategoryGroups].map((group) => {
          const isSelected = selectedGroup === group;
          const groupName = group as CategoriaGrupo | "TODOS";
          return (
            <motion.button
              key={groupName}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGroupChange(groupName)}
              className={`
                flex flex-col items-center justify-center w-full h-32 md:h-36 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? "bg-accent/20 border-accent shadow-glow-accent"
                    : "bg-dark-surface/70 backdrop-blur-lg border-primary/20 hover:border-primary/60"
                }
              `}
            >
              <span className={isSelected ? "text-accent" : "text-primary/70"}>
                {categoryIcons[groupName]}
              </span>
              <Typography
                as="span"
                className={`!text-sm font-semibold text-center mt-3 ${
                  isSelected ? "!text-accent" : "!text-dark-text"
                }`}
              >
                {groupName}
              </Typography>
            </motion.button>
          );
        })}
      </motion.div>

      {/* PAINEL DE FILTROS */}
      <Card variants={itemVariants} className="!bg-dark-surface/90 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-primary mb-2"
            >
              Serviço Específico
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={filterInputStyle}
              disabled={selectedGroup === "TODOS"}
            >
              <option value="TODOS">
                {selectedGroup === "TODOS"
                  ? "Selecione um grupo primeiro"
                  : `Todos de ${selectedGroup}`}
              </option>
              {availableServices.map((service) => (
                <option
                  key={service}
                  value={service}
                  className="bg-dark-surface capitalize"
                >
                  {formatServiceName(service)}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Nome do Profissional"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: João"
          />
          <Input
            label="Localização (Cidade/UF)"
            name="location"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            placeholder="Ex: São Paulo"
          />
          <div className="flex flex-col items-start">
            <label className="block text-sm font-medium text-primary mb-2">
              Nota Mínima
            </label>
            <RatingFilter rating={minRating} onRatingChange={setMinRating} />
          </div>
        </div>
      </Card>

      {/* RESULTADOS */}
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTrabalhadores.length > 0 ? (
            filteredTrabalhadores.map((trabalhador) => (
              <TrabalhadorCard key={trabalhador.id} trabalhador={trabalhador} />
            ))
          ) : (
            <motion.div className="col-span-full text-center py-10">
              <Card className="p-10 border-dashed border-dark-subtle/30">
                <Typography as="p" className="text-xl text-dark-subtle">
                  Nenhum profissional encontrado.
                </Typography>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
