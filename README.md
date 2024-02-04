# PROJETO

### 1. Visão Geral do Projeto

**Nome do Projeto:** E-Com Plus

**Objetivo:** Desenvolver uma plataforma de e-commerce simplificada que permita aos usuários listar produtos, fazer pedidos, acompanhar o status do envio, e receber notificações, integrando tecnologias modernas para automação de tarefas e mensageria. O projeto integrará Redis para gerenciamento de sessões e cache, RabbitMQ para o sistema de mensageria entre serviços, BullMQ para o agendamento e processamento de tarefas em background (como confirmação de pedidos, notificações de envio, etc.), Vue.js para a interface do usuário, Express.js como o servidor backend, Sequelize.js para ORM com PostgreSQL, e Puppeteer para geração de relatórios e comprovantes de compra em PDF.

### 2. Tecnologias Utilizadas

- **Frontend:** Vue.js
- **Backend:** Express.js
- **ORM:** Sequelize.js
- **Banco de Dados:** PostgreSQL
- **Sessões e Cache:** Redis
- **Sistema de Mensageria:** RabbitMQ
- **Filas de Tarefas em Background:** BullMQ
- **Automação de Tarefas:** Puppeteer

### 3. Estrutura do Projeto

#### Frontend (Vue.js)

- **Páginas:**
  - Página inicial com listagem de produtos
  - Página de detalhes do produto
  - Carrinho de compras
  - Checkout
  - Área do usuário (pedidos, configurações)
- **Componentes:**
  - Cabeçalho e rodapé
  - Lista de produtos
  - Cartão de produto
  - Formulário de pedido

#### Backend (Express.js)

- **Endpoints:**
  - Autenticação de usuários (`/auth/login`, `/auth/register`)
  - Gerenciamento de produtos (`/products`, `/products/:id`)
  - Gerenciamento de pedidos (`/orders`, `/orders/:id`)
  - Upload de imagens de produtos (`/upload`)
- **Modelos de Dados:**
  - Usuário (nome, email, senha)
  - Produto (nome, descrição, preço, imagem)
  - Pedido (itens, total, status, usuário)

#### Banco de Dados (PostgreSQL com Sequelize.js)

- **Esquemas:**
  - `Users`: Armazena informações dos usuários
  - `Products`: Detalhes dos produtos listados
  - `Orders`: Registra os pedidos feitos pelos usuários

#### Redis

- **Uso:**
  - Armazenamento de sessões de usuário
  - Cache de páginas e consultas frequentes

#### RabbitMQ e BullMQ

- **Filas:**
  - Notificações de pedidos (RabbitMQ)
  - Processamento de emails de confirmação (BullMQ)

#### Puppeteer

- **Automação:**
  - Geração de PDF para comprovantes de compra

#### **Funcionalidades Chave:**

- **Catálogo de Produtos:** Usuários podem navegar, adicionar produtos ao carrinho e realizar compras.
- **Gestão de Pedidos:** Desde a realização até a entrega, com atualizações automáticas de status via RabbitMQ.
- **Notificações:** Utilizar RabbitMQ e BullMQ para enviar notificações por email ou SMS sobre o status do pedido, promoções, ou mensagens importantes.
- **Relatórios e Comprovantes:** Geração automática de relatórios de vendas e comprovantes de compra em PDF com Puppeteer, disponíveis por email.
### 4. Documentação e Requisitos

#### Documentação Necessária

- **README.md:** Descrição do projeto, tecnologias utilizadas, como instalar e rodar o projeto.
- **API Documentation:** Documentação dos endpoints da API com exemplos de requisições e respostas.
#### Requisitos Funcionais (RF)

- **RF01: Autenticação de Usuários**
    - Os usuários devem poder se registrar e fazer login na plataforma.
    - Deve haver uma validação de entrada para os dados de registro e login.
    
- **RF02: Gestão de Produtos**
    - Os usuários com permissões de administração devem poder adicionar, editar e remover produtos.
    - Todos os usuários devem poder visualizar os produtos listados.
    
- **RF03: Carrinho de Compras**
    - Os usuários devem poder adicionar produtos ao carrinho de compras e visualizar o carrinho.
    - Deve ser possível alterar a quantidade ou remover itens do carrinho.
    
- **RF04: Realização de Pedidos**
    - Os usuários devem poder converter o carrinho de compras em um pedido.
    - O sistema deve gerar um resumo do pedido, incluindo itens, quantidades, total a pagar, e status do pedido.
    
- **RF05: Sistema de Mensageria**
    - Utilizar RabbitMQ para enviar notificações de atualização de status do pedido.
    - BullMQ deve ser usado para agendar e executar tarefas em background, como o envio de emails de confirmação.

- **RF06: Upload de Imagens**
    - Permitir o upload de imagens para os produtos.

- **RF07: Geração de PDF**
    - Utilizar Puppeteer para gerar comprovantes de compra.

#### Requisitos Não Funcionais (RNF)

- **RNF01: Performance**
    - O sistema deve ser capaz de suportar pelo menos 1000 usuários simultâneos sem degradação significativa de performance.
    - Todas as respostas da API devem ocorrer em menos de 500 ms.

- **RNF02: Segurança**
    - O sistema deve implementar medidas de segurança para proteção de dados dos usuários, incluindo criptografia de senhas e comunicação segura via HTTPS.
    - Deve haver proteção contra ataques comuns, como SQL Injection, Cross-Site Scripting (XSS), e Cross-Site Request Forgery (CSRF).

- **RNF03: Escalabilidade**
    - A arquitetura do sistema deve permitir escalabilidade horizontal, facilitando o aumento de capacidade por meio da adição de mais instâncias de aplicação ou banco de dados conforme necessário.

- **RNF04: Disponibilidade**
    - O sistema deve garantir uma disponibilidade de 99,9% com estratégias de redundância e failover implementadas.

- **RNF05: Usabilidade**
    - A interface do usuário deve ser intuitiva e fácil de usar, com tempos de carregamento rápidos e feedback visual claro para ações do usuário.

### 5. Ponto de Partida

Para começar, recomendo configurar o ambiente de desenvolvimento:

1. **Configuração do Ambiente:**
   - Instalar Node.js, Vue CLI, PostgreSQL, Redis, e RabbitMQ.
   - Configurar Sequelize.js para conectar com o PostgreSQL.
   - Criar um projeto Vue.js para o frontend.
   - Inicializar o servidor Express.js para o backend.

2. **Desenvolvimento Inicial:**
   - Implementar a autenticação de usuários no backend.
   - Criar as páginas iniciais no frontend (listagem de produtos e detalhes do produto).
   - Configurar Redis para sessões e cache.
   - Estabelecer a comunicação inicial entre o frontend e o backend.

3. **Iteração e Adição de Funcionalidades:**
   - Adicionar as funcionalidades de carrinho de compras e checkout.
   - Implementar o sistema de upload de imagens.
   - Integrar RabbitMQ e BullMQ para notificações e processamento de tarefas em background.


## FRONTEND


### Configuration
```
VITE_API_BASE_URL=
```

## Install
```
cd frontend
yarn
```

### Running
```
yarn dev
```

## BACKEND

### Configuration
```
PORT=
JWT_SECRET=

# DB
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=

# AMQP
AMQP_URL=

# REDIS
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_URL=
REDIS_SECRET=

# EMAIL
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

### Install
```
cd frontend
yarn
```

### Running Server
```
yarn dev
```

### Running Queue Server
```
yarn dev:amqp
```

### Running Queue Server
```
yarn dev:bull
```