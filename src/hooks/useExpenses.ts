import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PaymentMethod } from "./useSales";

export interface Expense {
  id: string;
  user_id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: PaymentMethod;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string | null;
}

export const EXPENSE_CATEGORIES = [
  "Insumos",
  "Embalagens",
  "Energia",
  "Gás",
  "Transporte",
  "Equipamentos",
  "Marketing",
  "Outros",
];

export function useExpenses(month?: number, year?: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ["expenses", user?.id, month, year],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (month !== undefined && year !== undefined) {
        const startDate = new Date(year, month, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
        query = query.gte("expense_date", startDate).lte("expense_date", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });

  const createExpense = useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: expense, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          expense_date: data.expense_date,
          category: data.category,
          description: data.description,
          amount: data.amount,
          payment_method: data.payment_method,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar despesa:", error);
      toast.error("Erro ao registrar despesa");
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Expense> & { id: string }) => {
      const { error } = await supabase.from("expenses").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar despesa");
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa removida!");
    },
    onError: () => {
      toast.error("Erro ao remover despesa");
    },
  });

  return {
    expenses,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
