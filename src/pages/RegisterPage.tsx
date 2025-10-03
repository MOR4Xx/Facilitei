import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';

export function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <Typography as="h2" className="text-center mb-2">
          Crie sua conta
        </Typography>
        <Typography as="p" className="text-center text-subtle-dark mb-8">
          É rápido e fácil. Comece a usar o Facilitei agora mesmo.
        </Typography>

        <form className="space-y-6">
          <Input label="Seu nome completo" type="text" />
          <Input label="Seu melhor e-mail" type="email" />
          <Input label="Crie uma senha" type="password" />
          
          <Button type="submit" size="lg" className="w-full">
            Criar Conta
          </Button>

          <Typography as="p" className="text-center !text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-accent hover:underline font-semibold">
              Faça login
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}