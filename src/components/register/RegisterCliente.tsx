import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AddressForm } from "./AddressForm";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

const formatTelefone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3").slice(0, 15);

export function RegisterCliente() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    endereco: { rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" },
  });

  const updateData = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  const updateAddress = (field: string, value: string) => setData(prev => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }));

  const handleNext = () => {
    if (step === 1) {
      if (!data.nome || !data.email || data.senha.length < 6) return toast.error("Verifique seus dados.");
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
      };
      const { data: newUser } = await api.post("/clientes", payload);
      login({ ...newUser, role: "cliente" });
      toast.success("Cadastro realizado!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const variants = { enter: { x: 50, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -50, opacity: 0 } };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-6 px-10">
        {["Dados Pessoais", "Endereço"].map((label, i) => (
          <div key={i} className={`text-sm font-bold ${step === i + 1 ? "text-accent" : "text-dark-subtle"}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div className="min-h-[350px] relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-4">
              {/* INPUTS CORRIGIDOS COM NAME */}
              <Input label="Nome Completo" name="nome" value={data.nome} onChange={e => updateData("nome", e.target.value)} />
              <Input label="E-mail" name="email" type="email" value={data.email} onChange={e => updateData("email", e.target.value)} />
              <Input label="Telefone" name="telefone" value={data.telefone} onChange={e => updateData("telefone", formatTelefone(e.target.value))} maxLength={15} />
              <Input label="Senha" name="senha" type="password" value={data.senha} onChange={e => updateData("senha", e.target.value)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="2" variants={variants} initial="enter" animate="center" exit="exit">
              <AddressForm data={data.endereco} onChange={updateAddress} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8">
        {step > 1 && <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Voltar</Button>}
        <Button variant="secondary" className="w-full" onClick={handleNext} disabled={isLoading}>
          {isLoading ? "Salvando..." : step === 2 ? "Finalizar" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}