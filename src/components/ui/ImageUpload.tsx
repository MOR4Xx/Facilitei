import React, { useState } from "react";
import { uploadFile } from "../../lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  className = "",
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Enviando foto...");

    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Foto atualizada!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar imagem.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-dark-subtle">
          {label}
        </label>
      )}

      <div className="flex items-center gap-6">
        {/* Preview Circular */}
        <div className="relative group">
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 ${
              isLoading ? "animate-pulse" : ""
            }`}
          ></div>
          <div className="relative w-24 h-24 rounded-full border-2 border-dark-surface overflow-hidden bg-dark-surface">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : null}

            {value ? (
              <img
                src={value}
                alt="Avatar"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isLoading ? "opacity-50 scale-95" : "group-hover:scale-110"
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5 text-dark-subtle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Upload */}
        <div className="flex-1">
          <input
            type="file"
            id="image-upload-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          <label
            htmlFor="image-upload-input"
            className={`
              flex flex-col items-center justify-center w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group
              ${
                isLoading
                  ? "border-white/10 bg-white/5 cursor-wait opacity-50"
                  : "border-white/20 hover:border-accent hover:bg-accent/5 bg-dark-surface/50"
              }
            `}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mb-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>{value ? "Trocar Foto" : "Carregar Foto"}</span>
            </div>
            <p className="text-xs text-dark-subtle mt-1">
              JPG ou PNG (Max 5MB)
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}
