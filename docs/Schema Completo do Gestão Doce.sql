-- ============================================
-- SCHEMA COMPLETO DO GESTÃO DOCE
-- Sistema de Gestão para Confeitarias
-- ============================================
-- Versão: 1.0
-- Data: 2026-01-14
-- Banco de Dados: PostgreSQL (Supabase)
-- ============================================

-- ============================================
-- 1. TIPOS ENUMERADOS (ENUMS)
-- ============================================

-- Roles de usuário no sistema
CREATE TYPE public.app_role AS ENUM ('admin', 'confectioner');

-- Status do cliente
CREATE TYPE public.client_status AS ENUM ('active', 'inactive', 'pending');

-- Status de entrega do pedido
CREATE TYPE public.delivery_status AS ENUM ('pending', 'in_production', 'ready', 'delivered', 'cancelled');

-- Métodos de pagamento aceitos
CREATE TYPE public.payment_method AS ENUM ('pix', 'cash', 'credit_card', 'debit_card', 'bank_transfer');

-- Status da assinatura do usuário
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'cancelled', 'expired');

-- ============================================
-- 2. TABELAS
-- ============================================

-- --------------------------------------------
-- 2.1 PROFILES - Perfis dos usuários
-- --------------------------------------------
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Configurações do Catálogo
    catalog_logo_url TEXT,
    catalog_banner_url TEXT,
    catalog_primary_color TEXT DEFAULT '#EC4899',
    catalog_secondary_color TEXT DEFAULT '#F472B6',
    catalog_background_color TEXT DEFAULT '#FFFFFF',
    catalog_text_color TEXT DEFAULT '#1F2937',
    catalog_show_prices BOOLEAN DEFAULT true,
    catalog_whatsapp TEXT,
    
    -- Assinatura e Trial
    subscription_status public.subscription_status DEFAULT 'trial',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '15 days'),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.2 USER_ROLES - Roles dos usuários
-- --------------------------------------------
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role public.app_role NOT NULL DEFAULT 'confectioner',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.3 CLIENTS - Clientes
-- --------------------------------------------
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    status public.client_status NOT NULL DEFAULT 'active',
    
    -- Estatísticas
    total_orders INTEGER NOT NULL DEFAULT 0,
    total_spent NUMERIC NOT NULL DEFAULT 0,
    last_order_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.4 INGREDIENTS - Ingredientes
-- --------------------------------------------
CREATE TABLE public.ingredients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'g',
    package_price NUMERIC NOT NULL DEFAULT 0,
    package_size NUMERIC NOT NULL DEFAULT 1000,
    package_unit TEXT NOT NULL DEFAULT 'g',
    category TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.5 RECIPES - Receitas
-- --------------------------------------------
CREATE TABLE public.recipes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Rendimento
    yield_amount NUMERIC NOT NULL DEFAULT 1,
    yield_unit TEXT NOT NULL DEFAULT 'unidade',
    
    -- Custos
    ingredients_cost NUMERIC DEFAULT 0,
    labor_cost NUMERIC DEFAULT 0,
    energy_cost NUMERIC DEFAULT 0,
    packaging_cost NUMERIC DEFAULT 0,
    transport_cost NUMERIC DEFAULT 0,
    production_cost NUMERIC DEFAULT 0,
    
    -- Precificação
    profit_margin NUMERIC NOT NULL DEFAULT 45,
    suggested_price NUMERIC DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.6 RECIPE_ITEMS - Itens das receitas
-- --------------------------------------------
CREATE TABLE public.recipe_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE SET NULL,
    ingredient_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'g',
    package_price NUMERIC NOT NULL DEFAULT 0,
    package_size NUMERIC NOT NULL DEFAULT 1000,
    package_unit TEXT NOT NULL DEFAULT 'g',
    calculated_cost NUMERIC NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.recipe_items ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.7 CATALOG_ITEMS - Itens do catálogo
-- --------------------------------------------
CREATE TABLE public.catalog_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    image_url TEXT,
    category TEXT DEFAULT 'Bolos',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.8 SALES - Vendas
