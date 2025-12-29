import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChefHat, 
  Calculator, 
  ShoppingCart, 
  Users, 
  LayoutDashboard,
  Settings,
  LogOut,
  CakeSlice
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calculator, label: "Nova Receita", path: "/dashboard/receitas/nova" },
  { icon: CakeSlice, label: "Minhas Receitas", path: "/dashboard/receitas" },
  { icon: ShoppingCart, label: "Lista de Compras", path: "/dashboard/compras" },
  { icon: Users, label: "Clientes", path: "/dashboard/clientes" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Configurações", path: "/dashboard/configuracoes" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
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
          {bottomMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </Link>
            );
          })}
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive-soft transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{getUserInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{getUserName()}</p>
              <p className="text-xs text-muted-foreground truncate">Plano Pro</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
