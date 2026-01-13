import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Shield, 
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
  BarChart3,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Usuários", path: "/admin/usuarios" },
  { icon: CreditCard, label: "Assinaturas", path: "/admin/assinaturas" },
  { icon: BarChart3, label: "Métricas", path: "/admin/metricas" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Configurações", path: "/admin/configuracoes" },
];

export function AdminSidebar() {
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
    return "AD";
  };

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 bg-foreground text-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-background/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-background">AdminPanel</h1>
            <p className="text-xs text-background/60">Gestão do SaaS</p>
          </div>
        </div>

        {/* Back to App */}
        <div className="px-4 py-4 border-b border-background/10">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-background/70 hover:text-background hover:bg-background/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao App
          </Link>
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
                    ? "bg-primary text-primary-foreground"
                    : "text-background/70 hover:text-background hover:bg-background/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 py-4 border-t border-background/10 space-y-1.5">
          {bottomMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-background/20 text-background"
                    : "text-background/70 hover:text-background hover:bg-background/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-background/10">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
             <span className="text-sm font-bold text-primary-foreground">{getUserInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-background truncate">Administrador</p>
              <p className="text-xs text-background/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
