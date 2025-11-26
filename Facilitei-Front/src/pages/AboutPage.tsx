import { motion } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import { Card } from "../components/ui/Card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AboutPage() {
  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-16 relative py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

      <motion.section className="text-center" variants={itemVariants}>
        <Typography
          as="h1"
          className="!text-5xl sm:!text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
        >
          Sobre o Facilitei
        </Typography>
        <Typography
          as="p"
          className="text-xl text-dark-subtle max-w-3xl mx-auto leading-relaxed"
        >
          Nossa missão é simplificar a forma como você encontra e contrata
          serviços locais, trazendo mais segurança, praticidade e qualidade para
          o seu dia a dia.
        </Typography>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card className="h-full p-8 sm:p-12 bg-dark-surface/60 backdrop-blur-md border-primary/20">
            <Typography as="h2" className="text-white mb-4 !text-3xl">
              Nossa Visão
            </Typography>
            <p className="text-lg text-dark-subtle leading-relaxed">
              Acreditamos que todos merecem acesso fácil a profissionais
              qualificados. O Facilitei nasceu da necessidade de criar uma ponte
              segura entre clientes e prestadores, eliminando a incerteza da
              contratação.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full p-8 shadow-glow-accent border border-accent/20 bg-dark-surface/80">
            <Typography
              as="h3"
              className="mb-6 text-center !text-xl text-accent"
            >
              Pilares
            </Typography>
            <ul className="space-y-4">
              {[
                {
                  icon: "🚀",
                  title: "Confiança",
                  desc: "Profissionais verificados.",
                },
                {
                  icon: "⭐",
                  title: "Qualidade",
                  desc: "Excelência em cada serviço.",
                },
                { icon: "🛠️", title: "Simplicidade", desc: "Sem burocracia." },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-dark-subtle">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
