import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import { motion } from "framer-motion";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setsenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, senha });

      if (data.user && data.role) {
        login({ ...data.user, role: data.role });
        toast.success("Login efetuado com sucesso!");
        navigate(redirectTo || "/dashboard", { replace: true });
      }
    } catch (err: any) {
      const mensagem =
        err.response?.data?.message || "Erro ao conectar com o servidor.";
      toast.error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-[80vh] py-6 md:py-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[80px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Typography
            as="h1"
            className="!text-5xl font-extrabold mb-2 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Facilitei
            </span>
            <span className="text-accent">.</span>
          </Typography>
          <p className="text-dark-subtle text-lg">
            Bem-vindo de volta, parceiro!
          </p>
        </div>

        <Card className="p-8 sm:p-10 border-primary/10 shadow-[0_0_40px_-10px_rgba(13,148,136,0.15)] backdrop-blur-xl bg-dark-surface/60">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
              className="bg-dark-background/50 border-primary/20 focus:border-accent/50"
            />
            <div className="relative">
              <Input
                label="Senha"
                name="senha"
                type="password"
                value={senha}
                onChange={(e) => setsenha(e.target.value)}
                required
                className="bg-dark-background/50 border-primary/20 focus:border-accent/50"
              />
              <Link
                to="#"
                className="absolute top-0 right-0 text-xs text-dark-subtle hover:text-accent transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="w-full font-bold text-lg shadow-glow-accent hover:scale-[1.02] active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark-background border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Acessar Conta"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-surface text-dark-subtle">
                  Ou
                </span>
              </div>
            </div>

            <Typography as="p" className="text-center !text-sm">
              Ainda não tem conta?{" "}
              <Link
                to="/cadastro"
                className="text-accent hover:text-white hover:underline font-semibold transition-colors"
              >
                Crie agora grátis
              </Link>
            </Typography>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
