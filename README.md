# Facilitei 🚀

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

## 📝 Descrição do Sistema

O **Facilitei** é uma plataforma desenvolvida para simplificar a contratação de prestadores de serviços, abrangendo desde reformas (pedreiros) até manutenções técnicas (como instalação de ar-condicionado). O sistema soluciona a dificuldade de encontrar mão de obra qualificada, permitindo que o usuário escolha o profissional ideal através de uma interface intuitiva, validada por avaliações da comunidade e portfólio de fotos dos trabalhos realizados.

### Funcionalidades Principais
* **Cadastro de Usuarios**
* **Cadastro de Trabalhador** 
* **Login**
* **Criação de serviços** 
* **Solicitação de Serviços**
* **Avaliação de Serviços** 
* **Avaliação de Cliente**
* **Chat entre Trabalhador e Cliente** 

---

## 🛠 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

### Back-end (Facilitei-Api)
* **Linguagem:** Java 17+
* **Framework:** Spring Boot
* **Build:** Maven

### Front-end (Facilitei-Front)
* **Linguagem:** TypeScript
* **Framework:** React (via Vite)

### Banco de Dados
* **MySQL (Dados)**
* **Claudinary (Imagens)**

### Infraestrutura & Ferramentas:
* Docker & Docker Compose
* Git & GitHub
* Swagger (para documentação da API)

---

## 📂 Estrutura de Diretórios

A estrutura do projeto segue o padrão MVC/Clean Architecture sugerido pelo Spring Boot:

```text
Facilitei/
├── docker-compose.yml          # Orquestrador dos containers (App + Banco)
│
├── Facilitei-Api/              # 🟢 BACK-END (Spring Boot)
│   ├── .mvn/wrapper/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/psg/facilitei/
│   │   │   │   ├── Config/              # Configurações globais
│   │   │   │   ├── Controller/          # Endpoints da API
│   │   │   │   ├── DTO/                 # Data Transfer Objects
│   │   │   │   ├── Entity/              # Entidades do Banco
│   │   │   │   ├── Exceptions/          # Tratamento de Erros
│   │   │   │   ├── Repository/          # Camada de Dados
│   │   │   │   ├── Services/            # Regras de Negócio
│   │   │   │   └── FaciliteiApplication.java
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       └── application.properties
│   │   └── test/java/psg/facilitei/
│   │       └── FaciliteiApplicationTests.java
│   ├── .gitattributes
│   ├── .gitignore
│   ├── Dockerfile
│   ├── mvnw & mvnw.cmd
│   ├── pom.xml
│   └── README.md
│
└── Facilitei-Front/            # 🔵 FRONT-END (React + Vite)
    ├── public/
    ├── src/
    │   ├── assets/             # Imagens e Estilos globais
    │   ├── components/         # Componentes Reutilizáveis
    │   ├── lib/                # Configurações de bibliotecas
    │   ├── pages/              # Telas da Aplicação
    │   ├── routes/             # Configuração de Rotas
    │   ├── store/              # Gerenciamento de Estado
    │   ├── types/              # Tipagem TypeScript
    │   ├── App.tsx
    │   └── main.tsx
    ├── .gitignore
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🌿 Estrutura de Branches

O repositório utiliza uma estratégia de branches para organizar o desenvolvimento do Monorepo e dos módulos isolados:

* **`main` (Default):** Branch principal de integração. Contém o projeto completo (**Monorepo**), unificando o Back-end, o Front-end e a infraestrutura de containers (`docker-compose.yml`). É a versão estável para rodar o sistema inteiro.
* **`api-rest`:** Branch dedicada exclusivamente ao desenvolvimento do **Back-end** (Java/Spring Boot).
* **`frontend-branch`:** Branch dedicada exclusivamente ao desenvolvimento do **Front-end** (React/TypeScript).

> **Dica:** Para alternar entre as branches, utilize o comando:
> `git checkout <nome-da-branch>`

---

## 🚀 Instruções de Execução

### Pré-requisitos
  * Node.js e NPM
  * Java JDK 22
  * Docker (Opcional)

### Passo a Passo
#### 1. Clonar o Repositório
```Bash

git clone https://github.com/MOR4Xx/Facilitei.git
cd Facilitei
```

#### 2. Executar com Docker (Recomendado)

Para subir o banco de dados, API e Front-end simultaneamente:

```Bash
docker-compose up --build
```
* Front-end: http://localhost:5173

* API: http://localhost:8080

#### 3. Execução Manual (Desenvolvimento)

**Terminal 1 - Back-end:**

```Bash
cd Facilitei-Api
./mvnw spring-boot:run
```

**Terminal 2 - Front-end:**

```Bash
cd Facilitei-Front
npm install
npm run dev
```

---

## 👥 Contribuições da Equipe

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ArthurEstrela">
        <img src="https://github.com/ArthurEstrela.png" width="100px;" alt="Foto do Arthur"/><br>
        <sub>
          <p>Arthur</p>
          <b>Função: Back-End, Front-End e Documentação</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MOR4Xx">
        <img src="https://github.com/MOR4Xx.png" width="100px;" alt="Foto do Jorge"/><br>
        <sub>
          <p>Jorge Afonso</p>
          <b>Função: Back-End, Banco de Dados, Infraestrutura Docker e Documentação</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/LDRRosa">
        <img src="https://github.com/LDRRosa.png" width="100px;" alt="Foto do Leandro"/><br>
        <sub>
          <p>Leandro</p>
          <b>Função: Back-End, Banco de Dados e Documentação</b>
        </sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/PedroR07">
        <img src="https://github.com/PedroR07.png" width="100px;" alt="Foto do Pedro"/><br>
        <sub>
          <p>Pedro Cesar</p>
          <b>Função: Back-End</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ricardoissadesousa">
        <img src="https://github.com/ricardoissadesousa.png" width="100px;" alt="Foto do Ricardo"/><br>
        <sub>
          <p>Ricardo</p>
          <b>Contribuição: Back-End, Front-End e Documentação</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/savioissa21">
        <img src="https://github.com/savioissa21.png" width="100px;" alt="Foto do Savio"/><br>
        <sub>
          <p>Savio</p>
          <b>Função: Back-End, Front-End e Documentação</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
