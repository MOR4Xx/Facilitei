import { useState } from "react";
import { Input } from "../ui/Input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// Formatters
const formatCEP = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
const formatUF = (v: string) =>
  v
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 2);

interface AddressData {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Props {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  isLoading: boolean;
}

export function AddressForm({ data, onChange, isLoading }: Props) {
  const [isCepLoading, setIsCepLoading] = useState(false);

  const handleCepBlur = async () => {
    const cepClean = data.cep.replace(/\D/g, "");
    if (cepClean.length !== 8) return;

    setIsCepLoading(true);
    const toastId = toast.loading("Buscando CEP...");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const json = await res.json();
      if (json.erro) {
        toast.error("CEP não encontrado.", { id: toastId });
      } else {
        onChange("rua", json.logradouro);
        onChange("bairro", json.bairro);
        onChange("cidade", json.localidade);
        onChange("estado", json.uf);
        toast.success("Endereço encontrado!", { id: toastId });
        document.getElementById("numero")?.focus();
      }
    } catch {
      toast.error("Erro ao buscar CEP.", { id: toastId });
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "cep") finalValue = formatCEP(value);
    if (name === "estado") finalValue = formatUF(value);
    if (name === "numero") finalValue = value.replace(/\D/g, "");

    onChange(name as keyof AddressData, finalValue);
  };

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <Input
          label="CEP"
          name="cep"
          value={data.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
          required
          disabled={isLoading || isCepLoading}
          maxLength={9}
          placeholder="00000-000"
        />
        {isCepLoading && (
          <span className="absolute right-3 top-9 text-xs text-accent animate-pulse font-bold">
            Buscando...
          </span>
        )}
      </div>

      <Input
        label="Rua / Avenida"
        name="rua"
        value={data.rua}
        onChange={handleChange}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input
          id="numero"
          label="Número"
          name="numero"
          value={data.numero}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <div className="md:col-span-2">
          <Input
            label="Bairro"
            name="bairro"
            value={data.bairro}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <Input
            label="Cidade"
            name="cidade"
            value={data.cidade}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <Input
          label="UF"
          name="estado"
          value={data.estado}
          onChange={handleChange}
          required
          maxLength={2}
          disabled={isLoading}
        />
      </div>
    </motion.div>
  );
}
