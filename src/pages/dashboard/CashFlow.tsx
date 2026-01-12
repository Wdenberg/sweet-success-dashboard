import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Wallet, TrendingUp, TrendingDown, Calendar, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSales, DeliveryStatus } from "@/hooks/useSales";
import { useExpenses } from "@/hooks/useExpenses";
import { SaleDialog } from "@/components/cashflow/SaleDialog";
import { ExpenseDialog } from "@/components/cashflow/ExpenseDialog";
import { PaymentMethodBadge } from "@/components/cashflow/PaymentMethodBadge";
import { DeliveryStatusSelect } from "@/components/cashflow/DeliveryStatusSelect";
import { MonthlyReport } from "@/components/cashflow/MonthlyReport";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function CashFlow() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const { sales, isLoading: salesLoading, deleteSale, updateSale } = useSales(selectedMonth, selectedYear);
  const { expenses, isLoading: expensesLoading, deleteExpense } = useExpenses(selectedMonth, selectedYear);

  const handleStatusChange = (saleId: string, newStatus: DeliveryStatus) => {
    updateSale.mutate({ id: saleId, delivery_status: newStatus });
  };

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl gradient-primary shadow-pink flex items-center justify-center">
                <Wallet className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              Fluxo de Caixa
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie suas vendas, despesas e acompanhe seu lucro</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtros de Mês/Ano */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedMonth.toString()}
                onValueChange={(v) => setSelectedMonth(parseInt(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(v) => setSelectedYear(parseInt(v))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botões */}
            <Button variant="outline" onClick={() => setExpenseDialogOpen(true)}>
              <TrendingDown className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
            <Button onClick={() => setSaleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="report">Relatório</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>

          {/* Tab Relatório */}
          <TabsContent value="report">
            <MonthlyReport month={selectedMonth} year={selectedYear} />
          </TabsContent>

          {/* Tab Vendas */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Vendas de {MONTHS[selectedMonth]} {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                ) : sales && sales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Entrega</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>
                              {format(new Date(sale.sale_date), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell>{sale.client?.name || "—"}</TableCell>
                            <TableCell className="font-semibold">
                              R$ {sale.total_amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <PaymentMethodBadge method={sale.payment_method} />
                            </TableCell>
                            <TableCell>
                              <DeliveryStatusSelect 
                                saleId={sale.id}
                                currentStatus={sale.delivery_status}
                                onStatusChange={handleStatusChange}
                                disabled={updateSale.isPending}
                              />
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => deleteSale.mutate(sale.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma venda registrada</h3>
                    <p className="text-muted-foreground">Registre sua primeira venda do mês</p>
                    <Button className="mt-4" onClick={() => setSaleDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Venda
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Despesas */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Despesas de {MONTHS[selectedMonth]} {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expensesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                ) : expenses && expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>
                              {format(new Date(expense.expense_date), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-muted rounded-lg text-sm">
                                {expense.category}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {expense.description}
                            </TableCell>
                            <TableCell className="font-semibold text-red-600">
                              - R$ {expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <PaymentMethodBadge method={expense.payment_method} />
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => deleteExpense.mutate(expense.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingDown className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma despesa registrada</h3>
                    <p className="text-muted-foreground">Registre sua primeira despesa do mês</p>
                    <Button className="mt-4" onClick={() => setExpenseDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <SaleDialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen} />
      <ExpenseDialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen} />
    </DashboardLayout>
  );
}
