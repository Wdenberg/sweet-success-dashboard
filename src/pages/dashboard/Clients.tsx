import { useState } from "react";
import { Plus, Search, Phone, MessageCircle, MoreHorizontal, Edit2, Trash2, Users, UserCheck, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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

const clients = [
  { 
    id: 1, 
    name: "Ana Paula Silva", 
    phone: "(11) 99999-1234",
    email: "ana.paula@email.com",
    totalOrders: 12, 
    totalSpent: 1850.00,
    lastOrder: "2024-01-15",
    status: "active",
    notes: "Prefere bolos sem lactose"
  },
  { 
    id: 2, 
    name: "Carlos Eduardo Lima", 
    phone: "(11) 98888-5678",
    email: "carlos.lima@email.com",
    totalOrders: 8, 
    totalSpent: 920.00,
    lastOrder: "2024-01-10",
    status: "active",
    notes: ""
  },
  { 
    id: 3, 
    name: "Mariana Costa", 
    phone: "(11) 97777-9012",
    email: "mari.costa@email.com",
    totalOrders: 3, 
    totalSpent: 280.00,
    lastOrder: "2024-01-08",
    status: "pending",
    notes: "Aguardando orçamento para festa"
  },
  { 
    id: 4, 
    name: "Pedro Henrique", 
    phone: "(11) 96666-3456",
    email: "pedro.h@email.com",
    totalOrders: 15, 
    totalSpent: 2450.00,
    lastOrder: "2024-01-12",
    status: "active",
    notes: "Cliente VIP - sempre pede cupcakes"
  },
  { 
    id: 5, 
    name: "Juliana Ferreira", 
    phone: "(11) 95555-7890",
    email: "ju.ferreira@email.com",
    totalOrders: 5, 
    totalSpent: 560.00,
    lastOrder: "2023-12-20",
    status: "inactive",
    notes: ""
  },
];

const stats = [
  { title: "Total de Clientes", value: clients.length, icon: Users, color: "primary" },
  { title: "Ativos este Mês", value: clients.filter(c => c.status === "active").length, icon: UserCheck, color: "success" },
  { title: "Pendentes", value: clients.filter(c => c.status === "pending").length, icon: Clock, color: "warning" },
];

export default function Clients() {
  const [search, setSearch] = useState("");
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success-soft text-success border-0">Ativo</Badge>;
      case "pending":
        return <Badge className="bg-warning-soft text-warning border-0">Pendente</Badge>;
      case "inactive":
        return <Badge className="bg-muted text-muted-foreground border-0">Inativo</Badge>;
      default:
        return null;
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Clientes</h1>
          <p className="text-muted-foreground">Gerencie seu relacionamento com clientes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary-soft" :
                  stat.color === "success" ? "bg-success-soft" :
                  "bg-warning-soft"
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === "primary" ? "text-primary" :
                    stat.color === "success" ? "text-success" :
                    "text-warning"
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12"
        />
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Contato</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Pedidos</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Total Gasto</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Última Compra</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr 
                    key={client.id} 
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => openWhatsApp(client.phone)}
                        >
                          <MessageCircle className="h-4 w-4 text-success" />
                        </Button>
                        <span className="text-sm text-muted-foreground">{client.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-foreground">{client.totalOrders}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-foreground">R$ {client.totalSpent.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-muted-foreground">
                      {formatDate(client.lastOrder)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Phone className="h-4 w-4" /> Ligar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" /> Excluir
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
    </DashboardLayout>
  );
}
