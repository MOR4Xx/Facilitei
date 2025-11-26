import { useState, useMemo, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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

// --- MAP ICONES ---
const categoryIcons: Record<CategoriaGrupo | "TODOS", ReactElement> = {
  TODOS: <SparklesIcon className="w-6 h-6" />,
  "Construção e Reformas": <BuildingIcon className="w-6 h-6" />,
  "Serviços Domésticos": <HomeIcon className="w-6 h-6" />,
  "Serviços Técnicos": <WrenchIcon className="w-6 h-6" />,
  "Jardinagem e Exteriores": <LeafIcon className="w-6 h-6" />,
  "Educação e Aulas": <BookIcon className="w-6 h-6" />,
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const { data } = await api.get("/trabalhadores/listar");
  return data;
};

export function SolicitarServicoPage() {
  const [selectedGroup, setSelectedGroup] = useState<CategoriaGrupo | "TODOS">(
    "TODOS"
  );
  const [selectedService, setSelectedService] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [locationTerm, setLocationTerm] = useState("");

  const { data: trabalhadores, isLoading } = useQuery<Trabalhador[]>({
    queryKey: ["allTrabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  const filteredTrabalhadores = useMemo(() => {
    if (!trabalhadores) return [];
    const normSearch = searchTerm.toLowerCase();
    const normLoc = locationTerm.toLowerCase();

    return trabalhadores.filter((t) => {
      const servicos = t.servicos || [];
      if (
        selectedGroup !== "TODOS" &&
        !serviceCategories[selectedGroup].some((s) => servicos.includes(s))
      )
        return false;
      if (
        selectedService !== "TODOS" &&
        !servicos.includes(selectedService as TipoServico)
      )
        return false;
      if ((t.notaTrabalhador || 0) < minRating) return false;
      if (normSearch && !t.nome.toLowerCase().includes(normSearch))
        return false;
      if (normLoc) {
        const endereco =
          `${t.endereco?.cidade} ${t.endereco?.estado}`.toLowerCase();
        if (!endereco.includes(normLoc)) return false;
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* --- SIDEBAR DE FILTROS (Mobile: Topo, Desktop: Esquerda) --- */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-80 flex-shrink-0 space-y-6"
      >
        <Card className="p-6 bg-dark-surface/80 border-primary/20 sticky top-24">
          <div className="mb-6">
            <Typography
              as="h3"
              className="!text-xl font-bold mb-4 text-white flex items-center gap-2"
            >
              <SparklesIcon className="w-5 h-5 text-accent" /> Categorias
            </Typography>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {["TODOS", ...allCategoryGroups].map((group) => {
                const isActive = selectedGroup === group;
                return (
                  <button
                    key={group}
                    onClick={() => {
                      setSelectedGroup(group as never);
                      setSelectedService("TODOS");
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-accent text-dark-background shadow-glow-accent font-bold"
                          : "text-dark-subtle hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {categoryIcons[group as CategoriaGrupo | "TODOS"]}
                    <span className="truncate">{group}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <Input
              label="Buscar Nome"
              name="search"
              placeholder="Ex: João Silva"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              label="Cidade/UF"
              name="location"
              placeholder="Ex: São Paulo"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />

            {selectedGroup !== "TODOS" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Especialidade
                </label>
                <select
                  className="w-full bg-dark-background border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="TODOS">Todas</option>
                  {availableServices.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2">
              <label className="block text-sm font-medium text-primary mb-2">
                Avaliação Mínima
              </label>
              <RatingFilter rating={minRating} onRatingChange={setMinRating} />
            </div>
          </div>
        </Card>
      </motion.aside>

      {/* --- GRID DE RESULTADOS --- */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Typography as="h2" className="!text-3xl font-bold">
            Profissionais Disponíveis{" "}
            <span className="text-accent">
              ({filteredTrabalhadores.length})
            </span>
          </Typography>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrabalhadores.length > 0 ? (
                filteredTrabalhadores.map((trabalhador) => (
                  <TrabalhadorCard
                    key={trabalhador.id}
                    trabalhador={trabalhador}
                  />
                ))
              ) : (
                <motion.div className="col-span-full py-12 text-center bg-dark-surface/30 rounded-xl border border-dashed border-white/10">
                  <Typography as="p" className="text-xl text-dark-subtle">
                    Nenhum ninja encontrado para essa busca.
                  </Typography>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedGroup("TODOS");
                      setLocationTerm("");
                    }}
                    className="mt-4 text-accent hover:underline"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
