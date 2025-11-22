import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AddressForm } from "./AddressForm";
import { ImageUpload } from "../ui/ImageUpload"; // <--- Importando o componente top
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

// Helper para formatar telefone visualmente
const formatTelefone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3").slice(0, 15);

export function RegisterCliente() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Estado unificado com a foto
  const [data, setData] = useState({
    avatarUrl: "", // <--- Campo novo
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    endereco: { rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" },
  });

  const updateData = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  
  const updateAddress = (field: string, value: string) => {
    setData(prev => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!data.nome || !data.email.includes("@") || data.senha.length < 6) {
        return toast.error("Preencha nome, email válido e senha (min 6 dígitos).");
      }
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
        endereco: { ...data.endereco, cep: data.endereco.cep.replace(/\D/g, "") },
        // Se o usuário não subir foto, mandamos uma genérica ou vazia
        avatarUrl: data.avatarUrl || "https://via.placeholder.com/150" 
      };

      const { data: newUser } = await api.post("/clientes", payload);
      
      login({ ...newUser, role: "cliente" });
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao cadastrar.");
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
      {/* Indicador de Passos */}
      <div className="flex justify-between mb-8 px-10">
        {["Perfil", "Endereço"].map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full transition-colors ${step > i ? "bg-accent" : step === i + 1 ? "bg-accent animate-pulse" : "bg-dark-surface"}`} />
            <span className={`text-xs font-bold ${step === i + 1 ? "text-accent" : "text-dark-subtle"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[350px] relative">
        <AnimatePresence mode="wait">
          
          {/* PASSO 1: DADOS PESSOAIS + FOTO */}
          {step === 1 && (
            <motion.div key="1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-5">
              
              {/* Componente de Upload aqui! */}
              <ImageUpload 
                label="Sua Foto"
                value={data.avatarUrl}
                onChange={(url) => updateData("avatarUrl", url)}
              />

              <Input 
                label="Nome Completo" 
                name="nome" 
                value={data.nome} 
                onChange={e => updateData("nome", e.target.value)} 
                placeholder="Ex: Maria Oliveira"
              />
              <Input 
                label="E-mail" 
                name="email" 
                type="email" 
                value={data.email} 
                onChange={e => updateData("email", e.target.value)} 
                placeholder="maria@email.com"
              />
              <Input 
                label="Telefone" 
                name="telefone" 
                value={data.telefone} 
                onChange={e => updateData("telefone", formatTelefone(e.target.value))} 
                maxLength={15} 
                placeholder="(00) 00000-0000"
              />
              <Input 
                label="Crie uma Senha" 
                name="senha" 
                type="password" 
                value={data.senha} 
                onChange={e => updateData("senha", e.target.value)} 
                placeholder="Mínimo 6 caracteres"
              />
            </motion.div>
          )}

          {/* PASSO 2: ENDEREÇO */}
          {step === 2 && (
            <motion.div key="2" variants={variants} initial="enter" animate="center" exit="exit">
              <AddressForm 
                data={data.endereco} 
                onChange={updateAddress} 
                isLoading={isLoading} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botões de Navegação */}
      <div className="flex gap-4 mt-8 pt-4 border-t border-dark-surface">
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
          className="flex-1 font-bold shadow-lg shadow-secondary/20" 
          onClick={handleNext} 
          disabled={isLoading}
        >
          {isLoading 
            ? "Salvando..." 
            : step === 2 
              ? "🚀 Criar Conta" 
              : "Próximo Passo"
          }
        </Button>
      </div>
    </div>
  );
}