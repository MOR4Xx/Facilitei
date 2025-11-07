import { AccordionItem } from "../components/ui/Accordion";
import { Typography } from '../components/ui/Typography';

export function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <Typography as="h1" className="!text-4xl sm:!text-5xl font-extrabold text-dark-text">Dúvidas Frequentes</Typography>
        <p className="mt-4 text-lg text-dark-subtle">Encontre aqui as respostas para as perguntas mais comuns.</p>
      </div>
      <div className="space-y-4">
        <AccordionItem title="Como funciona o pagamento?">
          <p>O pagamento é combinado diretamente com o profissional. A plataforma Facilitei conecta você ao prestador, mas a negociação de valores e forma de pagamento é feita entre as duas partes para maior flexibilidade.</p>
        </AccordionItem>
        <AccordionItem title="Os profissionais são de confiança?">
          <p>Sim. Todos os profissionais passam por um processo de verificação de documentos e antecedentes. Além disso, nosso sistema de avaliação permite que a comunidade avalie a qualidade e a confiabilidade de cada prestador após a conclusão de um serviço.</p>
        </AccordionItem>
        <AccordionItem title="O que acontece se eu tiver um problema com o serviço?">
          <p>Recomendamos que você primeiro tente resolver diretamente com o profissional. Caso não seja possível, nossa equipe de suporte está disponível para mediar a situação e ajudar a encontrar a melhor solução.</p>
        </AccordionItem>
        <AccordionItem title="Posso cancelar um serviço agendado?">
          <p>Sim, você pode cancelar um serviço. No entanto, pedimos que o cancelamento seja feito com no mínimo 24 horas de antecedência para não prejudicar a agenda do profissional. Cancelamentos tardios podem estar sujeitos a taxas, dependendo da política de cada prestador.</p>
        </AccordionItem>
      </div>
    </div>
  );
}