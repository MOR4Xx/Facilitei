import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Typography } from "../ui/Typography";
import { AddressForm } from "./AddressForm";
import { ImageUpload } from "../ui/ImageUpload";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { allServicosList, type TipoServico } from "../../types/api";
import { toast } from "react-hot-toast";

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

  const [data, setData] = useState({
    avatarUrl: "",
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

  const updateData = (field: string, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const updateAddress = (field: string, value: string) =>
    setData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value },
    }));

  const toggleService = (service: TipoServico) => {
    setData((prev) => {
      const exists = prev.habilidades.includes(service);
      const newSkills = exists
        ? prev.habilidades.filter((s) => s !== service)
        : [...prev.habilidades, service];
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

  const handleNext = () => {
    if (
      step === 1 &&
      (!data.nome || !data.email.includes("@") || data.senha.length < 6)
    )
      return toast.error("Verifique seus dados pessoais.");
    if (step === 2 && (data.endereco.cep.length < 8 || !data.endereco.rua))
      return toast.error("Endereço incompleto.");
    if (step === 3 && data.habilidades.length === 0)
      return toast.error("Selecione ao menos um serviço.");
    if (step === 4) {
      handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!data.servicoPrincipal)
      return toast.error("Selecione seu serviço principal.");
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ""),
        endereco: {
          ...data.endereco,
          cep: data.endereco.cep.replace(/\D/g, ""),
        },
        disponibilidade: "Segunda a Sexta, 8h às 18h",
        notaTrabalhador: 5.0,
        sobre: `Olá, sou ${data.nome} e trabalho com ${data.servicoPrincipal
          .replace(/_/g, " ")
          .toLowerCase()}.`,
        avatarUrl: data.avatarUrl || "https://via.placeholder.com/150",
      };
      const { data: newUser } = await api.post("/trabalhadores", payload);
      login({ ...newUser, role: "trabalhador" });
      toast.success("Bem-vindo ao time!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ["Perfil", "Endereço", "Habilidades", "Destaque"];

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
        {steps.map((label, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-dark-surface px-2"
          >
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                step > i + 1
                  ? "bg-accent border-accent"
                  : step === i + 1
                  ? "border-accent bg-dark-surface"
                  : "border-dark-subtle bg-dark-surface"
              }`}
            />
            <span
              className={`text-[10px] mt-1 font-bold uppercase ${
                step === i + 1 ? "text-accent" : "text-dark-subtle"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <ImageUpload
                label="Foto de Perfil"
                value={data.avatarUrl}
                onChange={(url) => updateData("avatarUrl", url)}
              />
              <Input
                label="Nome"
                name="nome"
                value={data.nome}
                onChange={(e) => updateData("nome", e.target.value)}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData("email", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="WhatsApp"
                  name="tel"
                  value={data.telefone}
                  onChange={(e) =>
                    updateData("telefone", formatTelefone(e.target.value))
                  }
                />
                <Input
                  label="Senha"
                  name="pass"
                  type="password"
                  value={data.senha}
                  onChange={(e) => updateData("senha", e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AddressForm
                data={data.endereco}
                onChange={updateAddress}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Typography
                as="h3"
                className="!text-lg font-bold mb-4 text-center"
              >
                O que você faz?
              </Typography>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-2 bg-dark-background/30 rounded-xl border border-white/5">
                {allServicosList.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`p-3 rounded-lg text-xs font-bold uppercase transition-all border ${
                      data.habilidades.includes(s)
                        ? "bg-accent text-dark-background border-accent shadow-glow-accent"
                        : "bg-transparent border-white/10 text-dark-subtle hover:bg-white/5"
                    }`}
                  >
                    {s.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Typography
                as="h3"
                className="!text-lg font-bold mb-4 text-center"
              >
                Qual seu principal serviço?
              </Typography>
              <div className="space-y-2">
                {data.habilidades.map((s) => (
                  <label
                    key={s}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      data.servicoPrincipal === s
                        ? "border-accent bg-accent/10 shadow-glow-accent"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="principal"
                      value={s}
                      checked={data.servicoPrincipal === s}
                      onChange={() => updateData("servicoPrincipal", s)}
                      className="accent-accent w-5 h-5"
                    />
                    <span className="ml-3 font-bold uppercase text-sm">
                      {s.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
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
          className="flex-1 shadow-glow-accent"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : step === 4 ? "Finalizar 🚀" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
