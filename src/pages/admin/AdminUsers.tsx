import { useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  UserX, 
  UserCheck, 
  Mail,
  Loader2,
  Users,
  Shield,
  Filter
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStats, AdminUser } from "@/hooks/useAdminStats";
import { toast } from "sonner";

export default function AdminUsers() {
  const { users, stats, isLoading } = useAdminStats();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [blockUser, setBlockUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleBlockUser = () => {
    if (blockUser) {
      toast.success(
        blockUser.status === "active" 
          ? `Usuário ${blockUser.full_name} bloqueado` 
          : `Usuário ${blockUser.full_name} desbloqueado`
      );
      setBlockUser(null);
    }
  };

  const handleSendEmail = (user: AdminUser) => {
    toast.success(`Email enviado para ${user.email}`);
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-success-soft text-success border-0">Ativo</Badge>;
    }
    return <Badge className="bg-destructive-soft text-destructive border-0">Bloqueado</Badge>;
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
            <p className="text-muted-foreground">Carregando usuários...</p>
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
          <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground">{stats.totalUsers} usuários cadastrados</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-success-soft flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-warning-soft flex items-center justify-center">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano Pro</p>
                <p className="text-2xl font-bold text-foreground">{stats.proUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano Free</p>
                <p className="text-2xl font-bold text-foreground">{stats.freeUsers}</p>
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
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os planos</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="blocked">Bloqueados</SelectItem>
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
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Plano</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Receitas</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Receita Total</th>
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
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getPlanBadge(user.plan)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-foreground">{user.total_recipes}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-foreground">R$ {user.total_revenue.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendEmail(user)} className="gap-2">
                            <Mail className="h-4 w-4" /> Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setBlockUser(user)} 
                            className={`gap-2 ${user.status === "active" ? "text-destructive" : "text-success"}`}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4" /> Bloquear
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4" /> Desbloquear
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Block User Dialog */}
      <AlertDialog open={!!blockUser} onOpenChange={() => setBlockUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {blockUser?.status === "active" ? "Bloquear usuário?" : "Desbloquear usuário?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockUser?.status === "active" 
                ? `O usuário ${blockUser?.full_name} não poderá mais acessar a plataforma.`
                : `O usuário ${blockUser?.full_name} terá acesso restaurado à plataforma.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBlockUser}
              className={blockUser?.status === "active" 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-success text-white hover:bg-success/90"
              }
            >
              {blockUser?.status === "active" ? "Bloquear" : "Desbloquear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
