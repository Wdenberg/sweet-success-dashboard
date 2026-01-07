import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'transfer';
export type DeliveryStatus = 'pending' | 'in_production' | 'ready' | 'delivered' | 'cancelled';

export interface SaleItem {
  id?: string;
  sale_id?: string;
  recipe_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  id: string;
  user_id: string;
  client_id: string | null;
  sale_date: string;
  delivery_date: string | null;
  payment_method: PaymentMethod;
  delivery_status: DeliveryStatus;
  subtotal: number;
  discount: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
  client?: { name: string } | null;
}

export interface CreateSaleData {
  client_id?: string | null;
  sale_date: string;
  delivery_date?: string | null;
  payment_method: PaymentMethod;
  delivery_status: DeliveryStatus;
  subtotal: number;
  discount: number;
  total_amount: number;
  notes?: string | null;
  items: SaleItem[];
}

export function useSales(month?: number, year?: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sales, isLoading, error } = useQuery({
    queryKey: ["sales", user?.id, month, year],
    queryFn: async () => {
      let query = supabase
        .from("sales")
        .select(`
          *,
          client:clients(name),
          items:sale_items(*)
        `)
        .order("sale_date", { ascending: false });

      if (month !== undefined && year !== undefined) {
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        query = query.gte("sale_date", startDate).lte("sale_date", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Sale[];
    },
    enabled: !!user,
  });

  const createSale = useMutation({
    mutationFn: async (data: CreateSaleData) => {
      if (!user) throw new Error("Usuário não autenticado");

      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: user.id,
          client_id: data.client_id || null,
          sale_date: data.sale_date,
          delivery_date: data.delivery_date || null,
          payment_method: data.payment_method,
          delivery_status: data.delivery_status,
          subtotal: data.subtotal,
          discount: data.discount,
          total_amount: data.total_amount,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      if (data.items.length > 0) {
        const { error: itemsError } = await supabase.from("sale_items").insert(
          data.items.map((item) => ({
            sale_id: sale.id,
            recipe_id: item.recipe_id || null,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          }))
        );
        if (itemsError) throw itemsError;
      }

      // Update client stats if client_id is provided
      if (data.client_id) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("total_orders, total_spent")
          .eq("id", data.client_id)
          .single();

        if (clientData) {
          await supabase
            .from("clients")
            .update({
              total_orders: (clientData.total_orders || 0) + 1,
              total_spent: (clientData.total_spent || 0) + data.total_amount,
              last_order_at: new Date().toISOString(),
            })
            .eq("id", data.client_id);
        }
      }

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Venda registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar venda:", error);
      toast.error("Erro ao registrar venda");
    },
  });

  const updateSale = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Sale> & { id: string }) => {
      const { error } = await supabase.from("sales").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venda atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar venda");
    },
  });

  const deleteSale = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sales").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venda removida!");
    },
    onError: () => {
      toast.error("Erro ao remover venda");
    },
  });

  return {
    sales,
    isLoading,
    error,
    createSale,
    updateSale,
    deleteSale,
  };
}
