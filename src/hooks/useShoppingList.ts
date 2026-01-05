import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string | null;
  estimatedPrice: number;
  category: string;
  checked: boolean;
}

interface NewItem {
  name: string;
  quantity: string;
  estimatedPrice: number;
  category: string;
}

export function useShoppingList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["shopping-list", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shopping_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        estimatedPrice: Number(item.estimated_price) || 0,
        category: item.category,
        checked: item.is_checked,
      })) as ShoppingItem[];
    },
    enabled: !!user,
  });

  const addItem = useMutation({
    mutationFn: async (newItem: NewItem) => {
      const { error } = await supabase.from("shopping_list").insert({
        user_id: user!.id,
        name: newItem.name,
        quantity: newItem.quantity || null,
        estimated_price: newItem.estimatedPrice,
        category: newItem.category,
        is_checked: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list", user?.id] });
      toast.success("Item adicionado!");
    },
    onError: () => {
      toast.error("Erro ao adicionar item");
    },
  });

  const toggleItem = useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const { error } = await supabase
        .from("shopping_list")
        .update({ is_checked: checked })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list", user?.id] });
    },
    onError: () => {
      toast.error("Erro ao atualizar item");
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list", user?.id] });
      toast.success("Item removido da lista");
    },
    onError: () => {
      toast.error("Erro ao remover item");
    },
  });

  const clearChecked = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("is_checked", true)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list", user?.id] });
      toast.success("Itens comprados removidos");
    },
    onError: () => {
      toast.error("Erro ao limpar itens");
    },
  });

  return {
    items,
    isLoading,
    addItem,
    toggleItem,
    removeItem,
    clearChecked,
  };
}
