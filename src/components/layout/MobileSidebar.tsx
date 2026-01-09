import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChefHat, CakeSlice, ShoppingCart, Users, LogOut, Settings, Shield, Wallet, ImageIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface MobileSidebarProps {
  variant?: "dashboard" | "admin";
}

const dashboardMenuItems = [
  { icon: CakeSlice, label: "Receitas", path: "/dashboard/receitas" },
  { icon: ImageIcon, label: "Catálogo", path: "/dashboard/catalogo" },
  { icon: Wallet, label: "Financeiro", path: "/dashboard/financeiro" },
  { icon: ShoppingCart, label: "Compras", path: "/dashboard/compras" },
  { icon: Users, label: "Clientes", path: "/dashboard/clientes" },
];

const adminMenuItems = [
  { icon: Shield, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Usuários", path: "/admin/usuarios" },
  { icon: Settings, label: "Assinaturas", path: "/admin/assinaturas" },
];

export function MobileSidebar({ variant = "dashboard" }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      return !!data;
    },
    enabled: !!user?.id && variant === "dashboard",
  });

  const menuItems = variant === "admin" ? adminMenuItems : dashboardMenuItems;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/auth");
    } catch {
      toast.error("Erro ao sair. Tente novamente.");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border h-16 flex items-center px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-foreground text-background">
          <SheetHeader className="p-6 border-b border-background/10">
            <SheetTitle className="flex items-center gap-3 text-background">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                variant === "admin" ? "bg-primary" : "gradient-primary shadow-pink"
              )}>
                {variant === "admin" ? (
                  <Shield className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <ChefHat className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
              <span className="text-lg font-bold">
                {variant === "admin" ? "AdminPanel" : "DoceGestão"}
              </span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {variant === "dashboard" && (
              <button
                onClick={() => handleNavigate("/dashboard")}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  location.pathname === "/dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-background/70 hover:text-background hover:bg-background/10"
                )}
              >
                <ChefHat className="h-5 w-5" />
                Dashboard
              </button>
            )}
            
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-background/70 hover:text-background hover:bg-background/10"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}

            {variant === "dashboard" && isAdmin && (
              <button
                onClick={() => handleNavigate("/admin")}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-background/70 hover:text-background hover:bg-background/10"
              >
                <Shield className="h-5 w-5" />
                Admin Panel
              </button>
            )}

            {variant === "dashboard" && (
              <button
                onClick={() => handleNavigate("/dashboard/configuracoes")}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  location.pathname === "/dashboard/configuracoes"
                    ? "bg-primary text-primary-foreground"
                    : "text-background/70 hover:text-background hover:bg-background/10"
                )}
              >
                <Settings className="h-5 w-5" />
                Configurações
              </button>
            )}

            {variant === "admin" && (
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-background/70 hover:text-background hover:bg-background/10"
              >
                <ChefHat className="h-5 w-5" />
                Voltar ao App
              </button>
            )}
          </nav>

          <div className="px-4 py-4 border-t border-background/10">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/20 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>

          {user && (
            <div className="px-4 py-4 border-t border-background/10">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 
                     user.email?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-background truncate">
                    {user.user_metadata?.full_name || "Usuário"}
                  </p>
                  <p className="text-xs text-background/60 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-3 ml-3">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          variant === "admin" ? "bg-primary" : "gradient-primary shadow-pink"
        )}>
          {variant === "admin" ? (
            <Shield className="h-4 w-4 text-primary-foreground" />
          ) : (
            <ChefHat className="h-4 w-4 text-primary-foreground" />
          )}
        </div>
        <span className="text-lg font-bold text-foreground">
          {variant === "admin" ? "Admin" : "DoceGestão"}
        </span>
      </div>
    </div>
  );
}
