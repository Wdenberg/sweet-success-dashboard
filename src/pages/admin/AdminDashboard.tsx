import { 
  Users, 
  TrendingDown,
  CakeSlice,
  UserPlus,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Timer,
  CheckCircle,
  Clock
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminDashboard() {
  const { stats, users, isLoading } = useAdminStats();

  const kpis = [
    {
      title: "Usuários Ativos",
      value: stats.activeUsers.toString(),
      change: `+${stats.newUsersThisMonth} este mês`,
      trend: "up",
      icon: CheckCircle,
      description: "Assinaturas ativas",
      color: "success",
    },
    {
      title: "Em Trial",
      value: stats.trialUsers.toString(),
      change: `${stats.totalUsers} total`,
      trend: "up",
      icon: Timer,
      description: "Usuários em período de teste",
      color: "primary",
    },
    {
      title: "Expirados",
      value: stats.expiredUsers.toString(),
      change: `${stats.cancelledUsers} cancelados`,
      trend: "down",
      icon: Clock,
      description: "Assinaturas expiradas",
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

  const statusBreakdown = [
    { status: "Ativos", users: stats.activeUsers, color: "success" },
    { status: "Em Trial", users: stats.trialUsers, color: "primary" },
    { status: "Expirados", users: stats.expiredUsers, color: "warning" },
    { status: "Cancelados", users: stats.cancelledUsers, color: "destructive" },
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
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do DoceGestão</p>
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
        {/* Status Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Status das Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusBreakdown.map((item, index) => (
                <div 
                  key={item.status}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      item.color === "success" ? "bg-success-soft" :
                      item.color === "primary" ? "bg-primary-soft" :
                      item.color === "warning" ? "bg-warning-soft" :
                      "bg-destructive-soft"
                    }`}>
                      <Users className={`h-5 w-5 ${
                        item.color === "success" ? "text-success" :
                        item.color === "primary" ? "text-primary" :
                        item.color === "warning" ? "text-warning" :
                        "text-destructive"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalUsers > 0 ? ((item.users / stats.totalUsers) * 100).toFixed(0) : 0}% do total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {item.users} usuários
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Total de Usuários</span>
              <span className="text-2xl font-bold text-primary">{stats.totalUsers}</span>
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
                      user.subscription_status === "active" ? "bg-success-soft text-success" :
                      user.subscription_status === "trial" ? "bg-primary-soft text-primary" :
                      user.subscription_status === "expired" ? "bg-warning-soft text-warning" :
                      "bg-destructive-soft text-destructive"
                    }`}>
                      {user.subscription_status === "active" ? "Ativo" :
                       user.subscription_status === "trial" ? "Trial" :
                       user.subscription_status === "expired" ? "Expirado" : "Cancelado"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.expiredUsers > stats.activeUsers && (
        <Card className="mt-6 border-warning/50 bg-warning-soft/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-warning-soft flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Atenção: Muitas Assinaturas Expiradas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Você tem mais usuários expirados do que ativos. Considere entrar em contato para reativação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
