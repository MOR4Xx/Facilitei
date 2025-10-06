// src/pages/AboutPage.tsx
import { motion } from 'framer-motion'; // Importe para animações modernas
import { Typography } from '../components/ui/Typography';
import { Card } from '../components/ui/Card';

// Variantes para animação de containers em cascata
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animação em cascata dos elementos internos
    },
  },
};

// Variantes para animação de itens (fade-in e slide up)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AboutPage() {
  return (
    // Animação de entrada da página
    <motion.div
      className="max-w-5xl mx-auto space-y-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Seção Principal / Hero */}
      <motion.section 
        className="text-center"
        variants={itemVariants}
      >
        {/* Uso do componente Typography */}
        <Typography as="h1" className="text-accent !text-6xl mb-4">
          Sobre o Facilitei
        </Typography>
        <Typography as="p" className="text-xl max-w-3xl mx-auto">
          Nossa missão é simplificar a forma como você encontra e contrata serviços locais, trazendo mais segurança, praticidade e qualidade para o seu dia a dia.
        </Typography>
      </motion.section>

      {/* Seção Visão e Valores (Layout em Grid) */}
      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* Nossa Visão em um Card */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card className="h-full p-10">
            <Typography as="h2" className="text-primary mb-4 !text-4xl">
              Nossa Visão
            </Typography>
            <Typography as="p" className="!text-lg">
              Acreditamos que todos merecem acesso fácil a profissionais qualificados e de confiança. O Facilitei nasceu da necessidade de criar uma ponte segura entre clientes e prestadores de serviço, eliminando a incerteza e a burocracia do processo de contratação.
            </Typography>
          </Card>
        </motion.div>
        
        {/* Nossos Valores em um Card animado */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-dark-surface p-8 shadow-glow-accent border border-primary/20">
            <Typography as="h3" className="mb-4 text-center">
              Nossos Valores
            </Typography>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold flex-shrink-0 text-xl">🚀</span>
                <Typography as="span" className="!text-dark-text">
                  <span className="font-semibold text-accent">Confiança:</span> Verificação e avaliação contínua dos profissionais.
                </Typography>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold flex-shrink-0 text-xl">⭐</span>
                <Typography as="span" className="!text-dark-text">
                  <span className="font-semibold text-accent">Qualidade:</span> Compromisso com a excelência em cada serviço.
                </Typography>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold flex-shrink-0 text-xl">🛠️</span>
                <Typography as="span" className="!text-dark-text">
                  <span className="font-semibold text-accent">Simplicidade:</span> Uma plataforma intuitiva do início ao fim.
                </Typography>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
      
      {/* Seção de Chamada Final (Call to Action) */}
      <motion.section 
        className="text-center pt-8"
        variants={itemVariants}
      >
        <Typography as="h2" className="!text-accent mb-4">
          O Futuro dos Serviços Locais
        </Typography>
        <Typography as="p" className="max-w-4xl mx-auto !text-lg">
          Estamos em constante evolução, utilizando tecnologia de ponta para garantir que você encontre o profissional certo, no momento certo. Nosso foco é na sua tranquilidade e na valorização do trabalho de nossos prestadores. Junte-se à revolução Facilitei.
        </Typography>
      </motion.section>
    </motion.div>
  );
}