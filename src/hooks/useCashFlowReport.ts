import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sale, PaymentMethod, DeliveryStatus } from "./useSales";
import { Expense } from "./useExpenses";

export interface CashFlowReport {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  salesCount: number;
  salesByPaymentMethod: Record<PaymentMethod, { count: number; amount: number }>;
  salesByDeliveryStatus: Record<DeliveryStatus, number>;
  expensesByCategory: Record<string, number>;
  previousMonth?: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
  };
}

const PAYMENT_METHOD_TAXES: Record<PaymentMethod, number> = {
  pix: 0,
  cash: 0,
  transfer: 0,
  debit_card: 0.015,
  credit_card: 0.035,
};

export function useCashFlowReport(month: number, year: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cash-flow-report", user?.id, month, year],
    queryFn: async (): Promise<CashFlowReport> => {
      // Current month data
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const startDateStr = startDate.split("T")[0];
      const endDateStr = new Date(year, month + 1, 0).toISOString().split("T")[0];

      // Previous month data
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevStartDate = new Date(prevYear, prevMonth, 1).toISOString();
      const prevEndDate = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59).toISOString();
      const prevStartDateStr = prevStartDate.split("T")[0];
      const prevEndDateStr = new Date(prevYear, prevMonth + 1, 0).toISOString().split("T")[0];

      // Fetch current month sales
      const { data: sales } = await supabase
        .from("sales")
        .select("*")
        .gte("sale_date", startDate)
        .lte("sale_date", endDate);

      // Fetch current month expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .gte("expense_date", startDateStr)
        .lte("expense_date", endDateStr);

      // Fetch previous month data
      const { data: prevSales } = await supabase
        .from("sales")
        .select("total_amount")
        .gte("sale_date", prevStartDate)
        .lte("sale_date", prevEndDate);

      const { data: prevExpenses } = await supabase
        .from("expenses")
        .select("amount")
        .gte("expense_date", prevStartDateStr)
        .lte("expense_date", prevEndDateStr);

      const salesData = (sales || []) as Sale[];
      const expensesData = (expenses || []) as Expense[];

      // Calculate totals
      const totalSales = salesData.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      const totalExpenses = expensesData.reduce((sum, e) => sum + (e.amount || 0), 0);

      // Calculate card taxes
      const cardTaxes = salesData.reduce((sum, s) => {
        const taxRate = PAYMENT_METHOD_TAXES[s.payment_method] || 0;
        return sum + (s.total_amount * taxRate);
      }, 0);

      const netProfit = totalSales - totalExpenses - cardTaxes;

      // Group by payment method
      const salesByPaymentMethod: Record<PaymentMethod, { count: number; amount: number }> = {
        pix: { count: 0, amount: 0 },
        credit_card: { count: 0, amount: 0 },
        debit_card: { count: 0, amount: 0 },
        cash: { count: 0, amount: 0 },
        transfer: { count: 0, amount: 0 },
      };

      salesData.forEach((sale) => {
        if (salesByPaymentMethod[sale.payment_method]) {
          salesByPaymentMethod[sale.payment_method].count++;
          salesByPaymentMethod[sale.payment_method].amount += sale.total_amount || 0;
        }
      });

      // Group by delivery status
      const salesByDeliveryStatus: Record<DeliveryStatus, number> = {
        pending: 0,
        in_production: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0,
      };

      salesData.forEach((sale) => {
        if (salesByDeliveryStatus[sale.delivery_status] !== undefined) {
          salesByDeliveryStatus[sale.delivery_status]++;
        }
      });

      // Group expenses by category
      const expensesByCategory: Record<string, number> = {};
      expensesData.forEach((expense) => {
        const category = expense.category || "Outros";
        expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
      });

      // Previous month totals
      const prevTotalSales = (prevSales || []).reduce((sum, s: any) => sum + (s.total_amount || 0), 0);
      const prevTotalExpenses = (prevExpenses || []).reduce((sum, e: any) => sum + (e.amount || 0), 0);

      return {
        totalSales,
        totalExpenses,
        netProfit,
        salesCount: salesData.length,
        salesByPaymentMethod,
        salesByDeliveryStatus,
        expensesByCategory,
        previousMonth: {
          totalSales: prevTotalSales,
          totalExpenses: prevTotalExpenses,
          netProfit: prevTotalSales - prevTotalExpenses,
        },
      };
    },
    enabled: !!user,
  });
}
