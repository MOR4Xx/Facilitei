import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import {
  type Cliente,
  type Trabalhador,
  type TipoServico,
  allServicosList,
} from "../types/api";

type UserRole = "cliente" | "trabalhador";

interface StepperProps {
  currentStep: number;
  userType: UserRole | null;
}

function Stepper({ currentStep, userType }: StepperProps) {
  const steps = useMemo(() => {
    const baseSteps = ["Conta", "Dados", "Endereço"];
    if (userType === "trabalhador") {
      return [...baseSteps, "Serviços"];
    }
    return baseSteps;
  }, [userType]);

  return (
    <nav
      className="flex flex-wrap items-center justify-center mb-8 gap-y-2"
      aria-label="Progresso"
    >
      <ol className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={label} className="flex items-center">
              <span
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-accent text-dark-background scale-110 shadow-glow-accent"
                      : isCompleted
                      ? "bg-primary text-white"
                      : "bg-dark-surface border-2 border-primary/50 text-primary/70"
                  }
                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span
                className={`
                  ml-2 text-sm font-semibold
                  ${
                    isActive
                      ? "text-accent"
                      : isCompleted
                      ? "text-dark-text"
                      : "text-dark-subtle"
                  }
                `}
              >
                {label}
              </span>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-auto h-0.5 mx-2 sm:mx-3
                    ${isCompleted ? "bg-primary" : "bg-dark-surface"}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
// --- FIM DO COMPONENTE STEPPER ---

// --- FUNÇÕES DE FORMATAÇÃO ---
const formatTelefone = (value: string) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 10) {
    // Celular (XX) XXXXX-XXXX
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (v.length > 6) {
    // Fixo (XX) XXXX-XXXX
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (v.length > 2) {
    // (XX) XXXX
    v = v.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
  } else if (v.length > 0) {
    // (XX
    v = v.replace(/^(\d*)$/, "($1");
  }
  return v;
};

const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove não-dígitos
    .replace(/^(\d{5})(\d)/, "$1-$2") // Adiciona hífen (XXXXX-XXX)
    .slice(0, 9); // Limita a 9 caracteres
};

