# 🚀 Facilitei - Plataforma de Serviços Locais

**Facilitei** é uma aplicação web moderna construída com React, projetada para ser a ponte definitiva entre clientes que necessitam de serviços locais e profissionais qualificados (trabalhadores) que buscam oportunidades.

A plataforma oferece um ecossistema completo onde clientes podem encontrar, filtrar e contratar prestadores de serviço com segurança, enquanto os profissionais gerenciam suas solicitações, perfis e agenda de forma eficiente.

## 📜 Descrição do Sistema

O Facilitei é um marketplace de duas vias:

  * **Para Clientes:** Permite que usuários se cadastrem, busquem profissionais por diversas categorias (Construção, Serviços Domésticos, Técnicos, etc.), filtrem por localização e nota, visualizem perfis detalhados e solicitem serviços. Após a conclusão, os clientes podem aprovar o serviço e avaliar o profissional, garantindo um sistema de reputação transparente.
  * **Para Trabalhadores:** Profissionais podem se cadastrar, definir os serviços que oferecem, gerenciar um perfil público, receber e gerenciar solicitações de novos serviços (aceitando ou recusando), e também avaliar os clientes após a conclusão do trabalho.

A plataforma inclui dashboards dedicados para cada tipo de usuário, um sistema de autenticação, gerenciamento de estado global com Zustand e um chat em tempo real (via StompJS/WebSockets) para facilitar a comunicação sobre serviços em andamento.

## ✨ Features Principais

  * **Autenticação e Perfis:** Sistema de cadastro e login para Clientes e Trabalhadores.
  * **Busca e Filtragem:** Página dedicada (`/dashboard/solicitar`) para filtrar profissionais por categoria, serviço específico, nome, localização (cidade/UF) e nota mínima.
  * **Dashboard do Cliente:** Visualiza serviços ativos, aprova finalizações, contesta e avalia serviços concluídos.
  * **Dashboard do Trabalhador:** Recebe e gerencia novas solicitações (aceitar/recusar), acompanha serviços em andamento e avalia clientes.
  * **Sistema de Avaliação Mútuo:** Clientes avaliam trabalhadores (impactando a nota do perfil) e trabalhadores avaliam clientes.
  * **Gerenciamento de Serviços:** Fluxo de status completo (`PENDENTE`, `EM_ANDAMENTO`, `PENDENTE_APROVACAO`, `FINALIZADO`, `CANCELADO`).
  * **Chat em Tempo Real:** Comunicação direta entre cliente e trabalhador para serviços ativos (`/dashboard/chat/:servicoId`).
  * **Design Responsivo:** Interface adaptável para dispositivos móveis e desktop, com animações fluidas (Framer Motion).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com um ecossistema moderno de front-end:

  * **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
  * **Roteamento:** [React Router DOM](https://reactrouter.com/) (v7)
  * **Estilização:** [TailwindCSS](https://tailwindcss.com/)
  * **Gerenciamento de Estado:**
      * [Zustand](https://zustand-demo.pmnd.rs/): Para estado global (autenticação do usuário).
      * [TanStack Query](https://tanstack.com/query/latest): Para gerenciamento de estado do servidor (fetching, caching, e mutações de API).
  * **Animações:** [Framer Motion](https://www.framer.com/motion/)
  * **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (para validação de schema).
  * **Notificações:** [React Hot Toast](https://react-hot-toast.com/)
  * **Comunicação Real-time:** [@stomp/stompjs](https://stomp-js.github.io/) (para o chat WebSocket).
  * **Mock API:** [JSON Server](https://github.com/typicode/json-server) (para simular o backend).

## ⚙️ Instruções de Execução

Para rodar este projeto localmente, você precisará de dois terminais: um para o mock server (backend) e outro para a aplicação React (frontend).

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (v18 ou superior)
  * [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### 1\. Clonar o Repositório

```bash
git clone <url-do-seu-repositorio>
cd facilitei-react
```

### 2\. Instalar as Dependências

```bash
npm install
```

### 3\. Iniciar o Mock Server (Backend)

O `json-server` irá simular a API REST usando o arquivo `db.json`.

```bash
# Terminal 1
npm run server
```

O servidor estará rodando em `http://localhost:3333`.

### 4\. Iniciar a Aplicação React (Frontend)

```bash
# Terminal 2
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 📂 Estrutura de Diretórios (Simplificada)

A arquitetura do projeto está organizada da seguinte forma:

```
facilitei-react/
├── public/
│   └── avatars/         # Imagens de perfil mockadas
├── src/
│   ├── components/
│   │   ├── layout/      # Componentes de layout (Header, Footer, MainLayout)
│   │   └── ui/          # Componentes de UI reutilizáveis (Button, Card, Input, Modal, etc.)
│   ├── lib/
│   │   └── variants.ts  # Variantes de animação (Framer Motion)
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── DashboardClientePage.tsx
│   │   ├── DashboardTrabalhadorPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── SettingsRootPage.tsx
│   │   ├── SolicitarServicoPage.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── ProtectedRoute.tsx # Rota protegida por autenticação
│   │   └── index.tsx        # Configuração principal do React Router
│   ├── store/
│   │   └── useAuthStore.ts  # Store global de autenticação (Zustand)
│   ├── types/
│   │   └── api.ts           # Definições de tipos (TypeScript)
│   ├── main.tsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais (Tailwind)
├── db.json                  # Banco de dados mock para o JSON Server
├── package.json
└── tailwind.config.js
```

## 🤝 Contribuições da Equipe

Este projeto foi o resultado de um esforço colaborativo de toda a equipe. Todos os membros participaram ativamente das discussões, planejamento e desenvolvimento das funcionalidades.

  * **Arthur**
  * **Sávio**
  * **Ricardo**
  * **Pedro**
  * **Jorge**
  * **Leandro**
