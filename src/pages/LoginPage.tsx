import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";

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
      // O endpoint no AuthController é /api/auth/login
      const { data } = await api.post("/auth/login", { email, senha });

      // O backend retorna LoginResponseDTO { role, user }
      if (data.user && data.role) {
        login({ ...data.user, role: data.role }); // Atualiza Zustand
        toast.success("Login efetuado com sucesso!");
        navigate(redirectTo || "/dashboard", { replace: true });
      }
    } catch (err: any) {
      // Axios coloca a resposta do erro em err.response.data
      const mensagem =
        err.response?.data?.message || "Erro ao conectar com o servidor.";
      toast.error(mensagem);
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
