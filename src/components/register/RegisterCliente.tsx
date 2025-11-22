import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AddressForm } from "./AddressForm";
import { ImageUpload } from "../ui/ImageUpload";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

const formatTelefone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    .slice(0, 15);

export function RegisterCliente() {
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
  });

  const updateData = (field: string, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const updateAddress = (field: string, value: string) =>
    setData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value },
    }));

  const handleNext = () => {
    if (step === 1) {
      if (!data.nome || !data.email.includes("@") || data.senha.length < 6)
        return toast.error("Preencha os dados corretamente.");
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ""),
        endereco: {
          ...data.endereco,
          cep: data.endereco.cep.replace(/\D/g, ""),
        },
        avatarUrl: data.avatarUrl || "https://via.placeholder.com/150",
      };
      const { data: newUser } = await api.post("/clientes", payload);
      login({ ...newUser, role: "cliente" });
      toast.success("Conta criada! Bem-vindo.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Stepper Visual */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 text-sm font-bold ${
            step >= 1 ? "text-accent" : "text-dark-subtle"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center border ${
              step >= 1
                ? "bg-accent text-dark-background border-accent"
                : "border-dark-subtle"
            }`}
          >
            1
          </span>
          Perfil
        </div>
        <div className="w-10 h-px bg-white/10" />
        <div
          className={`flex items-center gap-2 text-sm font-bold ${
            step >= 2 ? "text-accent" : "text-dark-subtle"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center border ${
              step >= 2
                ? "bg-accent text-dark-background border-accent"
                : "border-dark-subtle"
            }`}
          >
            2
          </span>
          Endereço
        </div>
      </div>

      <div className="min-h-[380px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <ImageUpload
                label="Foto de Perfil"
                value={data.avatarUrl}
                onChange={(url) => updateData("avatarUrl", url)}
              />
              <Input
                label="Nome Completo"
                name="nome"
                value={data.nome}
                onChange={(e) => updateData("nome", e.target.value)}
                placeholder="Ex: Maria Oliveira"
              />
              <Input
                label="E-mail"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData("email", e.target.value)}
                placeholder="maria@email.com"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  name="telefone"
                  value={data.telefone}
                  onChange={(e) =>
                    updateData("telefone", formatTelefone(e.target.value))
                  }
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                />
                <Input
                  label="Senha"
                  name="senha"
                  type="password"
                  value={data.senha}
                  onChange={(e) => updateData("senha", e.target.value)}
                  placeholder="Min 6 caracteres"
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
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
        {step > 1 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStep(1)}
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
          {isLoading
            ? "Criando..."
            : step === 2
            ? "Finalizar Cadastro 🚀"
            : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
