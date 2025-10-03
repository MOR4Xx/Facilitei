import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';

export function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <Typography as="h2" className="text-center mb-2">
          Bem-vindo de volta!
        </Typography>
        <Typography as="p" className="text-center text-subtle-dark mb-8">
          Acesse sua conta para gerenciar seus serviços.
        </Typography>

        <form className="space-y-6">
          <Input label="Seu e-mail" type="email" />
          <Input label="Sua senha" type="password" />

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>

          <Typography as="p" className="text-center !text-sm">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-accent hover:underline font-semibold">
              Cadastre-se
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}