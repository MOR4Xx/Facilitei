import React, { useState } from "react";
import { uploadFile } from "../../lib/api"; // Importe sua função de API
// Se você usar toast (react-hot-toast ou similar), importe aqui:
// import { toast } from "react-hot-toast"; 

interface ImageUploadProps {
  value?: string; // A URL da imagem atual (se houver)
  onChange: (url: string) => void; // Função para devolver a URL para o pai
  label?: string; // Label opcional (ex: "Foto de Perfil")
  className?: string; // Para estilização extra
}

export function ImageUpload({ value, onChange, label, className = "" }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação simples de tamanho (ex: max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB."); // ou use toast.error
      return;
    }

    setIsLoading(true);
    try {
      // Chama o backend
      const url = await uploadFile(file);
      
      // Devolve a URL para quem chamou o componente
      onChange(url);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar imagem. Tente novamente."); // ou use toast.error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        {/* --- ÁREA DE PREVIEW (Visualização) --- */}
        <div className="relative w-20 h-20 rounded-full border-2 border-accent/50 overflow-hidden bg-dark-surface shadow-md shrink-0">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              {/* Spinner simples com Tailwind */}
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : null}
          
          {value ? (
            <img 
              src={value} 
              alt="Avatar" 
              className={`w-full h-full object-cover transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-surface text-dark-subtle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* --- ÁREA DO BOTÃO --- */}
        <div className="flex-1">
          <input
            type="file"
            id="image-upload-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden" // Esconde o input feio nativo
            disabled={isLoading}
          />
          
          <label
            htmlFor="image-upload-input"
            className={`
              flex flex-col items-center justify-center w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group
              ${isLoading 
                ? "border-gray-600 bg-gray-800/50 cursor-wait opacity-70" 
                : "border-primary/30 hover:border-accent hover:bg-accent/10 bg-dark-surface"
              }
            `}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-dark-text group-hover:text-accent transition-colors">
              {isLoading ? (
                <span>Enviando para nuvem...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>{value ? "Trocar Foto" : "Carregar Foto"}</span>
                </>
              )}
            </div>
            <p className="text-xs text-dark-subtle mt-1">JPG ou PNG (Max 5MB)</p>
          </label>
        </div>
      </div>
    </div>
  );
}