-- --------------------------------------------
CREATE TABLE public.sales (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    
    -- Datas
    sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    delivery_date TIMESTAMP WITH TIME ZONE,
    
    -- Status e Pagamento
    payment_method public.payment_method NOT NULL DEFAULT 'pix',
    delivery_status public.delivery_status NOT NULL DEFAULT 'pending',
    
    -- Valores
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    
    -- Observações
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.9 SALE_ITEMS - Itens das vendas
-- --------------------------------------------
CREATE TABLE public.sale_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    total_price NUMERIC NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.10 EXPENSES - Despesas
-- --------------------------------------------
CREATE TABLE public.expenses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL DEFAULT 'Outros',
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    payment_method public.payment_method NOT NULL DEFAULT 'pix',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 2.11 SHOPPING_LIST - Lista de compras
-- --------------------------------------------
CREATE TABLE public.shopping_list (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    quantity TEXT,
    estimated_price NUMERIC DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'Geral',
    is_checked BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. FUNÇÕES DO BANCO DE DADOS
-- ============================================

-- --------------------------------------------
-- 3.1 has_role - Verificar role do usuário
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- --------------------------------------------
-- 3.2 handle_new_user - Trigger para novos usuários
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- --------------------------------------------
-- 3.3 update_updated_at_column - Atualizar timestamp
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- --------------------------------------------
-- 3.4 get_public_catalog_items - Itens públicos do catálogo
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.get_public_catalog_items(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    price NUMERIC,
    image_url TEXT,
    category TEXT,
    display_order INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        ci.id,
        ci.name,
        ci.description,
        ci.price,
        ci.image_url,
        ci.category,
        ci.display_order
    FROM public.catalog_items ci
    WHERE ci.user_id = p_user_id
      AND ci.is_active = true
    ORDER BY ci.display_order ASC;
$$;

-- --------------------------------------------
-- 3.5 get_public_catalog_profile - Perfil público do catálogo
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.get_public_catalog_profile(p_user_id UUID)
RETURNS TABLE (
    business_name TEXT,
    catalog_logo_url TEXT,
    catalog_banner_url TEXT,
    catalog_primary_color TEXT,
    catalog_secondary_color TEXT,
    catalog_background_color TEXT,
    catalog_text_color TEXT,
    catalog_show_prices BOOLEAN,
    catalog_whatsapp TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        p.business_name,
        p.catalog_logo_url,
        p.catalog_banner_url,
        p.catalog_primary_color,
        p.catalog_secondary_color,
        p.catalog_background_color,
        p.catalog_text_color,
        p.catalog_show_prices,
        p.catalog_whatsapp
    FROM public.profiles p
    WHERE p.user_id = p_user_id
    LIMIT 1;
$$;

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Trigger para criar perfil automaticamente ao registrar usuário
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at
    BEFORE UPDATE ON public.ingredients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalog_items_updated_at
    BEFORE UPDATE ON public.catalog_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_list_updated_at
    BEFORE UPDATE ON public.shopping_list
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- --------------------------------------------
-- 5.1 PROFILES
-- --------------------------------------------
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

-- --------------------------------------------
-- 5.2 USER_ROLES
-- --------------------------------------------
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
    ON public.user_roles FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
    ON public.user_roles FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));

-- --------------------------------------------
-- 5.3 CLIENTS
-- --------------------------------------------
CREATE POLICY "Users can view their own clients"
    ON public.clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
    ON public.clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
    ON public.clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
    ON public.clients FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.4 INGREDIENTS
-- --------------------------------------------
CREATE POLICY "Users can view their own ingredients"
    ON public.ingredients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients"
    ON public.ingredients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients"
    ON public.ingredients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients"
    ON public.ingredients FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.5 RECIPES
-- --------------------------------------------
CREATE POLICY "Users can view their own recipes"
    ON public.recipes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
    ON public.recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
    ON public.recipes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
    ON public.recipes FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.6 RECIPE_ITEMS
-- --------------------------------------------
CREATE POLICY "Users can view recipe items of their recipes"
    ON public.recipe_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_items.recipe_id
          AND recipes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert recipe items in their recipes"
    ON public.recipe_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_items.recipe_id
          AND recipes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update recipe items in their recipes"
    ON public.recipe_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_items.recipe_id
          AND recipes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete recipe items from their recipes"
    ON public.recipe_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_items.recipe_id
          AND recipes.user_id = auth.uid()
    ));

-- --------------------------------------------
-- 5.7 CATALOG_ITEMS
-- --------------------------------------------
CREATE POLICY "Users can view their own catalog items"
    ON public.catalog_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catalog items"
    ON public.catalog_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalog items"
    ON public.catalog_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalog items"
    ON public.catalog_items FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.8 SALES
-- --------------------------------------------
CREATE POLICY "Users can view their own sales"
    ON public.sales FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales"
    ON public.sales FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales"
    ON public.sales FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales"
    ON public.sales FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.9 SALE_ITEMS
-- --------------------------------------------
CREATE POLICY "Users can view sale items of their sales"
    ON public.sale_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.sales
        WHERE sales.id = sale_items.sale_id
          AND sales.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert sale items in their sales"
    ON public.sale_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.sales
        WHERE sales.id = sale_items.sale_id
          AND sales.user_id = auth.uid()
    ));

CREATE POLICY "Users can update sale items in their sales"
    ON public.sale_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.sales
        WHERE sales.id = sale_items.sale_id
          AND sales.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete sale items from their sales"
    ON public.sale_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.sales
        WHERE sales.id = sale_items.sale_id
          AND sales.user_id = auth.uid()
    ));

-- --------------------------------------------
-- 5.10 EXPENSES
-- --------------------------------------------
CREATE POLICY "Users can view their own expenses"
    ON public.expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
    ON public.expenses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
    ON public.expenses FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------
-- 5.11 SHOPPING_LIST
-- --------------------------------------------
CREATE POLICY "Users can view their own shopping list"
    ON public.shopping_list FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert in their shopping list"
    ON public.shopping_list FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their shopping list"
    ON public.shopping_list FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their shopping list"
    ON public.shopping_list FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 6. STORAGE BUCKETS
-- ============================================

-- Bucket para avatares dos usuários (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Bucket para imagens do catálogo (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog', 'catalog', true);

-- Políticas de storage para avatares
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de storage para catálogo
CREATE POLICY "Catalog images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'catalog');

CREATE POLICY "Users can upload catalog images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update catalog images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete catalog images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- FIM DO SCHEMA
-- ============================================
