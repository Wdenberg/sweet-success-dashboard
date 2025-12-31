-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');

-- Add trial columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '15 days'),
ADD COLUMN subscription_status public.subscription_status DEFAULT 'trial';

-- Update existing profiles to have trial status
UPDATE public.profiles 
SET trial_ends_at = created_at + interval '15 days',
    subscription_status = CASE 
      WHEN created_at + interval '15 days' > now() THEN 'trial'::subscription_status
      ELSE 'expired'::subscription_status
    END
WHERE trial_ends_at IS NULL;

-- Update handle_new_user function to set trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;