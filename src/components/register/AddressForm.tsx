import { useState } from "react";
import { Input } from "../ui/Input";
import { toast } from "react-hot-toast";

// Formatters (trazidos para cá ou importados de um utils)
const formatCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
const formatUF = (v: string) => v.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);

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
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const json = await res.json();
      if (json.erro) {
        toast.error("CEP não encontrado.");
      } else {
        onChange("rua", json.logradouro);
        onChange("bairro", json.bairro);
        onChange("cidade", json.localidade);
        onChange("estado", json.uf);
        document.getElementById("numero")?.focus();
      }
    } catch {
      toast.error("Erro ao buscar CEP.");
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
    <fieldset className="space-y-6">
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
        {isCepLoading && <span className="absolute right-3 top-10 text-xs text-accent animate-pulse">Buscando...</span>}
      </div>
      
      <Input label="Rua / Avenida" name="rua" value={data.rua} onChange={handleChange} required disabled={isLoading} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input id="numero" label="Número" name="numero" value={data.numero} onChange={handleChange} required disabled={isLoading} />
        <Input label="Bairro" name="bairro" value={data.bairro} onChange={handleChange} required disabled={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Cidade" name="cidade" value={data.cidade} onChange={handleChange} required disabled={isLoading} />
        <Input label="UF" name="estado" value={data.estado} onChange={handleChange} required maxLength={2} disabled={isLoading} />
      </div>
    </fieldset>
  );
}