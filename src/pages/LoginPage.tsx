import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // 👈 Adicionar useSearchParams
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
  const [searchParams] = useSearchParams(); // 👈 Obter search params
  const redirectTo = searchParams.get("redirectTo"); // 👈 Ler o parâmetro 'redirectTo'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Tenta encontrar como Cliente (agora com E-mail E Senha)
      let response = await fetch(
        `http://localhost:3333/clientes?email=${email}&senha=${senha}`
      );
      let users: Cliente[] = await response.json();

      if (users.length > 0) {
        // Se encontrado, faz login e assume a role 'cliente'
        login({ ...users[0], role: "cliente" });
        toast.success("Login efetuado com sucesso!");
        // 👇 LÓGICA DE REDIRECIONAMENTO CORRIGIDA
        navigate(redirectTo || "/dashboard", { replace: true });
        return;
      }

      // 2. Se não encontrou, tenta como Trabalhador (agora com E-mail E Senha)
      response = await fetch(
        `http://localhost:3333/trabalhadores?email=${email}&senha=${senha}`
      );
      let workers: Trabalhador[] = await response.json();

      if (workers.length > 0) {
        // Se encontrado, faz login e assume a role 'trabalhador'
        login({ ...workers[0], role: "trabalhador" });
        toast.success("Login efetuado com sucesso!");
        // 👇 LÓGICA DE REDIRECIONAMENTO CORRIGIDA
        navigate(redirectTo || "/dashboard", { replace: true });
        return;
      }

      // 3. Se não encontrou em nenhum, exibe o erro
      toast.error("E-mail ou senha incorretos. Verifique suas credenciais.");
    } catch (err) {
      toast.error("Ocorreu um erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] py-12">
      {/* 1. TÍTULO GRANDE "FACILITEI" */}
      <Typography
        as="h1"
        className="!text-6xl font-extrabold text-accent mb-10"
      >
        Facilitei
      </Typography>

      {/* 2. CARD DE LOGIN */}
      <Card className="w-full max-w-md p-8">
        {/* Título "Bem-vindo!" */}
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