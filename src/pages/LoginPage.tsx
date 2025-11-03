// src/pages/LoginPage.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import type { Cliente, Trabalhador } from "../types/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setsenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
        navigate("/dashboard");
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
        navigate("/dashboard");
        return;
      }

      // 3. Se não encontrou em nenhum, exibe o erro
      setError("E-mail ou senha incorretos. Verifique suas credenciais.");
    } catch (err) {
      setError("Ocorreu um erro ao conectar com o servidor.");
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
      <Card className="w-full max-w-md">
        
        {/* Título "Bem-vindo!" */}
        <Typography as="p" className="text-center text-dark-subtle mb-8">
          Acesse sua conta para continuar.
        </Typography>

        {error && (
          <Typography className="text-red-500 text-center mb-4">
            {error}
          </Typography>
        )}

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
            type="senha"
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