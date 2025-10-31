// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useAuthStore } from '../store/useAuthStore';
import type { Cliente, Trabalhador, Endereco, TipoServico } from '../types/api';

// Define o tipo de usuário que pode ser criado
type UserRole = 'cliente' | 'trabalhador';

// Estado inicial para o endereço
const initialStateEndereco: Endereco = {
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

// Lista de todos os serviços disponíveis, baseada no TipoServico de api.ts
const allServices: TipoServico[] = [
  "PEDREIRO",
  "ELETRICISTA",
  "ENCANADOR",
  "INSTALADOR_AR_CONDICIONADO",
];

export function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('cliente');
  const [endereco, setEndereco] = useState<Endereco>(initialStateEndereco);
  const [selectedServices, setSelectedServices] = useState<TipoServico[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Handler para atualizar o estado aninhado do endereço
  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndereco((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para os botões de serviços (antigo checkbox)
  const handleServiceChange = (service: TipoServico) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service) // Remove se já existe
        : [...prev, service] // Adiciona se não existe
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação simples de CEP
    if (endereco.cep.length < 8) {
      setError('Por favor, insira um CEP válido.');
      return;
    }

    // VALIDAÇÃO ZIKA: Verifica se o profissional selecionou serviços
    if (userType === 'trabalhador' && selectedServices.length === 0) {
      setError(
        'Como profissional, você precisa selecionar pelo menos um serviço que oferece.'
      );
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Verificar se o e-mail já existe
      const emailCheckCliente = await fetch(
        `http://localhost:3333/clientes?email=${email}`
      );
      const existingClientes: Cliente[] = await emailCheckCliente.json();

      const emailCheckTrabalhador = await fetch(
        `http://localhost:3333/trabalhadores?email=${email}`
      );
      const existingTrabalhadores: Trabalhador[] =
        await emailCheckTrabalhador.json();

      if (existingClientes.length > 0 || existingTrabalhadores.length > 0) {
        setError('Este e-mail já está em uso.');
        setIsLoading(false);
        return;
      }

      // 2. Criar o novo usuário (POST)
      let postResponse;
      let endpoint;

      if (userType === 'cliente') {
        const newCliente: Omit<Cliente, 'id'> = {
          nome,
          email,
          telefone,
          avatarUrl: '/avatars/cliente-1.png',
          notaCliente: 0,
          endereco,
        };
        endpoint = 'clientes';
        postResponse = await fetch(`http://localhost:3333/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCliente),
        });
      } else {
        const newTrabalhador: Omit<Trabalhador, 'id'> = {
          nome,
          email,
          telefone,
          avatarUrl: '/avatars/trabalhador-2.png',
          endereco,
          disponibilidade: 'Segunda a Sexta, 8h às 18h',
          notaTrabalhador: 0,
          servicos: selectedServices,
          servicoPrincipal: selectedServices[0],
        };
        endpoint = 'trabalhadores';
        postResponse = await fetch(`http://localhost:3333/trabalhadores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTrabalhador),
        });
      }

      if (!postResponse.ok) {
        throw new Error('Falha ao criar a conta no servidor.');
      }

      //
      // 👇 =================================================================
      // 👇  A CORREÇÃO ZIKA ESTÁ AQUI
      // 👇 =================================================================
      //
      // 3. Em vez de confiar na resposta do POST, BUSCAMOS (GET) o usuário
      //    pelo email para pegar o ID oficial que o db.json criou.
      //
      const getResponse = await fetch(
        `http://localhost:3333/${endpoint}?email=${email}`
      );
      const createdUserArray: (Cliente[] | Trabalhador[]) = await getResponse.json();

      if (createdUserArray.length === 0) {
        throw new Error('Erro ao recuperar o usuário recém-criado.');
      }

      const finalNewUser = createdUserArray[0];
      //
      // 👆 =================================================================
      // 👆  FIM DA CORREÇÃO
      // 👆 =================================================================
      //

      // 4. Fazer login e redirecionar
      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      // Agora o 'finalNewUser' TEM o ID correto!
      login({ ...(finalNewUser as Cliente | Trabalhador), role: userType });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg">
        <Typography as="h2" className="text-center mb-2">
          Crie sua conta
        </Typography>
        <Typography as="p" className="text-center text-dark-subtle mb-8">
          Preencha seus dados para começar a usar o Facilitei.
        </Typography>

        {error && (
          <Typography className="text-red-500 text-center mb-4">
            {error}
          </Typography>
        )}
        {success && (
          <Typography className="text-accent text-center mb-4">
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- DADOS PESSOAIS --- */}
          <fieldset className="space-y-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2"
            >
              Dados Pessoais
            </Typography>
            <Input
              label="Nome Completo"
              name="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Seu melhor e-mail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
             <Input
              label="Telefone (WhatsApp)"
              name="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Crie uma senha"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </fieldset>

          {/* --- ENDEREÇO --- */}
          <fieldset className="space-y-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
            >
              Endereço
            </Typography>
            
            <Input
              label="CEP"
              name="cep"
              value={endereco.cep}
              onChange={handleEnderecoChange}
              required
              disabled={isLoading}
              maxLength={9}
            />
            <Input
              label="Rua / Avenida"
              name="rua"
              value={endereco.rua}
              onChange={handleEnderecoChange}
              required
              disabled={isLoading}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Número"
                name="numero"
                value={endereco.numero}
                onChange={handleEnderecoChange}
                required
                disabled={isLoading}
                className="md:col-span-1"
              />
              <Input
                label="Bairro"
                name="bairro"
                value={endereco.bairro}
                onChange={handleEnderecoChange}
                required
                disabled={isLoading}
                className="md:col-span-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Cidade"
                name="cidade"
                value={endereco.cidade}
                onChange={handleEnderecoChange}
                required
                disabled={isLoading}
                className="md:col-span-2"
              />
              <Input
                label="Estado (UF)"
                name="estado"
                value={endereco.estado}
                onChange={handleEnderecoChange}
                required
                disabled={isLoading}
                maxLength={2}
                className="md:col-span-1"
              />
            </div>
          </fieldset>

          {/* --- TIPO DE CONTA (BOTÕES ZIKA) --- */}
          <fieldset className="space-y-3">
             <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
            >
              Tipo de Conta
            </Typography>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setUserType('cliente')}
                disabled={isLoading}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300 text-center
                  ${userType === 'cliente'
                    ? 'bg-primary border-primary text-white font-bold shadow-glow-primary'
                    : 'bg-dark-surface border-dark-surface text-dark-subtle hover:border-primary/50'
                  }
                `}
              >
                Quero Contratar
                <span className="block text-xs opacity-80">(Cliente)</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('trabalhador')}
                disabled={isLoading}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300 text-center
                  ${userType === 'trabalhador'
                    ? 'bg-accent border-accent text-dark-background font-bold shadow-glow-accent'
                    : 'bg-dark-surface border-dark-surface text-dark-subtle hover:border-accent/50'
                  }
                `}
              >
                Quero Trabalhar
                <span className="block text-xs opacity-80">(Profissional)</span>
              </button>
            </div>
          </fieldset>
          
          {/* --- SELEÇÃO DE SERVIÇO (BOTÕES ZIKA) --- */}
          {userType === 'trabalhador' && (
            <fieldset className="space-y-3">
              <Typography
                as="h3"
                className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
              >
                Quais serviços você oferece?
                <span className="text-red-500">*</span>
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {allServices.map((service) => (
                  <button
                    type="button"
                    key={service}
                    onClick={() => handleServiceChange(service)}
                    disabled={isLoading}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all duration-200
                      ${selectedServices.includes(service)
                        ? 'bg-accent border-accent text-dark-background font-bold'
                        : 'bg-dark-surface border-dark-surface text-dark-subtle hover:border-accent/50'
                      }
                    `}
                  >
                    <span className="capitalize">
                      {/* Formata o nome para ficar bonito (ex: "Instalador Ar Condicionado") */}
                      {service.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* --- SUBMIT --- */}
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full !mt-10"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
          </Button>

          <Typography as="p" className="text-center !text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-accent hover:underline font-semibold"
            >
              Faça login
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}