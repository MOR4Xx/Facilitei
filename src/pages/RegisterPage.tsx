// src/pages/RegisterPage.tsx
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useAuthStore } from '../store/useAuthStore';
import type { Cliente, Trabalhador, Endereco, TipoServico } from '../types/api';

// (O resto do arquivo permanece o mesmo... Stepper, allServices, etc)
// ...

// =================================================================
//  MUDANÇA ZIKA: SALVANDO A SENHA NO HANDLE SUBMIT
// =================================================================

// Define o tipo de usuário
type UserRole = 'cliente' | 'trabalhador';

// Lista de todos os serviços disponíveis (copiado do original)
const allServices: TipoServico[] = [
  "PEDREIRO",
  "ELETRICISTA",
  "ENCANADOR",
  "INSTALADOR_AR_CONDICIONADO",
];

// --- COMPONENTE INTERNO: INDICADOR DE ETAPAS (O CAMINHO) ---
interface StepperProps {
  currentStep: number;
  userType: UserRole | null;
}

function Stepper({ currentStep, userType }: StepperProps) {
  const steps = useMemo(() => {
    const baseSteps = ["Conta", "Dados", "Endereço"];
    if (userType === 'trabalhador') {
      return [...baseSteps, "Serviços"];
    }
    return baseSteps;
  }, [userType]);

  return (
    <nav className="flex items-center justify-center mb-8" aria-label="Progresso">
      <ol className="flex items-center space-x-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={label} className="flex items-center">
              <span
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                  transition-all duration-300
                  ${isActive
                    ? 'bg-accent text-dark-background scale-110 shadow-glow-accent'
                    : isCompleted
                    ? 'bg-primary text-white'
                    : 'bg-dark-surface border-2 border-primary/50 text-primary/70'
                  }
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </span>
              <span
                className={`
                  ml-2 text-sm font-semibold
                  ${isActive ? 'text-accent' : isCompleted ? 'text-dark-text' : 'text-dark-subtle'}
                `}
              >
                {label}
              </span>
              
              {/* Linha conectora */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-auto h-0.5 mx-3
                    ${isCompleted ? 'bg-primary' : 'bg-dark-surface'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
// --- FIM DO COMPONENTE STEPPER ---


export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: 'cliente' as UserRole,
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
    selectedServices: [] as TipoServico[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();

  // --- Handlers de Mudança ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value },
    }));
  };

  const handleServiceChange = (service: TipoServico) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleUserTypeSelect = (type: UserRole) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    nextStep(); // Avança automaticamente ao selecionar o tipo
  };

  // --- Lógica de Navegação ---
  const nextStep = () => {
    // Validação simples antes de avançar (pode ser melhorada com Zod)
    setError('');
    
    // Validação Etapa 2 (Dados Pessoais)
    if (step === 2) {
      if (!formData.nome || !formData.email || !formData.senha || !formData.telefone) {
        setError('Preencha todos os dados pessoais para continuar.');
        return;
      }
      if (formData.senha.length < 3) {
         setError('A senha precisa ter pelo menos 3 caracteres.');
         return;
      }
    }
    
    // Validação Etapa 3 (Endereço)
    if (step === 3) {
       if (!formData.endereco.rua || !formData.endereco.cidade || !formData.endereco.cep) {
         setError('Preencha pelo menos CEP, Rua e Cidade para continuar.');
         return;
       }
    }
    
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep((s) => s - 1);
  };

  // --- Lógica de Submissão (Adaptada do original) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação final específica do Trabalhador
    if (formData.userType === 'trabalhador' && formData.selectedServices.length === 0) {
      setError(
        'Como profissional, você precisa selecionar pelo menos um serviço.'
      );
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Verificar se o e-mail já existe
      const emailCheckCliente = await fetch(
        `http://localhost:3333/clientes?email=${formData.email}`
      );
      const existingClientes: Cliente[] = await emailCheckCliente.json();

      const emailCheckTrabalhador = await fetch(
        `http://localhost:3333/trabalhadores?email=${formData.email}`
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

      if (formData.userType === 'cliente') {
        const newCliente: Omit<Cliente, 'id'> = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha, // 👈 SENHA SALVA AQUI
          telefone: formData.telefone,
          avatarUrl: '/avatars/cliente-1.png',
          notaCliente: 0,
          endereco: formData.endereco,
        };
        endpoint = 'clientes';
        postResponse = await fetch(`http://localhost:3333/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCliente),
        });
      } else {
        const newTrabalhador: Omit<Trabalhador, 'id'> = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha, // 👈 SENHA SALVA AQUI
          telefone: formData.telefone,
          avatarUrl: '/avatars/trabalhador-2.png',
          endereco: formData.endereco,
          disponibilidade: 'Segunda a Sexta, 8h às 18h',
          notaTrabalhador: 0,
          servicos: formData.selectedServices,
          servicoPrincipal: formData.selectedServices[0],
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

      // 3. Buscar o usuário recém-criado (lógica original ZIKA)
      const getResponse = await fetch(
        `http://localhost:3333/${endpoint}?email=${formData.email}`
      );
      const createdUserArray: (Cliente[] | Trabalhador[]) = await getResponse.json();

      if (createdUserArray.length === 0) {
        throw new Error('Erro ao recuperar o usuário recém-criado.');
      }
      const finalNewUser = createdUserArray[0];

      // 4. Fazer login e redirecionar
      setSuccess('Conta criada com sucesso! Redirecionando...');
      login({ ...(finalNewUser as Cliente | Trabalhador), role: formData.userType });

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

  // Define o total de etapas
  const totalSteps = formData.userType === 'trabalhador' ? 4 : 3;
  
  // Animação dos painéis
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };
  
  // (Guardando a direção para a animação)
  const [direction, setDirection] = useState(1); 
  
  const handleNext = () => {
    setDirection(1);
    if (step === totalSteps) {
      handleSubmit(new Event('submit') as any); // Chama o submit na última etapa
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };


  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg overflow-hidden">
        <Typography as="h2" className="text-center mb-2">
          Crie sua conta
        </Typography>
        <Typography as="p" className="text-center text-dark-subtle mb-8">
          Siga as etapas para começar no Facilitei.
        </Typography>

        {/* O CAMINHO (STEPPER) */}
        <Stepper currentStep={step} userType={formData.userType} />

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

        {/* Área do Formulário com Animação */}
        <div className="relative h-auto min-h-[400px]">
          <AnimatePresence initial={false} custom={direction}>
            
            {/* ETAPA 1: TIPO DE CONTA */}
            {step === 1 && (
              <motion.div
                key={1}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <fieldset className="space-y-3">
                  <Typography
                    as="h3"
                    className="!text-xl text-center pb-2 pt-4"
                  >
                    O que você busca?
                  </Typography>
                  
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect('cliente')}
                      disabled={isLoading}
                      className={`
                        p-6 rounded-lg border-2 transition-all duration-300 text-center
                        bg-dark-surface border-primary/50 text-dark-subtle hover:border-primary hover:text-primary hover:shadow-glow-primary
                      `}
                    >
                      Quero Contratar
                      <span className="block text-xs opacity-80">(Cliente)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect('trabalhador')}
                      disabled={isLoading}
                      className={`
                        p-6 rounded-lg border-2 transition-all duration-300 text-center
                        bg-dark-surface border-accent/50 text-dark-subtle hover:border-accent hover:text-accent hover:shadow-glow-accent
                      `}
                    >
                      Quero Trabalhar
                      <span className="block text-xs opacity-80">(Profissional)</span>
                    </button>
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 2: DADOS PESSOAIS */}
            {step === 2 && (
              <motion.div
                key={2}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-6">
                  <Input
                    label="Nome Completo"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Seu melhor e-mail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Telefone (WhatsApp)"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Crie uma senha"
                    name="senha"
                    type="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 3: ENDEREÇO */}
            {step === 3 && (
              <motion.div
                key={3}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-6">
                  <Input
                    label="CEP"
                    name="cep"
                    value={formData.endereco.cep}
                    onChange={handleEnderecoChange}
                    required
                    disabled={isLoading}
                    maxLength={9}
                  />
                  <Input
                    label="Rua / Avenida"
                    name="rua"
                    value={formData.endereco.rua}
                    onChange={handleEnderecoChange}
                    required
                    disabled={isLoading}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Número"
                      name="numero"
                      value={formData.endereco.numero}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading}
                      className="md:col-span-1"
                    />
                    <Input
                      label="Bairro"
                      name="bairro"
                      value={formData.endereco.bairro}
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
                      value={formData.endereco.cidade}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading}
                      className="md:col-span-2"
                    />
                    <Input
                      label="Estado (UF)"
                      name="estado"
                      value={formData.endereco.estado}
                      onChange={handleEnderecoChange}
                      required
                      disabled={isLoading}
                      maxLength={2}
                      className="md:col-span-1"
                    />
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* ETAPA 4: SERVIÇOS (SÓ TRABALHADOR) */}
            {step === 4 && formData.userType === 'trabalhador' && (
              <motion.div
                key={4}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <fieldset className="space-y-3">
                  <Typography
                    as="h3"
                    className="!text-xl border-b border-dark-surface/50 pb-2"
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
                          ${formData.selectedServices.includes(service)
                            ? 'bg-accent border-accent text-dark-background font-bold'
                            : 'bg-dark-surface border-primary/50 text-dark-subtle hover:border-accent/50'
                          }
                        `}
                      >
                        <span className="capitalize">
                          {service.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
        
        {/* BOTÕES DE NAVEGAÇÃO E SUBMIT */}
        <div className="flex gap-4 pt-8">
          {step > 1 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePrev}
              disabled={isLoading}
            >
              Voltar
            </Button>
          )}
          {step > 1 && (
             <Button
              variant="secondary"
              className="w-full"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading
                ? 'Salvando...'
                : (step === totalSteps ? 'Finalizar Cadastro' : 'Próximo')}
            </Button>
          )}
        </div>

        <Typography as="p" className="text-center !text-sm mt-6">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-accent hover:underline font-semibold"
          >
            Faça login
          </Link>
        </Typography>

      </Card>
    </div>
  );
}