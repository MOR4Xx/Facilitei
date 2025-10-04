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
  const [password, setPassword] = useState(""); // Senha para simulação futura
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Tenta encontrar como Cliente
      let response = await fetch(
        `http://localhost:3333/clientes?email=${email}`
      );
      let users: Cliente[] = await response.json();

      if (users.length > 0) {
        login({ ...users[0], role: "cliente" });
        navigate("/dashboard");
        return;
      }

      // 2. Se não encontrou, tenta como Trabalhador
      response = await fetch(
        `http://localhost:3333/trabalhadores?email=${email}`
      );
      let workers: Trabalhador[] = await response.json();

      if (workers.length > 0) {
        login({ ...workers[0], role: "trabalhador" });
        navigate("/dashboard");
        return;
      }

      // 3. Se não encontrou em nenhum, exibe o erro
      setError("E-mail não encontrado. Verifique suas credenciais.");
    } catch (err) {
      setError("Ocorreu um erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <Typography as="h2" className="text-center mb-2">
          Bem-vindo!
        </Typography>
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
