# Bytebank - Tech Challenge #3

Bem-vindo ao projeto de estudo **Bytebank**, um aplicativo moderno desenvolvido em **React Native** (https://reactnative.dev/). Para garantir uma estrutura flexível, escalável e organizada, o projeto foi criado utilizando o **Expo** (https://docs.expo.dev/) e para a interface usei **React-Native-Paper** (https://reactnativepaper.com/).

---

## 🚀 Começando

### Arquitetura 🧱

Este projeto foi estruturado seguindo os princípios da **Clean Architecture**, com foco em:

- Separação clara de responsabilidades
- Baixo acoplamento entre camadas
- Alta testabilidade e escalabilidade

A aplicação é dividida em três camadas principais:

- **Presentation**: Telas, componentes e hooks de UI
- **Domain**: Regras de negócio, entidades e casos de uso
- **Infrastructure**: Integrações externas (Firebase, APIs, storage)

---

### Funcionalidades Implementadas ✅

Estas instruções vão te ajudar a rodar o projeto localmente e explorar as funcionalidades que implementamos neste projeto, que são elas:

- Login e cadastro de usuário
- Adição/Edição/Remoção e visualização transações (despesa/receita)
- Criação/Edição/Remoção e visualização de categorias
- Adição/Remoção/Edição e visualização de cartões
- Filtros avançados para visulização de transações
- Visualizar saldo geral 
- Visualização de gráficos e resumos por competência mensal

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
Após isso pegue o arquivo .env no credentials.zip e coloque-o na raiz do projeto

## 🚀 Como Executar

### Rodar o projeto

Certifique-se que você tem o aplicativo **Expo Go** (https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR) instalado em seu celular.

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm start
```

- Isso abrirá o Expo Dev Tools no navegador.
- Use o QR Code para testar no celular com Expo Go, ou rode em um emulador.

## Links Úteis

- [React](https://react.dev/reference/react)
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Firebase](https://firebase.google.com/)
- [React Native Paper](https://reactnativepaper.com/)