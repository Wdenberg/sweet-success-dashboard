import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CatalogItem {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  category: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCatalogItemData {
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
  category?: string;
  is_active?: boolean;
}

export const CATALOG_CATEGORIES = [
  "Bolos",
  "Tortas",
  "Doces",
  "Salgados",
  "Cupcakes",
  "Brownies",
  "Outros"
];

export const useCatalog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["catalog-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CatalogItem[];
    },
  });

  const createItem = useMutation({
    mutationFn: async (itemData: CreateCatalogItemData) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("catalog_items")
        .insert({
          ...itemData,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-items"] });
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado ao catálogo com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...itemData }: Partial<CatalogItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("catalog_items")
        .update(itemData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-items"] });
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (item: CatalogItem) => {
      // Delete image from storage if exists
      if (item.image_url) {
        const path = item.image_url.split("/catalog/")[1];
        if (path) {
          await supabase.storage.from("catalog").remove([path]);
        }
      }

      const { error } = await supabase
        .from("catalog_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-items"] });
      toast({
        title: "Produto excluído",
        description: "O produto foi removido do catálogo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Usuário não autenticado");

    const fileExt = file.name.split(".").pop();
    const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("catalog")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("catalog")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const deleteImage = async (imageUrl: string) => {
    const path = imageUrl.split("/catalog/")[1];
    if (path) {
      await supabase.storage.from("catalog").remove([path]);
    }
  };

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    uploadImage,
    deleteImage,
  };
};
