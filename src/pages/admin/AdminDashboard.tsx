import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CakeSlice,
  UserPlus,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminDashboard() {
  const { stats, users, isLoading } = useAdminStats();

  const kpis = [
    {
      title: "MRR",
      value: `R$ ${stats.mrr.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Receita Recorrente Mensal",
      color: "success",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers.toString(),
      change: `+${stats.newUsersThisMonth} este mês`,
      trend: "up",
      icon: Users,
      description: "Total de assinantes ativos",
      color: "primary",
    },
    {
      title: "Taxa de Churn",
      value: `${stats.churnRate}%`,
      change: "-0.5% vs mês anterior",
      trend: "down",
      icon: TrendingDown,
      description: "Cancelamentos mensais",
      color: "warning",
    },
    {
      title: "Receitas Criadas",
      value: stats.totalRecipes.toString(),
      change: "Total na plataforma",
      trend: "up",
      icon: CakeSlice,
      description: "Fichas técnicas cadastradas",
      color: "accent",
    },
  ];

  const revenueBreakdown = [
    { plan: "Pro", users: stats.proUsers, price: 49.90, total: stats.proUsers * 49.90 },
    { plan: "Business", users: Math.floor(stats.totalUsers * 0.1), price: 149.90, total: Math.floor(stats.totalUsers * 0.1) * 149.90 },
    { plan: "Free", users: stats.freeUsers, price: 0, total: 0 },
  ];

  const recentUsers = users.slice(0, 5);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Visão geral do DoceGestão SaaS</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <Card 
            key={kpi.title} 
            className="relative overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-warning" />
                    )}
                    <span className={`text-xs ${kpi.trend === "up" ? "text-success" : "text-warning"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  kpi.color === "success" ? "bg-success-soft" :
                  kpi.color === "primary" ? "bg-primary-soft" :
                  kpi.color === "warning" ? "bg-warning-soft" :
                  "bg-accent"
                }`}>
                  <kpi.icon className={`h-6 w-6 ${
                    kpi.color === "success" ? "text-success" :
                    kpi.color === "primary" ? "text-primary" :
                    kpi.color === "warning" ? "text-warning" :
                    "text-accent-foreground"
                  }`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Composição da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div 
                  key={item.plan}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      item.plan === "Pro" ? "bg-primary-soft" :
                      item.plan === "Business" ? "bg-success-soft" :
                      "bg-muted"
                    }`}>
                      <CreditCard className={`h-5 w-5 ${
                        item.plan === "Pro" ? "text-primary" :
                        item.plan === "Business" ? "text-success" :
                        "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Plano {item.plan}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.users} usuários × R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      R$ {item.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.mrr > 0 ? ((item.total / stats.mrr) * 100).toFixed(0) : 0}% do MRR
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Total MRR</span>
              <span className="text-2xl font-bold text-success">R$ {stats.mrr.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Usuários Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum usuário ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user, index) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.plan === "pro" ? "bg-primary-soft text-primary" :
                      user.plan === "business" ? "bg-success-soft text-success" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.churnRate > 3 && (
        <Card className="mt-6 border-warning/50 bg-warning-soft/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-warning-soft flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Atenção: Taxa de Churn Elevada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A taxa de churn está acima de 3%. Considere analisar os motivos de cancelamento e implementar estratégias de retenção.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
