import { Link, useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";

// --- ÍCONES SVG ---
function ClipboardListIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08H13.5A2.25 2.25 0 0 0 11.25 6v12m-2.25 0V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h3.75M3.75 6h16.5M16.5 6a2.25 2.25 0 0 1-2.25-2.25h-1.5A2.25 2.25 0 0 1 10.5 6h-1.5a2.25 2.25 0 0 1 2.25-2.25h1.5A2.25 2.25 0 0 1 16.5 6Z"
      />
    </svg>
  );
}

function UsersIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0-3.742-.72m-4.5 0a9.094 9.094 0 0 0-3.742.72M18 18.72V5.25A2.25 2.25 0 0 0 15.75 3H8.25A2.25 2.25 0 0 0 6 5.25v13.5m12 0v-2.25a4.5 4.5 0 0 0-9 0v2.25m9 0h-9m9 0-9-10.5m9 10.5-9-10.5m0 0a4.5 4.5 0 1 1 9 0m-9 0a4.5 4.5 0 1 0 9 0"
      />
    </svg>
  );
}

function CheckBadgeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  );
}
// --- FIM ÍCONES ---

// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Animação em cascata
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.3,
    },
  },
};

// --- COMPONENTE PRINCIPAL ---
export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Lógica para o botão "Sou Trabalhador"
  const handleWorkerClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <motion.div
      className="space-y-24 md:space-y-32" // Espaçamento responsivo
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Seção Hero REFORMULADA */}
      <section className="pt-8 md:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Coluna de Texto */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left"
          >
            {/* Título Responsivo */}
            <Typography as="h1" className="!text-4xl sm:!text-5xl md:!text-6xl">
              Sua solução de serviços <br /> em um{" "}
              <span className="text-accent">único lugar</span>.
            </Typography>

            <Typography as="p" className="mt-6 !text-lg max-w-2xl mx-auto md:mx-0">
              Conectamos você aos melhores prestadores de serviço da sua região
              com confiança e agilidade. De reparos domésticos a aulas
              particulares.
            </Typography>

            {/* Botões Responsivos */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                to="/dashboard/solicitar"
                className="
                  bg-gradient-to-r from-accent to-lime-400 hover:from-accent-hover hover:to-lime-500 
                  text-dark-background font-bold py-3 px-8 rounded-lg text-lg 
                  transition-all duration-300 transform hover:scale-105 
                  shadow-lg shadow-accent/20
                  text-center
                "
              >
                Buscar Profissional
              </Link>
              
              <Button
                onClick={handleWorkerClick}
                variant="outline"
                size="lg"
                className="!text-lg !py-3 !border-2 !border-primary/50"
              >
                Sou Trabalhador
              </Button>
            </div>
          </motion.div>

          {/* Coluna Visual (AVATARES ATUALIZADOS) */}
          <motion.div
            variants={heroImageVariants}
            className="hidden md:flex justify-center items-center p-4"
          >
            {/* Stack de Avatares Animados */}
            <div className="relative w-64 h-64">
              <motion.img
                initial={{ x: 0, y: 0, rotate: -15 }}
                animate={{ x: -10, y: 10, rotate: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2.5,
                }}
                src="/avatars/trabalhador-1.png"
                alt="Eletricista"
                className="absolute w-48 h-48 object-cover rounded-2xl border-4 border-dark-surface shadow-2xl"
              />
              <motion.img
                initial={{ x: 0, y: 0, rotate: 10 }}
                animate={{ x: 10, y: -10, rotate: 3 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2.5,
                  delay: 0.3,
                }}
                src="/avatars/trabalhador-2.png"
                alt="Pedreiro"
                className="absolute top-10 right-0 w-48 h-48 object-cover rounded-2xl border-4 border-dark-surface shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção "Como Funciona" REFORMULADA */}
      <motion.section variants={itemVariants}>
        <Typography as="h2" className="text-center !text-3xl md:!text-4xl mb-6">
          É simples e rápido
        </Typography>
        <Typography
          as="p"
          className="text-center !text-lg text-dark-subtle max-w-2xl mx-auto mb-12 md:mb-16"
        >
          Em apenas 3 passos você encontra o profissional ideal.
        </Typography>

        {/* Grid Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* --- CARD 1 --- */}
          <Card
            className="p-8 text-center flex flex-col items-center cursor-pointer group"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -8,
              boxShadow: "0 0 32px 0 rgba(163, 230, 53, 0.3)", // shadow-glow-accent
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full bg-dark-background border-2 border-dark-surface/50 flex items-center justify-center mb-6
                          transition-all duration-300 ease-in-out
                          group-hover:bg-accent/10 group-hover:border-accent/50"
            >
              <ClipboardListIcon
                className="w-8 h-8 text-accent transition-all duration-300 ease-in-out
                                          group-hover:scale-110"
              />
            </div>
            <Typography
              as="h3"
              className="!text-2xl mb-3 transition-colors duration-300
                                         group-hover:text-accent"
            >
              1. Descreva o Serviço
            </Typography>
            <Typography
              as="p"
              className="!text-base transition-colors duration-300
                                         group-hover:text-dark-text"
            >
              Diga-nos o que você precisa. Detalhes ajudam a encontrar o
              profissional ideal.
            </Typography>
          </Card>

          {/* --- CARD 2 --- */}
          <Card
            className="p-8 text-center flex flex-col items-center cursor-pointer group"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -8,
              boxShadow: "0 0 32px 0 rgba(163, 230, 53, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full bg-dark-background border-2 border-dark-surface/50 flex items-center justify-center mb-6
                          transition-all duration-300 ease-in-out
                          group-hover:bg-accent/10 group-hover:border-accent/50"
            >
              <UsersIcon
                className="w-8 h-8 text-accent transition-all duration-300 ease-in-out
                                  group-hover:scale-110"
              />
            </div>
            <Typography
              as="h3"
              className="!text-2xl mb-3 transition-colors duration-300
                                         group-hover:text-accent"
            >
              2. Receba Propostas
            </Typography>
            <Typography
              as="p"
              className="!text-base transition-colors duration-300
                                         group-hover:text-dark-text"
            >
              Profissionais qualificados enviam orçamentos diretamente para você.
            </Typography>
          </Card>

          {/* --- CARD 3 --- */}
          <Card
            className="p-8 text-center flex flex-col items-center cursor-pointer group"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -8,
              boxShadow: "0 0 32px 0 rgba(163, 230, 53, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full bg-dark-background border-2 border-dark-surface/50 flex items-center justify-center mb-6
                          transition-all duration-300 ease-in-out
                          group-hover:bg-accent/10 group-hover:border-accent/50"
            >
              <CheckBadgeIcon
                className="w-8 h-8 text-accent transition-all duration-300 ease-in-out
                                      group-hover:scale-110"
              />
            </div>
            <Typography
              as="h3"
              className="!text-2xl mb-3 transition-colors duration-300
                                         group-hover:text-accent"
            >
              3. Contrate com Segurança
            </Typography>
            <Typography
              as="p"
              className="!text-base transition-colors duration-300
                                         group-hover:text-dark-text"
            >
              Escolha a melhor opção, agende e realize o pagamento com
              tranquilidade.
            </Typography>
          </Card>
        </div>
      </motion.section>

      {/* (BÔNUS) Seção de Categorias Populares */}
      <motion.section variants={itemVariants} className="text-center">
        <Typography as="h2" className="!text-3xl md:!text-4xl mb-6">
          Categorias Populares
        </Typography>
        <Typography
          as="p"
          className="text-center !text-lg text-dark-subtle max-w-2xl mx-auto mb-12"
        >
          Os serviços mais buscados na plataforma.
        </Typography>
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          {[
            "Eletricista",
            "Pedreiro",
            "Encanador",
            "Ar Condicionado",
            "Pintor",
            "Fretes",
          ].map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-dark-surface text-dark-text text-base sm:text-lg font-medium rounded-full border border-dark-surface/50
                           hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}