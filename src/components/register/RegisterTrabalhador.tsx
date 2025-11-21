import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Typography } from "../ui/Typography";
import { AddressForm } from "./AddressForm";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { allServicosList, type TipoServico } from "../../types/api";
import { toast } from "react-hot-toast";

const formatTelefone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3").slice(0, 15);

export function RegisterTrabalhador() {
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
    habilidades: [] as TipoServico[],
    servicoPrincipal: "" as TipoServico | "",
  });

  const updateData = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  const updateAddress = (field: string, value: string) => setData(prev => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }));

  const toggleService = (service: TipoServico) => {
    setData(prev => {
      const exists = prev.habilidades.includes(service);
      const newSkills = exists 
        ? prev.habilidades.filter(s => s !== service)
        : [...prev.habilidades, service];
      
      const newPrincipal = (prev.servicoPrincipal === service && exists) ? "" : prev.servicoPrincipal;
      return { ...prev, habilidades: newSkills, servicoPrincipal: newPrincipal };
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!data.nome || !data.email.includes("@") || data.senha.length < 6) return toast.error("Preencha os dados corretamente.");
    }
    if (step === 2) {
      if (data.endereco.cep.length < 8 || !data.endereco.rua) return toast.error("Endereço inválido.");
    }
    if (step === 3) {
      if (data.habilidades.length === 0) return toast.error("Selecione pelo menos um serviço.");
    }
    if (step === 4) {
       handleSubmit();
       return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!data.servicoPrincipal) return toast.error("Selecione seu serviço principal.");
    
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ""),
        endereco: { ...data.endereco, cep: data.endereco.cep.replace(/\D/g, "") },
        disponibilidade: "Segunda a Sexta, 8h às 18h",
        notaTrabalhador: 0.0,
        sobre: "Profissional cadastrado recentemente.",
        habilidades: data.habilidades, 
        servicoPrincipal: data.servicoPrincipal
      };

      const { data: newUser } = await api.post("/trabalhadores", payload);
      login({ ...newUser, role: "trabalhador" });
      toast.success("Bem-vindo, parceiro!");
      navigate("/dashboard");
    } catch (err: any) {
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
    <div className="w-full">
      <div className="flex justify-between mb-6 px-2">
        {["Dados", "Endereço", "Serviços", "Destaque"].map((label, i) => (
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

          {step === 3 && (
            <motion.div key="3" variants={variants} initial="enter" animate="center" exit="exit">
              <Typography as="h3" className="text-lg mb-4">Selecione suas habilidades:</Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {allServicosList.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`p-3 rounded border text-left capitalize transition-colors ${
                      data.habilidades.includes(s) 
                      ? "bg-accent text-dark-background font-bold border-accent" 
                      : "bg-dark-surface border-dark-subtle/20 hover:border-primary"
                    }`}
                  >
                    {s.replace(/_/g, " ").toLowerCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" variants={variants} initial="enter" animate="center" exit="exit">
              <Typography as="h3" className="text-lg mb-4">Qual é o seu foco principal?</Typography>
              <div className="space-y-3">
                {data.habilidades.map(s => (
                  <label key={s} className={`flex items-center p-4 rounded border cursor-pointer transition-all ${
                    data.servicoPrincipal === s 
                    ? "border-accent bg-accent/10" 
                    : "border-dark-surface bg-dark-surface"
                  }`}>
                    <input 
                      type="radio" 
                      name="principal" 
                      value={s}
                      checked={data.servicoPrincipal === s}
                      onChange={() => updateData("servicoPrincipal", s)}
                      className="mr-3 w-5 h-5 accent-accent"
                    />
                    <span className="capitalize text-lg">{s.replace(/_/g, " ").toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <Button variant="outline" className="w-full" onClick={() => setStep(s => s - 1)} disabled={isLoading}>Voltar</Button>
        )}
        <Button variant="secondary" className="w-full" onClick={handleNext} disabled={isLoading}>
          {isLoading ? "Salvando..." : step === 4 ? "Finalizar Cadastro" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}