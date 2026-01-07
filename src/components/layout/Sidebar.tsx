import { Link, useLocation, useNavigate } from "react-router-dom";
// Desktop sidebar - hidden on mobile (MobileSidebar handles mobile)
import { useState, useEffect } from "react";
import { 
  ChefHat, 
  Calculator, 
  ShoppingCart, 
  Users, 
  LayoutDashboard,
  Settings,
  LogOut,
  CakeSlice,
  Shield,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrialBanner } from "@/components/trial/TrialBanner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calculator, label: "Nova Receita", path: "/dashboard/receitas/nova" },
  { icon: CakeSlice, label: "Minhas Receitas", path: "/dashboard/receitas" },
  { icon: Wallet, label: "Fluxo de Caixa", path: "/dashboard/financeiro" },
  { icon: ShoppingCart, label: "Lista de Compras", path: "/dashboard/compras" },
  { icon: Users, label: "Clientes", path: "/dashboard/clientes" },
];

function SubscriptionBadge() {
  const { subscription, isLoading } = useSubscription();
  
  if (isLoading || !subscription) {
    return <p className="text-xs text-muted-foreground truncate">Carregando...</p>;
  }
  
  if (subscription.isActive) {
    return <p className="text-xs text-emerald-600 truncate">Plano Ativo</p>;
  }
  
  if (subscription.isTrialActive) {
    return <p className="text-xs text-amber-600 truncate">Trial - {subscription.daysRemaining} dias</p>;
  }
  
  return <p className="text-xs text-destructive truncate">Trial Expirado</p>;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) return;
      
      const { data } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      
      setIsAdmin(!!data);
    }
    
    checkAdminRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/auth");
    } catch (error) {
      toast.error("Erro ao sair. Tente novamente.");
    }
  };

  // Get user initials from email or metadata
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário";
  };

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-pink">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">DoceGestão</h1>
            <p className="text-xs text-muted-foreground">Gestão para confeiteiras</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 py-4 border-t border-sidebar-border space-y-1.5">
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname.startsWith("/admin")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Shield className="h-5 w-5 text-muted-foreground" />
              Admin Panel
            </Link>
          )}
          <Link
            to="/dashboard/configuracoes"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              location.pathname === "/dashboard/configuracoes"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            Configurações
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive-soft transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        {/* Trial Banner */}
        <div className="px-4 py-2">
          <TrialBanner compact />
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{getUserInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{getUserName()}</p>
              <SubscriptionBadge />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
