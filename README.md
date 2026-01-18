# 🎂 Doce Gestão - Sistema 

Uma plataforma moderna para gestão de catálogos de confeitaria, permitindo que lojistas personalizem sua vitrine, gerenciem produtos e recebam pedidos via WhatsApp.

## 🚀 Funcionalidades

- **Painel Administrativo**: Gestão completa de produtos (CRUD).
- **Personalização de Branding**: Alteração de cores, banner, logo e bio em tempo real.
- **Catálogo Público Dinâmico**: Vitrine otimizada para dispositivos móveis com visualização de preços.
- **Integração WhatsApp**: Botão flutuante para pedidos diretos com o lojista.
- **Sistema de Trial**: Gerenciamento de 15 dias de teste gratuito para novos usuários.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React + TypeScript** (Vite)
- **Tailwind CSS** (Estilização)
- **shadcn/ui** (Componentes de interface)
- **TanStack Query (v5)** (Gerenciamento de estado e cache)
- **Lucide React** (Ícones)

### Backend & Infraestrutura
- **Supabase**: 
  - **Auth**: Autenticação de usuários.
  - **PostgreSQL**: Banco de dados relacional.
  - **Storage**: Armazenamento de imagens do catálogo e banners.
  - **Edge Functions & RPC**: Lógica de banco de dados segura.

## 💻 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- Conta no [Supabase](https://supabase.com/)

### Instalação
1. Clone o repositório:
   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd docegestao

   Instale as dependências:

Bash

npm install
Configure as variáveis de ambiente: Crie um arquivo .env na raiz e adicione suas chaves do Supabase:

Snippet de código

VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
Inicie o servidor de desenvolvimento:

Bash

npm run dev
🏗️ Estrutura de Banco de Dados (RPC)
O projeto utiliza funções RPC para garantir que o catálogo público seja acessível sem expor dados sensíveis do usuário:

get_public_catalog_profile: Retorna dados de branding da loja.

get_public_catalog_items: Retorna a lista de produtos ativos.

Desenvolvido por [Wdenberg Ramos]


---

