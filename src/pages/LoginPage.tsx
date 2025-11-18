import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import type { Cliente, Trabalhador } from "../types/api";
import { toast } from "react-hot-toast";

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
      // 1. Chamar o novo endpoint de login do backend
      const response = await fetch(
        `http://localhost:8080/api/auth/login`, // 👈 NOSSO NOVO ENDPOINT
        {
          method: "POST", // 👈 MUDOU PARA POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }), // 👈 ENVIANDO NO BODY
        }
      );

      if (!response.ok) {
        // Se o backend deu erro 404 (ResourceNotFound) ou outro
        const errorData = await response.json();
        throw new Error(errorData.message || "E-mail ou senha incorretos.");
      }

      // 2. Receber o LoginResponseDTO
      const loginResponse: { role: 'cliente' | 'trabalhador'; user: Cliente | Trabalhador } = await response.json();

      if (loginResponse && loginResponse.user && loginResponse.role) {
        // 3. Fazer login no Zustand
        login({ ...loginResponse.user, role: loginResponse.role }); // 👈 DADOS VINDOS DO BACKEND
        toast.success("Login efetuado com sucesso!");
        navigate(redirectTo || "/dashboard", { replace: true });
        return;
      }

      throw new Error("Resposta de login inválida do servidor.");

    } catch (err) {
      toast.error(
         err instanceof Error ? err.message : "Ocorreu um erro ao conectar com o servidor."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] py-6 md:py-12">
      
      <Typography
        as="h1"
        className="!text-5xl sm:!text-6xl font-extrabold text-accent mb-8 sm:mb-10"
      >
        Facilitei
      </Typography>

      <Card className="w-full max-w-md p-6 sm:p-8">
        
        <Typography as="p" className="text-center text-dark-subtle mb-8">
          Acesse sua conta para continuar.
        </Typography>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Seu e-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Sua senha"
            name="senha"
            type="password"
            value={senha}
            onChange={(e) => setsenha(e.target.value)}
            required
          />

          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <Typography as="p" className="text-center !text-sm">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="text-accent hover:underline font-semibold"
            >
              Cadastre-se
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}