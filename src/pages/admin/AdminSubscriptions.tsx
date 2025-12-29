import { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStats } from "@/hooks/useAdminStats";

// Simulated subscription/payment data
const subscriptions = [
  { id: "1", user: "Maria Clara", email: "maria@email.com", plan: "pro", amount: 49.90, status: "paid", date: "2024-01-15", method: "Cartão" },
  { id: "2", user: "Ana Paula", email: "ana@email.com", plan: "business", amount: 149.90, status: "paid", date: "2024-01-14", method: "PIX" },
  { id: "3", user: "Carlos Eduardo", email: "carlos@email.com", plan: "pro", amount: 49.90, status: "pending", date: "2024-01-13", method: "Boleto" },
  { id: "4", user: "Juliana Costa", email: "juliana@email.com", plan: "pro", amount: 49.90, status: "failed", date: "2024-01-12", method: "Cartão" },
  { id: "5", user: "Pedro Santos", email: "pedro@email.com", plan: "business", amount: 149.90, status: "paid", date: "2024-01-11", method: "Cartão" },
  { id: "6", user: "Fernanda Lima", email: "fernanda@email.com", plan: "pro", amount: 49.90, status: "paid", date: "2024-01-10", method: "PIX" },
  { id: "7", user: "Ricardo Alves", email: "ricardo@email.com", plan: "pro", amount: 49.90, status: "paid", date: "2024-01-09", method: "Cartão" },
  { id: "8", user: "Camila Ferreira", email: "camila@email.com", plan: "business", amount: 149.90, status: "pending", date: "2024-01-08", method: "Boleto" },
];

export default function AdminSubscriptions() {
  const { stats, isLoading } = useAdminStats();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.user.toLowerCase().includes(search.toLowerCase()) ||
                         sub.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalPaid = subscriptions.filter(s => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
  const totalPending = subscriptions.filter(s => s.status === "pending").reduce((sum, s) => sum + s.amount, 0);
  const totalFailed = subscriptions.filter(s => s.status === "failed").reduce((sum, s) => sum + s.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success-soft text-success border-0 gap-1">
            <CheckCircle className="h-3 w-3" /> Pago
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning-soft text-warning border-0 gap-1">
            <Clock className="h-3 w-3" /> Pendente
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-destructive-soft text-destructive border-0 gap-1">
            <XCircle className="h-3 w-3" /> Falhou
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "pro":
        return <Badge className="bg-primary-soft text-primary border-0">Pro</Badge>;
      case "business":
        return <Badge className="bg-success-soft text-success border-0">Business</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando assinaturas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
          <p className="text-muted-foreground">Histórico de cobranças e planos</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="border-success/30 bg-success-soft/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-success-soft flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR Atual</p>
                <p className="text-2xl font-bold text-success">R$ {stats.mrr.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos</p>
                <p className="text-2xl font-bold text-foreground">R$ {totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-warning-soft flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">R$ {totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-destructive-soft flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Falharam</p>
                <p className="text-2xl font-bold text-foreground">R$ {totalFailed.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="paid">Pagos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="failed">Falharam</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os planos</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Usuário</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Plano</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Método</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub, index) => (
                  <tr 
                    key={sub.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {sub.user.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{sub.user}</p>
                          <p className="text-sm text-muted-foreground">{sub.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getPlanBadge(sub.plan)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-foreground">R$ {sub.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm text-muted-foreground">{sub.method}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(sub.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