const formatUF = (value: string) => {
  return value
    .replace(/[^a-zA-Z]/g, "") // Remove não-letras
    .toUpperCase()
    .slice(0, 2); // Limita a 2 caracteres
};
// --- FIM DAS FUNÇÕES DE FORMATAÇÃO ---

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: "cliente" as UserRole,
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
    selectedServices: [] as TipoServico[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepError, setCepError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthStore();

  // --- Handlers de Mudança (Atualizados) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData((prev) => ({ ...prev, telefone: formatTelefone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cep") {
      formattedValue = formatCEP(value);
      if (cepError) setCepError("");
    }
    if (name === "estado") {
      formattedValue = formatUF(value);
    }
    if (name === "numero") {
      formattedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: formattedValue },
    }));
  };

  // Handler para buscar CEP (ViaCEP)
  const handleCepBlur = async () => {
    const cep = formData.endereco.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      if (formData.endereco.cep.length > 0) {
        toast.error("CEP inválido.");
      }
      return;
    }

    setIsCepLoading(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) throw new Error("Falha na rede ao buscar CEP.");

      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
          },
        }));
      } else {
        // Sucesso! Preenche os campos
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          },
        }));
        // Foca no campo "número" após o sucesso
        document.getElementsByName("numero")[0]?.focus();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao buscar CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleServiceChange = (service: TipoServico) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleUserTypeSelect = (type: UserRole) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    nextStep();
  };

  // --- Lógica de Navegação (Validação Aprimorada) ---
  const nextStep = () => {
    setError("");

    if (step === 2) {
      // 1. Validação do Nome (exige nome e sobrenome)
      if (formData.nome.trim().split(" ").length < 2) {
        toast.error("Por favor, insira seu nome completo (nome e sobrenome).");
        return;
      }
      // 2. Validação de E-mail (básica)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Por favor, insira um e-mail válido.");
        return;
      }
      // 3. Validação do Telefone (10 ou 11 dígitos)
      const telefoneDigits = formData.telefone.replace(/\D/g, "");
      if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
        toast.error("Por favor, insira um telefone válido (com DDD).");
        return;
      }
      // 4. Validação da Senha (mínimo 6 caracteres)
      if (formData.senha.length < 6) {
        toast.error("A senha precisa ter pelo menos 6 caracteres.");
        return;
      }
    }

    if (step === 3) {
      const cepDigits = formData.endereco.cep.replace(/\D/g, "");
      if (
        cepDigits.length !== 8 ||
        !formData.endereco.rua ||
        !formData.endereco.cidade ||
        !formData.endereco.bairro ||
        !formData.endereco.numero
      ) {
        toast.error("Preencha todos os campos de endereço para continuar.");
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  // --- Lógica de Submissão (Permanece a mesma) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Checar e-mail
      const { data: emailCheck } = await api.get(
        `/auth/check-email?email=${formData.email}`
      );
      if (emailCheck.exists) {
        /* ... erro ... */ return;
      }

      // 2. Payload
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone.replace(/\D/g, ""),
        endereco: {
          // O Backend espera EnderecoRequestDTO
          rua: formData.endereco.rua,
          numero: formData.endereco.numero,
          bairro: formData.endereco.bairro,
          cidade: formData.endereco.cidade,
          estado: formData.endereco.estado,
          cep: formData.endereco.cep.replace(/\D/g, ""),
        },
        // Campos específicos se for trabalhador
        ...(formData.userType === "trabalhador" && {
          disponibilidade: "Segunda a Sexta, 8h às 18h", // Valor padrão ou adicione input no form
          // IMPORTANTE: O backend espera 'habilidades' (Lista) e 'servicoPrincipal' (Enum)
          habilidades: formData.selectedServices,
          servicoPrincipal: formData.selectedServices[0], // Define o primeiro como principal automaticamente
          notaTrabalhador: 0.0,
          sobre: "Novo profissional na plataforma",
        }),
      };

      // 3. Enviar
      const endpoint =
        formData.userType === "cliente" ? "/clientes" : "/trabalhadores";
      const { data: newUser } = await api.post(endpoint, payload);

      // 4. Login automático
      login({ ...newUser, role: formData.userType });
      // ... redirecionar
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Erro no cadastro: " +
          (err.response?.data?.message || "Tente novamente")
      );
    }
  };

  const totalSteps = formData.userType === "trabalhador" ? 4 : 3;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    if (step === totalSteps) {
      handleSubmit(new Event("submit") as any);
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  return (
    <div className="flex justify-center items-center py-6 md:py-12">
      {/* Card Responsivo */}
      <Card className="w-full max-w-lg overflow-hidden p-6 sm:p-8">
        <Typography as="h2" className="text-center mb-2 !text-3xl sm:!text-4xl">
          Crie sua conta
        </Typography>
        <Typography as="p" className="text-center text-dark-subtle mb-8">
          Siga as etapas para começar no Facilitei.
        </Typography>

        <Stepper currentStep={step} userType={formData.userType} />

        <div className="relative h-auto min-h-[400px]">
          <AnimatePresence initial={false} custom={direction}>
            {/* ETAPA 1: TIPO DE CONTA */}
            {step === 1 && (
              <motion.div
                key={1}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <fieldset className="space-y-3">
                  <Typography
                    as="h3"
                    className="!text-xl text-center pb-2 pt-4"
                  >
                    O que você busca?
                  </Typography>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("cliente")}
                      disabled={isLoading}
                      className={`
                        p-6 rounded-lg border-2 transition-all duration-300 text-center
                        bg-dark-surface border-primary/50 text-dark-subtle hover:border-primary hover:text-primary hover:shadow-glow-primary
                      `}
                    >
                      Quero Contratar
                      <span className="block text-xs opacity-80">
                        (Cliente)
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("trabalhador")}
                      disabled={isLoading}
                      className={`
                        p-6 rounded-lg border-2 transition-all duration-300 text-center
                        bg-dark-surface border-accent/50 text-dark-subtle hover:border-accent hover:text-accent hover:shadow-glow-accent
                      `}
                    >
                      Quero Trabalhar
                      <span className="block text-xs opacity-80">
                        (Profissional)
                      </span>
                    </button>
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 2: DADOS PESSOAIS */}
            {step === 2 && (
              <motion.div
                key={2}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-6">
                  {/* ... Inputs ... */}
                  <Input
                    label="Nome Completo"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Ex: João da Silva"
                  />
                  <Input
                    label="Seu melhor e-mail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Ex: joao.silva@email.com"
                  />
                  <Input
                    label="Telefone (WhatsApp)"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    maxLength={15} // (XX) XXXXX-XXXX
                    placeholder="(00) 00000-0000"
                  />
                  <Input
                    label="Crie uma senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Mínimo 6 caracteres"
                  />
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 3: ENDEREÇO (Responsivo) */}
            {step === 3 && (
              <motion.div
                key={3}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-6">
                  {/* CAMPO CEP COM LOADING E ERRO */}
                  <div className="relative">
                    <Input
                      label="CEP"
                      name="cep"
                      type="tel"
                      value={formData.endereco.cep}
                      onChange={handleEnderecoChange}
                      onBlur={handleCepBlur}
                      required
                      disabled={isLoading || isCepLoading}
                      maxLength={9}
                      placeholder="00000-000"
                    />
                    {isCepLoading && (
                      <span className="absolute right-3 top-10 text-xs text-accent animate-pulse">
                        Buscando...
                      </span>
                    )}
                  </div>
                  <Input
                    label="Rua / Avenida"
                    name="rua"
                    value={formData.endereco.rua}
                    onChange={handleEnderecoChange}
                    required
                    disabled={isLoading || isCepLoading}
                    readOnly={isCepLoading}
                  />
                  {/* Grid Responsivo (md:grid-cols-3) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Número"
                      name="numero"
                      type="tel"
                      value={formData.endereco.numero}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading}
                    />
                    <Input
                      label="Bairro"
                      name="bairro"
                      value={formData.endereco.bairro}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading || isCepLoading}
                      readOnly={isCepLoading}
                    />
                  </div>
                  {/* Grid Responsivo (md:grid-cols-3) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Cidade"
                      name="cidade"
                      value={formData.endereco.cidade}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading || isCepLoading}
                      readOnly={isCepLoading}
                    />
                    <Input
                      label="Estado (UF)"
                      name="estado"
                      value={formData.endereco.estado}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading || isCepLoading}
                      readOnly={isCepLoading}
                      maxLength={2}
                      placeholder="UF"
                    />
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 4: SERVIÇOS (Responsivo) */}
            {step === 4 && formData.userType === "trabalhador" && (
              <motion.div
                key={4}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-3">
                  <Typography
                    as="h3"
                    className="!text-xl border-b border-dark-surface/50 pb-2"
                  >
                    Quais serviços você oferece?
                    <span className="text-red-500">*</span>
                  </Typography>
                  {/* Grid Responsivo (sm:grid-cols-2) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-h-[300px] overflow-y-auto">
                    {allServicosList.map((service) => (
                      <button
                        type="button"
                        key={service}
                        onClick={() => handleServiceChange(service)}
                        disabled={isLoading}
                        className={`
                          p-3 rounded-lg border-2 text-left transition-all duration-200
                          ${
                            formData.selectedServices.includes(service)
                              ? "bg-accent border-accent text-dark-background font-bold"
                              : "bg-dark-surface border-primary/50 text-dark-subtle hover:border-accent/50"
                          }
                        `}
                      >
                        <span className="capitalize">
                          {service.replace(/_/g, " ").toLowerCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botões de Navegação (Responsivos) */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          {step > 1 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePrev}
              disabled={isLoading || isCepLoading}
            >
              Voltar
            </Button>
          )}
          {step > 1 && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleNext}
              disabled={isLoading || isCepLoading}
            >
              {isLoading
                ? "Salvando..."
                : step === totalSteps
                ? "Finalizar Cadastro"
                : "Próximo"}
            </Button>
          )}
        </div>

        <Typography as="p" className="text-center !text-sm mt-6">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-accent hover:underline font-semibold"
          >
            Faça login
          </Link>
        </Typography>
      </Card>
    </div>
  );
}
