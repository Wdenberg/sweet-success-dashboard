import { 
  TrendingUp, 
  CakeSlice, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/hooks/useRecipes";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { recipes, isLoading } = useRecipes();

  // Calculate stats from real data
  const totalRecipes = recipes.length;
  const totalSuggestedRevenue = recipes.reduce((sum, r) => sum + (r.suggested_price || 0), 0);
  const avgMargin = recipes.length > 0 
    ? recipes.reduce((sum, r) => sum + r.profit_margin, 0) / recipes.length 
    : 0;

  const stats = [
    {
      title: "Receitas Cadastradas",
      value: totalRecipes.toString(),
      change: "Suas fichas técnicas",
      trend: "up" as const,
      icon: CakeSlice,
      color: "primary",
    },
    {
      title: "Clientes Ativos",
      value: "0",
      change: "Cadastre clientes",
      trend: "up" as const,
      icon: Users,
      color: "success",
    },
    {
      title: "Valor Total Receitas",
      value: `R$ ${totalSuggestedRevenue.toFixed(0)}`,
      change: "Soma dos preços sugeridos",
      trend: "up" as const,
      icon: DollarSign,
      color: "warning",
    },
    {
      title: "Margem Média",
      value: `${avgMargin.toFixed(0)}%`,
      change: "Média das receitas",
      trend: avgMargin >= 45 ? "up" as const : "down" as const,
      icon: TrendingUp,
      color: "muted",
    },
  ];

  const recentRecipes = recipes.slice(0, 4);

  const getUserName = () => {
    return user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Usuário";
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, {getUserName()}! 🎂</h1>
          <p className="text-muted-foreground">Aqui está o resumo da sua confeitaria</p>
        </div>
        <Link to="/dashboard/receitas/nova">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Receita
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary-soft" :
                  stat.color === "success" ? "bg-success-soft" :
                  stat.color === "warning" ? "bg-warning-soft" :
                  "bg-muted"
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === "primary" ? "text-primary" :
                    stat.color === "success" ? "text-success" :
                    stat.color === "warning" ? "text-warning" :
                    "text-muted-foreground"
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Recipes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Receitas Recentes</CardTitle>
            <Link to="/dashboard/receitas">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentRecipes.length === 0 ? (
              <div className="text-center py-8">
                <CakeSlice className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma receita ainda</p>
                <Link to="/dashboard/receitas/nova">
                  <Button variant="soft" size="sm" className="mt-3">
                    Criar primeira receita
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRecipes.map((recipe, index) => (
                  <div 
                    key={recipe.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center">
                        <CakeSlice className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{recipe.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Rend: {recipe.yield_amount} {recipe.yield_unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        R$ {(recipe.suggested_price || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-success">Margem: {recipe.profit_margin}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/receitas/nova" className="block">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-soft/50 hover:bg-primary-soft transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <CakeSlice className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Criar Nova Receita</p>
                  <p className="text-xs text-muted-foreground">Precifique sua próxima criação</p>
                </div>
              </div>
            </Link>
            
            <Link to="/dashboard/compras" className="block">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-warning-soft flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Lista de Compras</p>
                  <p className="text-xs text-muted-foreground">Organize suas compras</p>
                </div>
              </div>
            </Link>
            
            <Link to="/dashboard/clientes" className="block">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-success-soft flex items-center justify-center">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Gerenciar Clientes</p>
                  <p className="text-xs text-muted-foreground">Organize seu CRM</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
