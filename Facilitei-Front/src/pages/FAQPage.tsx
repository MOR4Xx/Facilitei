import { AccordionItem } from "../components/ui/Accordion";
import { Typography } from "../components/ui/Typography";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";

export function FAQPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <div className="text-center mb-16">
        <Typography as="h1" className="!text-4xl md:!text-5xl font-bold mb-4">
          Dúvidas Frequentes
        </Typography>
        <p className="text-xl text-dark-subtle">
          Tudo o que você precisa saber para usar o Facilitei.
        </p>
      </div>

      <Card className="divide-y divide-white/10 bg-dark-surface/50 backdrop-blur-md border-primary/20">
        <AccordionItem title="Como funciona o pagamento?">
          <p>
            O pagamento é negociado livremente entre você e o profissional. O
            Facilitei conecta as partes, mas não retém valores, garantindo que
            100% do valor vá para quem trabalhou.
          </p>
        </AccordionItem>
        <AccordionItem title="Os profissionais são verificados?">
          <p>
            Sim! Realizamos uma verificação de antecedentes e documentos de
            todos os profissionais cadastrados para garantir a segurança da
            comunidade.
          </p>
        </AccordionItem>
        <AccordionItem title="E se o serviço não for concluído?">
          <p>
            Você pode reportar o problema através do nosso suporte. Temos uma
            equipe pronta para mediar conflitos e garantir que ninguém saia no
            prejuízo.
          </p>
        </AccordionItem>
        <AccordionItem title="Como cancelo um serviço?">
          <p>
            Acesse seu Dashboard, encontre o serviço e clique em "Contestar" ou
            entre em contato via chat com o profissional para reagendar.
          </p>
        </AccordionItem>
      </Card>
    </motion.div>
  );
}
