import { 
  TrendingUp, 
  CakeSlice, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Receitas Cadastradas",
    value: "24",
    change: "+3 este mês",
    trend: "up",
    icon: CakeSlice,
    color: "primary",
  },
  {
    title: "Clientes Ativos",
    value: "156",
    change: "+12% vs mês anterior",
    trend: "up",
    icon: Users,
    color: "success",
  },
  {
    title: "Faturamento Estimado",
    value: "R$ 8.450",
    change: "+18% vs mês anterior",
    trend: "up",
    icon: DollarSign,
    color: "warning",
  },
  {
    title: "Lucro Médio",
    value: "45%",
    change: "-2% vs mês anterior",
    trend: "down",
    icon: TrendingUp,
    color: "muted",
  },
];

const recentRecipes = [
  { name: "Bolo Red Velvet", price: "R$ 180,00", yield: "2kg", margin: "48%" },
  { name: "Cupcakes de Morango", price: "R$ 8,50", yield: "1 un", margin: "52%" },
  { name: "Torta de Limão", price: "R$ 95,00", yield: "1.5kg", margin: "41%" },
  { name: "Brigadeiro Gourmet", price: "R$ 3,20", yield: "1 un", margin: "65%" },
];

const recentClients = [
  { name: "Ana Paula Silva", orders: 12, lastOrder: "Há 2 dias", status: "active" },
  { name: "Carlos Eduardo", orders: 8, lastOrder: "Há 5 dias", status: "active" },
  { name: "Mariana Costa", orders: 3, lastOrder: "Há 1 semana", status: "pending" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, Maria Clara! 🎂</h1>
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
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
            <div className="space-y-3">
              {recentRecipes.map((recipe, index) => (
                <div 
                  key={recipe.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center">
                      <CakeSlice className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{recipe.name}</p>
                      <p className="text-xs text-muted-foreground">Rend: {recipe.yield}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{recipe.price}</p>
                    <p className="text-xs text-success">Margem: {recipe.margin}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Clientes Recentes</CardTitle>
            <Link to="/dashboard/clientes">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentClients.map((client, index) => (
                <div 
                  key={client.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.orders} pedidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{client.lastOrder}</p>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "active" 
                        ? "bg-success-soft text-success" 
                        : "bg-warning-soft text-warning"
                    }`}>
                      {client.status === "active" ? "Ativo" : "Pendente"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
