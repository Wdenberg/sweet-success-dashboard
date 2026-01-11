import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { useCatalogSettings, CatalogSettings as CatalogSettingsType, DEFAULT_SETTINGS } from "@/hooks/useCatalogSettings";
import { CatalogAppearance } from "@/components/catalog/CatalogAppearance";
import { CatalogBranding } from "@/components/catalog/CatalogBranding";
import { CatalogPreview } from "@/components/catalog/CatalogPreview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CatalogSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    settings,
    isLoading,
    updateSettings,
    uploadLogo,
    uploadBanner,
    deleteLogo,
    deleteBanner,
  } = useCatalogSettings();

  const [localSettings, setLocalSettings] = useState<CatalogSettingsType>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch store name
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("business_name, full_name")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const storeName = profile?.business_name || profile?.full_name || "Minha Loja";

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (newSettings: Partial<CatalogSettingsType>) => {
    setLocalSettings((prev) => ({ ...prev, ...newSettings }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings.mutate(localSettings, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleReset = () => {
    setLocalSettings({
      ...DEFAULT_SETTINGS,
      catalog_logo_url: settings.catalog_logo_url,
      catalog_banner_url: settings.catalog_banner_url,
      catalog_whatsapp: settings.catalog_whatsapp,
      catalog_show_prices: settings.catalog_show_prices,
    });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/catalogo")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Personalizar Catálogo</h1>
              <p className="text-muted-foreground">
                Customize o visual do seu catálogo público
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar padrões
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateSettings.isPending}
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <CatalogBranding
                  settings={localSettings}
                  onChange={handleChange}
                  onUploadLogo={(file) => uploadLogo.mutate(file)}
                  onUploadBanner={(file) => uploadBanner.mutate(file)}
                  onDeleteLogo={() => deleteLogo.mutate()}
                  onDeleteBanner={() => deleteBanner.mutate()}
                  isUploadingLogo={uploadLogo.isPending}
                  isUploadingBanner={uploadBanner.isPending}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <CatalogAppearance
                  settings={localSettings}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <CatalogPreview settings={localSettings} storeName={storeName} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CatalogSettings;
