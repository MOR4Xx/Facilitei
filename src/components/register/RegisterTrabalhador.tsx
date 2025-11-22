import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Typography } from "../ui/Typography";
import { AddressForm } from "./AddressForm";
import { ImageUpload } from "../ui/ImageUpload"; // <--- O componente novo aqui
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { allServicosList, type TipoServico } from "../../types/api";
import { toast } from "react-hot-toast";

// Helper para formatar telefone visualmente
const formatTelefone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    .slice(0, 15);

export function RegisterTrabalhador() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Estado unificado do formulário
  const [data, setData] = useState({
    avatarUrl: "", // <--- Campo novo para a foto
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    habilidades: [] as TipoServico[],
    servicoPrincipal: "" as TipoServico | "",
  });

  // Atualiza campos simples
  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Atualiza endereço aninhado
  const updateAddress = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value },
    }));
  };

  // Lógica de seleção de serviços (Toggle)
  const toggleService = (service: TipoServico) => {
    setData((prev) => {
      const exists = prev.habilidades.includes(service);
      const newSkills = exists
        ? prev.habilidades.filter((s) => s !== service)
        : [...prev.habilidades, service];

      // Se desmarcou o principal, reseta o principal
      const newPrincipal =
        prev.servicoPrincipal === service && exists
          ? ""
          : prev.servicoPrincipal;
      return {
        ...prev,
        habilidades: newSkills,
        servicoPrincipal: newPrincipal,
      };
    });
  };

  // Validação e Avanço de etapas
  const handleNext = () => {
    if (step === 1) {
      if (!data.nome || !data.email.includes("@") || data.senha.length < 6) {
        return toast.error(
          "Preencha nome, email e senha (min 6 dígitos) corretamente."
        );
      }
      // Opcional: Validar se a foto é obrigatória
      // if (!data.avatarUrl) return toast.error("Por favor, adicione uma foto de perfil.");
    }
    if (step === 2) {
      if (data.endereco.cep.length < 8 || !data.endereco.rua) {
        return toast.error("Endereço inválido. Preencha o CEP e a Rua.");
      }
    }
    if (step === 3) {
      if (data.habilidades.length === 0) {
        return toast.error("Selecione pelo menos um serviço que você realiza.");
      }
    }
    if (step === 4) {
      handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  };

  // Envio final para a API
  const handleSubmit = async () => {
    if (!data.servicoPrincipal)
      return toast.error("Selecione seu serviço principal.");

    setIsLoading(true);
    try {
      // Prepara o payload (limpa máscaras, etc)
      const payload = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ""),
        endereco: {
          ...data.endereco,
          cep: data.endereco.cep.replace(/\D/g, ""),
        },
        disponibilidade: "Segunda a Sexta, 8h às 18h", // Valor padrão inicial
        notaTrabalhador: 5.0, // Começa com nota máxima ou 0, depende da sua regra
        sobre: `Olá, sou ${data.nome} e trabalho com ${data.servicoPrincipal
          .replace(/_/g, " ")
          .toLowerCase()}.`,
        habilidades: data.habilidades,
        servicoPrincipal: data.servicoPrincipal,
        avatarUrl: data.avatarUrl || "https://via.placeholder.com/150", // Fallback caso não tenha foto
      };

      const { data: newUser } = await api.post("/trabalhadores", payload);

      // Loga o usuário automaticamente após cadastro
      login({ ...newUser, role: "trabalhador" });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Erro ao cadastrar. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {" "}
      {/* Centralizado e largura max */}
      {/* Barra de Progresso Superior */}
      <div className="flex justify-between mb-8 px-2">
        {["Perfil", "Endereço", "Serviços", "Foco"].map((label, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 cursor-default`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                step > i
                  ? "bg-accent"
                  : step === i + 1
                  ? "bg-accent animate-pulse"
                  : "bg-dark-surface"
              }`}
            />
            <span
              className={`text-xs font-bold ${
                step === i + 1 ? "text-accent" : "text-dark-subtle"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait">
          {/* PASSO 1: DADOS PESSOAIS + FOTO */}
          {step === 1 && (
            <motion.div
              key="1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              {/* Componente de Upload de Imagem */}
              <ImageUpload
                label="Sua Foto de Perfil"
                value={data.avatarUrl}
                onChange={(url) => updateData("avatarUrl", url)}
              />

              <Input
                label="Nome Completo"
                name="nome"
                value={data.nome}
                onChange={(e) => updateData("nome", e.target.value)}
                placeholder="Ex: João da Silva"
              />
              <Input
                label="E-mail"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData("email", e.target.value)}
                placeholder="joao@exemplo.com"
              />
              <Input
                label="Telefone (WhatsApp)"
                name="telefone"
                value={data.telefone}
                onChange={(e) =>
                  updateData("telefone", formatTelefone(e.target.value))
                }
                maxLength={15}
                placeholder="(00) 00000-0000"
              />
              <Input
                label="Crie uma Senha"
                name="senha"
                type="password"
                value={data.senha}
                onChange={(e) => updateData("senha", e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </motion.div>
          )}

          {/* PASSO 2: ENDEREÇO */}
          {step === 2 && (
            <motion.div
              key="2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <AddressForm
                data={data.endereco}
                onChange={updateAddress}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* PASSO 3: HABILIDADES */}
          {step === 3 && (
            <motion.div
              key="3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Typography
                as="h3"
                className="text-lg font-semibold mb-2 text-primary"
              >
                O que você faz?
              </Typography>
              <p className="text-sm text-dark-subtle mb-4">
                Selecione todas as categorias que você atende.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-dark-surface">
                {allServicosList.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`p-3 rounded-lg border text-left capitalize transition-all duration-200 ${
                      data.habilidades.includes(s)
                        ? "bg-accent text-dark-background font-bold border-accent shadow-lg shadow-accent/20"
                        : "bg-dark-surface border-dark-subtle/20 hover:border-primary/50 text-dark-text"
                    }`}
                  >
                    {s.replace(/_/g, " ").toLowerCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASSO 4: SERVIÇO PRINCIPAL */}
          {step === 4 && (
            <motion.div
              key="4"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Typography
                as="h3"
                className="text-lg font-semibold mb-2 text-primary"
              >
                Qual é o seu carro-chefe?
              </Typography>
              <p className="text-sm text-dark-subtle mb-4">
                Esse será o serviço que aparecerá primeiro no seu perfil.
              </p>

              <div className="space-y-3">
                {data.habilidades.map((s) => (
                  <label
                    key={s}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      data.servicoPrincipal === s
                        ? "border-accent bg-accent/10 shadow-md"
                        : "border-dark-surface bg-dark-surface hover:bg-dark-surface_hover"
                    }`}
                  >
                    <input
                      type="radio"
                      name="principal"
                      value={s}
                      checked={data.servicoPrincipal === s}
                      onChange={() => updateData("servicoPrincipal", s)}
                      className="w-5 h-5 text-accent focus:ring-accent border-gray-600 bg-gray-700"
                    />
                    <span className="ml-3 capitalize text-base font-medium text-dark-text">
                      {s.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Botoes de Navegação */}
      <div className="flex gap-4 mt-8 pt-4 border-t border-dark-surface">
        {step > 1 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStep((s) => s - 1)}
            disabled={isLoading}
          >
            Voltar
          </Button>
        )}
        <Button
          variant="secondary"
          className="flex-1 font-bold shadow-lg shadow-secondary/20"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading
            ? "Salvando..."
            : step === 4
            ? "🚀 Finalizar Cadastro"
            : "Próximo Passo"}
        </Button>
      </div>
    </div>
  );
}
