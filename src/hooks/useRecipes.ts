import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type Recipe = Tables<"recipes">;
export type RecipeItem = Tables<"recipe_items">;
export type RecipeInsert = TablesInsert<"recipes">;
export type RecipeItemInsert = TablesInsert<"recipe_items">;

export interface RecipeWithItems extends Recipe {
  recipe_items: RecipeItem[];
}

export interface CreateRecipeData {
  name: string;
  description?: string;
  image_url?: string;
  yield_amount: number;
  yield_unit: string;
  profit_margin: number;
  labor_cost: number;
  energy_cost: number;
  packaging_cost: number;
  transport_cost: number;
  ingredients_cost: number;
  production_cost: number;
  suggested_price: number;
  category?: string;
  items: {
    ingredient_name: string;
    quantity: number;
    unit: string;
    package_price: number;
    package_size: number;
    package_unit: string;
    calculated_cost: number;
  }[];
}

export function useRecipes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all recipes
  const recipesQuery = useQuery({
    queryKey: ["recipes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Recipe[];
    },
    enabled: !!user?.id,
  });

  // Fetch a single recipe with items
  const useRecipeById = (recipeId: string | undefined) => {
    return useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: async () => {
        if (!recipeId) return null;
        
        const { data: recipe, error: recipeError } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", recipeId)
          .maybeSingle();
        
        if (recipeError) throw recipeError;
        if (!recipe) return null;

        const { data: items, error: itemsError } = await supabase
          .from("recipe_items")
          .select("*")
          .eq("recipe_id", recipeId);
        
        if (itemsError) throw itemsError;

        return { ...recipe, recipe_items: items || [] } as RecipeWithItems;
      },
      enabled: !!recipeId,
    });
  };

  // Create recipe mutation
  const createRecipe = useMutation({
    mutationFn: async (data: CreateRecipeData) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Create recipe
      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          yield_amount: data.yield_amount,
          yield_unit: data.yield_unit,
          profit_margin: data.profit_margin,
          labor_cost: data.labor_cost,
          energy_cost: data.energy_cost,
          packaging_cost: data.packaging_cost,
          transport_cost: data.transport_cost,
          ingredients_cost: data.ingredients_cost,
          production_cost: data.production_cost,
          suggested_price: data.suggested_price,
          category: data.category,
        })
        .select()
        .single();
      
      if (recipeError) throw recipeError;

      // Create recipe items
      if (data.items.length > 0) {
        const itemsToInsert = data.items
          .filter(item => item.ingredient_name.trim())
          .map(item => ({
            recipe_id: recipe.id,
            ingredient_name: item.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            package_price: item.package_price,
            package_size: item.package_size,
            package_unit: item.package_unit,
            calculated_cost: item.calculated_cost,
          }));

        if (itemsToInsert.length > 0) {
          const { error: itemsError } = await supabase
            .from("recipe_items")
            .insert(itemsToInsert);
          
          if (itemsError) throw itemsError;
        }
      }

      return recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receita salva com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating recipe:", error);
      toast.error("Erro ao salvar receita. Tente novamente.");
    },
  });

  // Update recipe mutation
  const updateRecipe = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateRecipeData }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Update recipe
      const { error: recipeError } = await supabase
        .from("recipes")
        .update({
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          yield_amount: data.yield_amount,
          yield_unit: data.yield_unit,
          profit_margin: data.profit_margin,
          labor_cost: data.labor_cost,
          energy_cost: data.energy_cost,
          packaging_cost: data.packaging_cost,
          transport_cost: data.transport_cost,
          ingredients_cost: data.ingredients_cost,
          production_cost: data.production_cost,
          suggested_price: data.suggested_price,
          category: data.category,
        })
        .eq("id", id);
      
      if (recipeError) throw recipeError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from("recipe_items")
        .delete()
        .eq("recipe_id", id);
      
      if (deleteError) throw deleteError;

      // Create new items
      if (data.items.length > 0) {
        const itemsToInsert = data.items
          .filter(item => item.ingredient_name.trim())
          .map(item => ({
            recipe_id: id,
            ingredient_name: item.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            package_price: item.package_price,
            package_size: item.package_size,
            package_unit: item.package_unit,
            calculated_cost: item.calculated_cost,
          }));

        if (itemsToInsert.length > 0) {
          const { error: itemsError } = await supabase
            .from("recipe_items")
            .insert(itemsToInsert);
          
          if (itemsError) throw itemsError;
        }
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      toast.success("Receita atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      toast.error("Erro ao atualizar receita. Tente novamente.");
    },
  });

  // Delete recipe mutation
  const deleteRecipe = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receita excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      toast.error("Erro ao excluir receita. Tente novamente.");
    },
  });

  // Duplicate recipe mutation
  const duplicateRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Fetch original recipe
      const { data: original, error: fetchError } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId)
        .single();
      
      if (fetchError) throw fetchError;

      // Fetch original items
      const { data: originalItems, error: itemsFetchError } = await supabase
        .from("recipe_items")
        .select("*")
        .eq("recipe_id", recipeId);
      
      if (itemsFetchError) throw itemsFetchError;

      // Create new recipe
      const { data: newRecipe, error: createError } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
          name: `${original.name} (Cópia)`,
          description: original.description,
          image_url: original.image_url,
          yield_amount: original.yield_amount,
          yield_unit: original.yield_unit,
          profit_margin: original.profit_margin,
          labor_cost: original.labor_cost,
          energy_cost: original.energy_cost,
          packaging_cost: original.packaging_cost,
          transport_cost: original.transport_cost,
          ingredients_cost: original.ingredients_cost,
          production_cost: original.production_cost,
          suggested_price: original.suggested_price,
          category: original.category,
        })
        .select()
        .single();
      
      if (createError) throw createError;

      // Create new items
      if (originalItems && originalItems.length > 0) {
        const newItems = originalItems.map(item => ({
          recipe_id: newRecipe.id,
          ingredient_name: item.ingredient_name,
          quantity: item.quantity,
          unit: item.unit,
          package_price: item.package_price,
          package_size: item.package_size,
          package_unit: item.package_unit,
          calculated_cost: item.calculated_cost,
        }));

        const { error: itemsError } = await supabase
          .from("recipe_items")
          .insert(newItems);
        
        if (itemsError) throw itemsError;
      }

      return newRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receita duplicada com sucesso!");
    },
    onError: (error) => {
      console.error("Error duplicating recipe:", error);
      toast.error("Erro ao duplicar receita. Tente novamente.");
    },
  });

  return {
    recipes: recipesQuery.data || [],
    isLoading: recipesQuery.isLoading,
    error: recipesQuery.error,
    useRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    duplicateRecipe,
  };
}
