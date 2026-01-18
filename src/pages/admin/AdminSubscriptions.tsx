import { useState } from "react";
import { 
  Search, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Users,
  MoreHorizontal,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  Timer
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminStats, type AdminUser } from "@/hooks/useAdminStats";
import { useManageSubscription } from "@/hooks/useManageSubscription";
import { SubscriptionActionDialog } from "@/components/admin/SubscriptionActionDialog";

type ActionType = "activate" | "expire" | "cancel" | "renew" | "extend";

export default function AdminSubscriptions() {
  const { stats, users, isLoading } = useAdminStats();
  const { 
    activateSubscription, 
    expireSubscription, 
    cancelSubscription, 
    renewTrial, 
    extendSubscription,
    isLoading: isActionLoading 
  } = useManageSubscription();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>("activate");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: ActionType, user: AdminUser) => {
    setSelectedAction(action);
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleConfirmAction = async (days?: number) => {
    if (!selectedUser) return;

    switch (selectedAction) {
      case "activate":
        await activateSubscription(selectedUser.user_id);
        break;
      case "expire":
        await expireSubscription(selectedUser.user_id);
        break;
      case "cancel":
        await cancelSubscription(selectedUser.user_id);
        break;
      case "renew":
        await renewTrial(selectedUser.user_id, days || 15);
        break;
      case "extend":
        await extendSubscription(selectedUser.user_id, days || 30);
        break;
    }

    setDialogOpen(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success-soft text-success border-0 gap-1">
            <CheckCircle className="h-3 w-3" /> Ativo
          </Badge>
        );
      case "trial":
        return (
          <Badge className="bg-primary-soft text-primary border-0 gap-1">
            <Timer className="h-3 w-3" /> Trial
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-warning-soft text-warning border-0 gap-1">
            <Clock className="h-3 w-3" /> Expirado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-destructive-soft text-destructive border-0 gap-1">
            <XCircle className="h-3 w-3" /> Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">Desconhecido</Badge>
        );
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
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Assinaturas</h1>
          <p className="text-muted-foreground">Ative, cancele ou renove assinaturas dos usuários</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/30 bg-primary-soft/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success-soft/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-success-soft flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-success">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Trial</p>
                <p className="text-2xl font-bold text-foreground">{stats.trialUsers}</p>
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
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-foreground">{stats.expiredUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 sm: flex-col sm:gap-3">
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
          <SelectTrigger className="w-48 h-12">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="trial">Em Trial</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Usuário</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Trial Expira</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Dias Restantes</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Cadastro</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(user.subscription_status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.trial_ends_at ? (
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(user.trial_ends_at).toLocaleDateString('pt-BR')}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.days_remaining !== null ? (
                        <Badge 
                          variant={user.days_remaining <= 3 ? "destructive" : user.days_remaining <= 7 ? "outline" : "secondary"}
                          className="gap-1"
                        >
                          {user.days_remaining > 0 ? `${user.days_remaining} dias` : "Expirado"}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleAction("activate", user)}
                            disabled={user.subscription_status === "active"}
                          >
                            <Play className="h-4 w-4 mr-2 text-success" />
                            Ativar Assinatura
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction("renew", user)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                            Renovar Trial
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleAction("expire", user)}
                            disabled={user.subscription_status === "expired"}
                          >
                            <Clock className="h-4 w-4 mr-2 text-warning" />
                            Expirar Assinatura
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction("cancel", user)}
                            disabled={user.subscription_status === "cancelled"}
                            className="text-destructive focus:text-destructive"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Cancelar Assinatura
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      {selectedUser && (
        <SubscriptionActionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          action={selectedAction}
          userName={selectedUser.full_name}
          onConfirm={handleConfirmAction}
          isLoading={isActionLoading}
        />
      )}
    </AdminLayout>
  );
}
