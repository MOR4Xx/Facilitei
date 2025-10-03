import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Container, Flex, Grid } from '../components/layout/Layout';
// Supondo que você tenha um ícone de usuário

export function ExemploPage() {
  return (
    <Container className="py-12">
      <Typography as="h1" className="text-center mb-4">
        Nossos Componentes <span className="text-accent">Modernos</span>
      </Typography>
      <Typography as="p" className="text-center mb-12 max-w-2xl mx-auto">
        Estes são os blocos de construção da nossa interface, criados para serem bonitos, interativos e reutilizáveis.
      </Typography>

      <Grid className="grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <Typography as="h2" className="mb-6">Formulário de Contato</Typography>
          <Flex className="flex-col gap-6">
            <Input label="Seu melhor e-mail" type="email" />
            <Button variant="primary" size="md" className="w-full">
              Enviar Mensagem
            </Button>
          </Flex>
        </Card>

        <Card>
          <Typography as="h2" className="mb-4">Card de Ações</Typography>
          <Typography as="p" className="mb-6">
            Use cards para destacar informações importantes e guiar o usuário para as próximas ações.
          </Typography>
          <Flex className="gap-4">
            <Button variant="secondary" size="sm">Ação 1</Button>
            <Button variant="outline" size="sm">Ação 2</Button>
          </Flex>
        </Card>
      </Grid>
    </Container>
  );
}