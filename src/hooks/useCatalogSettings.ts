import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CatalogSettings {
  catalog_logo_url: string | null;
  catalog_banner_url: string | null;
  catalog_primary_color: string;
  catalog_secondary_color: string;
  catalog_background_color: string;
  catalog_text_color: string;
  catalog_show_prices: boolean;
  catalog_whatsapp: string | null;
}

export const DEFAULT_SETTINGS: CatalogSettings = {
  catalog_logo_url: null,
  catalog_banner_url: null,
  catalog_primary_color: "#EC4899",
  catalog_secondary_color: "#F472B6",
  catalog_background_color: "#FFFFFF",
  catalog_text_color: "#1F2937",
  catalog_show_prices: true,
  catalog_whatsapp: null,
};

export const COLOR_THEMES = [
  {
    name: "Rosa",
    primary: "#EC4899",
    secondary: "#F472B6",
    background: "#FDF2F8",
    text: "#1F2937",
  },
  {
    name: "Azul",
    primary: "#3B82F6",
    secondary: "#60A5FA",
    background: "#EFF6FF",
    text: "#1F2937",
  },
  {
    name: "Verde",
    primary: "#10B981",
    secondary: "#34D399",
    background: "#ECFDF5",
    text: "#1F2937",
  },
  {
    name: "Neutro",
    primary: "#6B7280",
    secondary: "#9CA3AF",
    background: "#F9FAFB",
    text: "#1F2937",
  },
  {
    name: "Escuro",
    primary: "#F59E0B",
    secondary: "#FBBF24",
    background: "#1F2937",
    text: "#F9FAFB",
  },
];

export function useCatalogSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["catalog-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return DEFAULT_SETTINGS;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "catalog_logo_url, catalog_banner_url, catalog_primary_color, catalog_secondary_color, catalog_background_color, catalog_text_color, catalog_show_prices, catalog_whatsapp"
        )
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      return {
        catalog_logo_url: data.catalog_logo_url,
        catalog_banner_url: data.catalog_banner_url,
        catalog_primary_color: data.catalog_primary_color || DEFAULT_SETTINGS.catalog_primary_color,
        catalog_secondary_color: data.catalog_secondary_color || DEFAULT_SETTINGS.catalog_secondary_color,
        catalog_background_color: data.catalog_background_color || DEFAULT_SETTINGS.catalog_background_color,
        catalog_text_color: data.catalog_text_color || DEFAULT_SETTINGS.catalog_text_color,
        catalog_show_prices: data.catalog_show_prices ?? DEFAULT_SETTINGS.catalog_show_prices,
        catalog_whatsapp: data.catalog_whatsapp,
      } as CatalogSettings;
    },
    enabled: !!user?.id,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<CatalogSettings>) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update(newSettings)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-settings", user?.id] });
      toast.success("Configurações salvas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao salvar configurações");
    },
  });

  const uploadImage = async (file: File, type: "logo" | "banner"): Promise<string> => {
    if (!user?.id) throw new Error("Usuário não autenticado");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("catalog")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("catalog")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const uploadLogo = useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadImage(file, "logo");
      await updateSettings.mutateAsync({ catalog_logo_url: url });
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-settings", user?.id] });
    },
    onError: () => {
      toast.error("Erro ao fazer upload do logo");
    },
  });

  const uploadBanner = useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadImage(file, "banner");
      await updateSettings.mutateAsync({ catalog_banner_url: url });
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-settings", user?.id] });
    },
    onError: () => {
      toast.error("Erro ao fazer upload do banner");
    },
  });

  const deleteLogo = useMutation({
    mutationFn: async () => {
      await updateSettings.mutateAsync({ catalog_logo_url: null });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async () => {
      await updateSettings.mutateAsync({ catalog_banner_url: null });
    },
  });

  return {
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    updateSettings,
    uploadLogo,
    uploadBanner,
    deleteLogo,
    deleteBanner,
  };
}
