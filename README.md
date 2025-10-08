# Bytebank - Tech Challenge #3

Bem-vindo ao projeto de estudo **Bytebank**, um aplicativo moderno desenvolvido em **React Native**. Para garantir uma estrutura flexível, escalável e organizada, o projeto foi criado utilizando o **Expo** (https://docs.expo.dev/).

---

## 🚀 Começando

Estas instruções vão te ajudar a rodar o projeto localmente e explorar as funcionalidades que implementamos neste projeto, que são elas:

- Possibilidade de criar um novo usuário e logar na aplicação com **autenticação**;
- Criar uma transação registrada;
- Visualizar o saldo total;
- Criar categorias;
- Criar, visualizar, editar bloquear cartões vinculados a sua conta;

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/).

---

## 🛠️ Instalação

Clone este repositório:

```bash
git clone https://github.com/Dimitri13Freitas/tech-challenge-3.git
cd tech-challenge-3
```

Instale todas as dependências:

```bash
npm install
```

## 🚀 Como Executar

### Rodar o projeto

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm start
```

## Rodar a API

Para iniciar a API, é necessário clonar nosso outro repositório do [Bytebank API](https://github.com/TechChallengeJourney/bytebank-api) e rodar os comandos:

```bash
docker-compose build
docker-compose up
```

## 🛠️ Arquitetura de Infraestrutura

### Backend: API
Para o backend do Bytebank, optamos por utilizar a **AWS (Amazon Web Services)** como provedor de nuvem, especificamente os serviços **ECR (Elastic Container Registry)** e **ECS (Elastic Container Service)**.

### Frontend: Aplicação Principal e Microfrontends
Para a aplicação principal e seus microfrontends, adotamos a plataforma Vercel.

- [Aplicação Principal](https://bytebank-demo.vercel.app/)
- [Microfrontend - Widgets de Investimentos](https://bytebank-investments.vercel.app/)
- [Microfrontend - Transações](https://bytebank-transactions.vercel.app/)
- [Blog do Bytebank](https://bytebank-blog.vercel.app/)


## Links Úteis

- [React](https://react.dev/reference/react)
- [Material MUI](https://mui.com/material-ui/all-components/)
- [Module Federation](https://module-federation.io/practice/frameworks/react/index.html)
- [Rsbuild](https://rsbuild.rs)
- [Storybook](https://storybook.js.org/docs)
- [TurboRepo](https://turborepo.com/docs)
- [Astro](https://docs.astro.build/en/basics/astro-components)