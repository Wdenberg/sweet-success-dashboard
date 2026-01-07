import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Receipt, Truck, Clock, ChefHat, CheckCircle } from "lucide-react";
import { useCashFlowReport } from "@/hooks/useCashFlowReport";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentMethod, DeliveryStatus } from "@/hooks/useSales";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyReportProps {
  month: number;
  year: number;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  cash: "Dinheiro",
  transfer: "Transferência",
};

const PAYMENT_TAXES: Record<PaymentMethod, string> = {
  pix: "0%",
  cash: "0%",
  transfer: "0%",
  debit_card: "1.5%",
  credit_card: "3.5%",
};

const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pendentes", icon: Clock, color: "text-amber-600" },
  in_production: { label: "Em Produção", icon: ChefHat, color: "text-blue-600" },
  ready: { label: "Prontos", icon: CheckCircle, color: "text-purple-600" },
  delivered: { label: "Entregues", icon: Truck, color: "text-emerald-600" },
  cancelled: { label: "Cancelados", icon: TrendingDown, color: "text-red-600" },
};

export function MonthlyReport({ month, year }: MonthlyReportProps) {
  const { data: report, isLoading } = useCashFlowReport(month, year);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!report) return null;

  const salesChange = report.previousMonth
    ? ((report.totalSales - report.previousMonth.totalSales) / (report.previousMonth.totalSales || 1)) * 100
    : 0;

  const expensesChange = report.previousMonth
    ? ((report.totalExpenses - report.previousMonth.totalExpenses) / (report.previousMonth.totalExpenses || 1)) * 100
    : 0;

  const profitChange = report.previousMonth
    ? ((report.netProfit - report.previousMonth.netProfit) / (Math.abs(report.previousMonth.netProfit) || 1)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total de Vendas</p>
                <p className="text-3xl font-bold text-emerald-700">
                  R$ {report.totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                {report.previousMonth && (
                  <div className="flex items-center gap-1 mt-1">
                    {salesChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={salesChange >= 0 ? "text-emerald-600 text-sm" : "text-red-600 text-sm"}>
                      {salesChange >= 0 ? "+" : ""}{salesChange.toFixed(1)}%
                    </span>
                    <span className="text-emerald-600/70 text-sm">vs mês anterior</span>
                  </div>
                )}
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-200 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total de Gastos</p>
                <p className="text-3xl font-bold text-red-700">
                  R$ {report.totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                {report.previousMonth && (
                  <div className="flex items-center gap-1 mt-1">
                    {expensesChange <= 0 ? (
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    )}
                    <span className={expensesChange <= 0 ? "text-emerald-600 text-sm" : "text-red-600 text-sm"}>
                      {expensesChange >= 0 ? "+" : ""}{expensesChange.toFixed(1)}%
                    </span>
                    <span className="text-red-600/70 text-sm">vs mês anterior</span>
                  </div>
                )}
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-200 flex items-center justify-center">
                <Receipt className="h-7 w-7 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${report.netProfit >= 0 ? "from-primary/10 to-primary/20 border-primary/30" : "from-red-50 to-red-100 border-red-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${report.netProfit >= 0 ? "text-primary" : "text-red-600"}`}>
                  Saldo Líquido
                </p>
                <p className={`text-3xl font-bold ${report.netProfit >= 0 ? "text-primary" : "text-red-700"}`}>
                  R$ {report.netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                {report.previousMonth && (
                  <div className="flex items-center gap-1 mt-1">
                    {profitChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={profitChange >= 0 ? "text-emerald-600 text-sm" : "text-red-600 text-sm"}>
                      {profitChange >= 0 ? "+" : ""}{profitChange.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${report.netProfit >= 0 ? "bg-primary/20" : "bg-red-200"}`}>
                <TrendingUp className={`h-7 w-7 ${report.netProfit >= 0 ? "text-primary" : "text-red-700"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendas por Forma de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendas por Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(report.salesByPaymentMethod) as PaymentMethod[]).map((method) => {
              const data = report.salesByPaymentMethod[method];
              const percentage = report.totalSales > 0 ? (data.amount / report.totalSales) * 100 : 0;

              return (
                <div key={method} className="p-4 bg-muted/50 rounded-xl text-center">
                  <PaymentMethodBadge method={method} />
                  <p className="text-xl font-bold mt-2">
                    R$ {data.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">{data.count} vendas</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(0)}% • Taxa: {PAYMENT_TAXES[method]}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status de Entregas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status de Entregas do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(report.salesByDeliveryStatus) as DeliveryStatus[]).map((status) => {
              const count = report.salesByDeliveryStatus[status];
              const config = DELIVERY_STATUS_CONFIG[status];
              const Icon = config.icon;

              return (
                <div key={status} className="p-4 bg-muted/50 rounded-xl text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Despesas por Categoria */}
      {Object.keys(report.expensesByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(report.expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = report.totalExpenses > 0 ? (amount / report.totalExpenses) * 100 : 0;

                  return (
                    <div key={category} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">
                            R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
