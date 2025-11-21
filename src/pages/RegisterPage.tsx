import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { RegisterCliente } from "../components/register/RegisterCliente";
import { RegisterTrabalhador } from "../components/register/RegisterTrabalhador";

type UserRole = "cliente" | "trabalhador" | null;

export function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  return (
    <div className="flex justify-center items-center py-6 md:py-12 min-h-[80vh]">
      <Card className="w-full max-w-lg overflow-hidden p-6 sm:p-8">
        <Typography as="h2" className="text-center mb-2 !text-3xl sm:!text-4xl">
          Crie sua conta
        </Typography>
        
        {/* Botão de Voltar ao início se já escolheu */}
        {selectedRole && (
          <button 
            onClick={() => setSelectedRole(null)}
            className="text-sm text-primary hover:underline mb-4 block text-center"
          >
            &larr; Mudar tipo de conta
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* ESTADO 1: ESCOLHA O TIPO */}
          {!selectedRole && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6 mt-8"
            >
              <Typography as="p" className="text-center text-dark-subtle">
                Como você deseja usar o Facilitei?
              </Typography>

              <div className="grid gap-4">
                <button
                  onClick={() => setSelectedRole("cliente")}
                  className="group p-6 rounded-xl border-2 border-primary/30 bg-dark-surface hover:border-primary hover:shadow-glow-primary transition-all text-left"
                >
                  <span className="block text-xl font-bold text-primary group-hover:text-white">Sou Cliente</span>
                  <span className="text-sm text-dark-subtle">Quero encontrar profissionais para meus projetos.</span>
                </button>

                <button
                  onClick={() => setSelectedRole("trabalhador")}
                  className="group p-6 rounded-xl border-2 border-accent/30 bg-dark-surface hover:border-accent hover:shadow-glow-accent transition-all text-left"
                >
                  <span className="block text-xl font-bold text-accent group-hover:text-white">Sou Profissional</span>
                  <span className="text-sm text-dark-subtle">Quero oferecer meus serviços e conseguir clientes.</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ESTADO 2: FORMULÁRIOS ESPECÍFICOS */}
          {selectedRole === "cliente" && (
            <motion.div key="cliente" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <RegisterCliente />
            </motion.div>
          )}

          {selectedRole === "trabalhador" && (
            <motion.div key="trabalhador" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <RegisterTrabalhador />
            </motion.div>
          )}
        </AnimatePresence>

        <Typography as="p" className="text-center !text-sm mt-8 pt-6 border-t border-dark-surface/50">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-accent hover:underline font-semibold">
            Faça login
          </Link>
        </Typography>
      </Card>
    </div>
  );
}