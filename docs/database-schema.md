# Schema do Banco de Dados - Gestão Doce

**Última atualização:** Janeiro 2026

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Enums](#enums)
3. [Tabelas](#tabelas)
4. [Políticas RLS](#políticas-rls)
5. [Funções do Banco](#funções-do-banco)
6. [Triggers](#triggers)
7. [Storage Buckets](#storage-buckets)
8. [Diagrama ER](#diagrama-er)

---

## Visão Geral

O sistema **Gestão Doce** é uma plataforma SaaS para confeiteiras gerenciarem suas receitas, precificação, vendas, clientes e catálogo online. O banco de dados utiliza PostgreSQL via Supabase com Row Level Security (RLS) habilitado em todas as tabelas.

### Principais Entidades

- **Usuários e Perfis**: Gerenciamento de contas e configurações
- **Receitas e Ingredientes**: Cálculo de custos e precificação
- **Vendas e Clientes**: Controle de pedidos e relacionamento
- **Catálogo**: Vitrine online de produtos
- **Financeiro**: Controle de despesas e fluxo de caixa

---

## Enums

### `app_role`
Roles de usuário no sistema.
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'confectioner');
```
| Valor | Descrição |
|-------|-----------|
| `admin` | Administrador do sistema |
| `confectioner` | Confeiteira (usuário padrão) |

### `client_status`
Status do cliente.
```sql
CREATE TYPE public.client_status AS ENUM ('active', 'inactive', 'pending');
```
| Valor | Descrição |
|-------|-----------|
| `active` | Cliente ativo |
| `inactive` | Cliente inativo |
| `pending` | Cliente pendente |

### `delivery_status`
Status de entrega do pedido.
```sql
CREATE TYPE public.delivery_status AS ENUM ('pending', 'in_production', 'ready', 'delivered', 'cancelled');
```
| Valor | Descrição |
|-------|-----------|
| `pending` | Pendente |
| `in_production` | Em produção |
| `ready` | Pronto para entrega |
| `delivered` | Entregue |
| `cancelled` | Cancelado |

### `payment_method`
Métodos de pagamento aceitos.
```sql
CREATE TYPE public.payment_method AS ENUM ('pix', 'cash', 'credit_card', 'debit_card', 'bank_transfer');
```
| Valor | Descrição |
|-------|-----------|
| `pix` | PIX |
| `cash` | Dinheiro |
| `credit_card` | Cartão de crédito |
| `debit_card` | Cartão de débito |
| `bank_transfer` | Transferência bancária |

### `subscription_status`
Status da assinatura do usuário.
```sql
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'cancelled', 'expired');
```
| Valor | Descrição |
|-------|-----------|
| `trial` | Período de teste (15 dias) |
| `active` | Assinatura ativa |
| `cancelled` | Assinatura cancelada |
| `expired` | Assinatura expirada |

---

## Tabelas

### `profiles`
Perfil do usuário com configurações pessoais e do catálogo.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Referência ao auth.users |
| `full_name` | text | Não | - | Nome completo |
| `business_name` | text | Sim | - | Nome do negócio |
| `phone` | text | Sim | - | Telefone |
| `avatar_url` | text | Sim | - | URL da foto de perfil |
| `trial_ends_at` | timestamptz | Sim | `now() + '15 days'` | Data fim do trial |
| `subscription_status` | subscription_status | Sim | `'trial'` | Status da assinatura |
| `catalog_logo_url` | text | Sim | - | Logo do catálogo |
| `catalog_banner_url` | text | Sim | - | Banner do catálogo |
| `catalog_primary_color` | text | Sim | `'#EC4899'` | Cor primária |
| `catalog_secondary_color` | text | Sim | `'#F472B6'` | Cor secundária |
| `catalog_background_color` | text | Sim | `'#FFFFFF'` | Cor de fundo |
| `catalog_text_color` | text | Sim | `'#1F2937'` | Cor do texto |
| `catalog_show_prices` | boolean | Sim | `true` | Mostrar preços no catálogo |
| `catalog_whatsapp` | text | Sim | - | WhatsApp para contato |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `user_roles`
Roles atribuídas aos usuários.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Referência ao auth.users |
| `role` | app_role | Não | `'confectioner'` | Role do usuário |
| `created_at` | timestamptz | Não | `now()` | Data de criação |

---

### `clients`
Clientes cadastrados pelo usuário.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono do cliente |
| `name` | text | Não | - | Nome do cliente |
| `email` | text | Sim | - | E-mail |
| `phone` | text | Sim | - | Telefone |
| `address` | text | Sim | - | Endereço |
| `notes` | text | Sim | - | Observações |
| `status` | client_status | Não | `'active'` | Status |
| `total_orders` | integer | Não | `0` | Total de pedidos |
| `total_spent` | numeric | Não | `0` | Total gasto |
| `last_order_at` | timestamptz | Sim | - | Último pedido |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `ingredients`
Ingredientes cadastrados para uso nas receitas.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono do ingrediente |
| `name` | text | Não | - | Nome do ingrediente |
| `unit` | text | Não | `'g'` | Unidade de uso |
| `package_price` | numeric | Não | `0` | Preço da embalagem |
| `package_size` | numeric | Não | `1000` | Tamanho da embalagem |
| `package_unit` | text | Não | `'g'` | Unidade da embalagem |
| `category` | text | Sim | - | Categoria |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `recipes`
Receitas com cálculo de custos e precificação.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono da receita |
| `name` | text | Não | - | Nome da receita |
| `description` | text | Sim | - | Descrição |
| `image_url` | text | Sim | - | URL da imagem |
| `yield_amount` | numeric | Não | `1` | Quantidade de rendimento |
| `yield_unit` | text | Não | `'unidade'` | Unidade de rendimento |
| `category` | text | Sim | - | Categoria |
| `is_active` | boolean | Não | `true` | Receita ativa |
| `profit_margin` | numeric | Não | `45` | Margem de lucro (%) |
| `labor_cost` | numeric | Sim | `0` | Custo de mão de obra |
| `energy_cost` | numeric | Sim | `0` | Custo de energia |
| `packaging_cost` | numeric | Sim | `0` | Custo de embalagem |
| `transport_cost` | numeric | Sim | `0` | Custo de transporte |
| `ingredients_cost` | numeric | Sim | `0` | Custo de ingredientes |
| `production_cost` | numeric | Sim | `0` | Custo de produção total |
| `suggested_price` | numeric | Sim | `0` | Preço sugerido |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `recipe_items`
Ingredientes de uma receita.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `recipe_id` | uuid | Não | - | Receita relacionada |
| `ingredient_id` | uuid | Sim | - | Ingrediente (opcional) |
| `ingredient_name` | text | Não | - | Nome do ingrediente |
| `quantity` | numeric | Não | `0` | Quantidade usada |
| `unit` | text | Não | `'g'` | Unidade de uso |
| `package_price` | numeric | Não | `0` | Preço da embalagem |
| `package_size` | numeric | Não | `1000` | Tamanho da embalagem |
| `package_unit` | text | Não | `'g'` | Unidade da embalagem |
| `calculated_cost` | numeric | Não | `0` | Custo calculado |
| `created_at` | timestamptz | Não | `now()` | Data de criação |

---

### `catalog_items`
Itens do catálogo público.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono do item |
| `name` | text | Não | - | Nome do produto |
| `description` | text | Sim | - | Descrição |
| `price` | numeric | Sim | - | Preço |
| `image_url` | text | Sim | - | URL da imagem |
| `category` | text | Sim | `'Bolos'` | Categoria |
| `display_order` | integer | Não | `0` | Ordem de exibição |
| `is_active` | boolean | Não | `true` | Item ativo |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `sales`
Vendas realizadas.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Vendedor |
| `client_id` | uuid | Sim | - | Cliente (opcional) |
| `sale_date` | timestamptz | Não | `now()` | Data da venda |
| `delivery_date` | timestamptz | Sim | - | Data de entrega |
| `delivery_status` | delivery_status | Não | `'pending'` | Status da entrega |
| `payment_method` | payment_method | Não | `'pix'` | Método de pagamento |
| `subtotal` | numeric | Não | `0` | Subtotal |
| `discount` | numeric | Não | `0` | Desconto |
| `total_amount` | numeric | Não | `0` | Total |
| `notes` | text | Sim | - | Observações |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `sale_items`
Itens de uma venda.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `sale_id` | uuid | Não | - | Venda relacionada |
| `recipe_id` | uuid | Sim | - | Receita (opcional) |
| `product_name` | text | Não | - | Nome do produto |
| `quantity` | numeric | Não | `1` | Quantidade |
| `unit_price` | numeric | Não | `0` | Preço unitário |
| `total_price` | numeric | Não | `0` | Preço total |
| `created_at` | timestamptz | Não | `now()` | Data de criação |

---

### `expenses`
Despesas registradas.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono da despesa |
| `expense_date` | date | Não | `CURRENT_DATE` | Data da despesa |
| `category` | text | Não | `'Outros'` | Categoria |
| `description` | text | Não | - | Descrição |
| `amount` | numeric | Não | `0` | Valor |
| `payment_method` | payment_method | Não | `'pix'` | Método de pagamento |
| `notes` | text | Sim | - | Observações |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

### `shopping_list`
Lista de compras.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | Não | `gen_random_uuid()` | ID único |
| `user_id` | uuid | Não | - | Dono da lista |
| `name` | text | Não | - | Nome do item |
| `quantity` | text | Sim | - | Quantidade |
| `estimated_price` | numeric | Sim | `0` | Preço estimado |
| `category` | text | Não | `'Geral'` | Categoria |
| `is_checked` | boolean | Não | `false` | Item marcado |
| `created_at` | timestamptz | Não | `now()` | Data de criação |
| `updated_at` | timestamptz | Não | `now()` | Data de atualização |

---

## Políticas RLS

Todas as tabelas possuem RLS habilitado. Resumo das políticas:

### Tabelas de Usuário (profiles, clients, ingredients, recipes, catalog_items, sales, expenses, shopping_list)

| Operação | Política |
|----------|----------|
| SELECT | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |

### Tabelas Relacionadas (recipe_items, sale_items)

| Operação | Política |
|----------|----------|
| SELECT | Subquery verifica se o registro pai pertence ao usuário |
| INSERT | Subquery verifica se o registro pai pertence ao usuário |
| UPDATE | Subquery verifica se o registro pai pertence ao usuário |
| DELETE | Subquery verifica se o registro pai pertence ao usuário |

### user_roles

| Operação | Política |
|----------|----------|
| SELECT | `auth.uid() = user_id` |
| INSERT | `has_role(auth.uid(), 'admin')` |
| UPDATE | `has_role(auth.uid(), 'admin')` |
| DELETE | `has_role(auth.uid(), 'admin')` |

### profiles (políticas adicionais para admin)

| Operação | Política |
|----------|----------|
| SELECT (admin) | `has_role(auth.uid(), 'admin')` |
| UPDATE (admin) | `has_role(auth.uid(), 'admin')` |

---

## Funções do Banco

### `get_public_catalog_items(p_user_id uuid)`
Retorna itens ativos do catálogo de um usuário (para acesso público).

```sql
CREATE OR REPLACE FUNCTION public.get_public_catalog_items(p_user_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  description text, 
  price numeric, 
  image_url text, 
  category text, 
  display_order integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ci.id, ci.name, ci.description, ci.price, ci.image_url, ci.category, ci.display_order
  FROM public.catalog_items ci
  WHERE ci.user_id = p_user_id AND ci.is_active = true
  ORDER BY ci.display_order ASC;
$$;
```

---

### `get_public_catalog_profile(p_user_id uuid)`
Retorna configurações públicas do catálogo de um usuário.

```sql
CREATE OR REPLACE FUNCTION public.get_public_catalog_profile(p_user_id uuid)
RETURNS TABLE(
  business_name text, 
  catalog_logo_url text, 
  catalog_banner_url text, 
  catalog_primary_color text, 
  catalog_secondary_color text, 
  catalog_background_color text, 
  catalog_text_color text, 
  catalog_show_prices boolean, 
  catalog_whatsapp text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.business_name, p.catalog_logo_url, p.catalog_banner_url, 
         p.catalog_primary_color, p.catalog_secondary_color, 
         p.catalog_background_color, p.catalog_text_color, 
         p.catalog_show_prices, p.catalog_whatsapp
  FROM public.profiles p
  WHERE p.user_id = p_user_id
  LIMIT 1;
$$;
```

---

### `has_role(_user_id uuid, _role app_role)`
Verifica se um usuário possui determinada role.

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

---

### `handle_new_user()`
Trigger function executada ao criar novo usuário.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Criar perfil do usuário com trial de 15 dias
  INSERT INTO public.profiles (user_id, full_name, trial_ends_at, subscription_status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    now() + interval '15 days',
    'trial'
  );
  
  -- Atribuir role de confeiteira por padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'confectioner');
  
  RETURN NEW;
END;
$$;
```

---

### `update_updated_at_column()`
Trigger function para atualizar timestamp.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

## Triggers

### `on_auth_user_created`
Executado após inserção em `auth.users`.

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Storage Buckets

### `avatars`
- **Público:** Sim
- **Uso:** Fotos de perfil dos usuários

### `catalog`
- **Público:** Sim
- **Uso:** Imagens do catálogo (logo, banner, produtos)

---

## Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │   user_roles    │
│─────────────────│       │─────────────────│
│ id (PK)         │◄──────│ user_id (FK)    │
│ email           │       │ role            │
│ ...             │       │ created_at      │
└────────┬────────┘       └─────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
│─────────────────│
│ id (PK)         │
│ user_id (FK)    │
│ full_name       │
│ business_name   │
│ avatar_url      │
│ catalog_*       │
│ subscription_*  │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    clients      │       │   ingredients   │       │ catalog_items   │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │       │ user_id (FK)    │
│ name            │       │ name            │       │ name            │
│ email, phone    │       │ package_price   │       │ price           │
│ total_orders    │       │ package_size    │       │ image_url       │
│ total_spent     │       │ unit            │       │ category        │
└────────┬────────┘       └─────────────────┘       └─────────────────┘
         │
         │ 1:N (client_id)
         ▼
┌─────────────────┐       ┌─────────────────┐
│     sales       │       │    recipes      │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ client_id (FK)  │       │ name            │
│ sale_date       │       │ yield_amount    │
│ delivery_date   │       │ profit_margin   │
│ payment_method  │       │ *_cost          │
│ total_amount    │       │ suggested_price │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ 1:N                     │ 1:N
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   sale_items    │       │  recipe_items   │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ sale_id (FK)    │       │ recipe_id (FK)  │
│ recipe_id (FK)  │       │ ingredient_id   │
│ product_name    │       │ ingredient_name │
│ quantity        │       │ quantity        │
│ unit_price      │       │ calculated_cost │
│ total_price     │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    expenses     │       │  shopping_list  │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ expense_date    │       │ name            │
│ category        │       │ quantity        │
│ amount          │       │ estimated_price │
│ payment_method  │       │ is_checked      │
└─────────────────┘       └─────────────────┘
```

---

## Considerações de Segurança

1. **RLS Habilitado**: Todas as tabelas possuem Row Level Security ativado
2. **Isolamento de Dados**: Usuários só acessam seus próprios dados
3. **Roles Separadas**: Roles armazenadas em tabela separada (não no profile)
4. **Security Definer**: Funções críticas usam `SECURITY DEFINER` para evitar recursão
5. **Catálogo Público**: Funções específicas permitem acesso público controlado

---

## Histórico de Alterações

| Data | Descrição |
|------|-----------|
| Jan 2026 | Documentação inicial do schema completo |
