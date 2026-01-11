import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Loader2 } from "lucide-react";
import { CatalogSettings } from "@/hooks/useCatalogSettings";

interface CatalogBrandingProps {
  settings: CatalogSettings;
  onChange: (settings: Partial<CatalogSettings>) => void;
  onUploadLogo: (file: File) => void;
  onUploadBanner: (file: File) => void;
  onDeleteLogo: () => void;
  onDeleteBanner: () => void;
  isUploadingLogo?: boolean;
  isUploadingBanner?: boolean;
}

export function CatalogBranding({
  settings,
  onChange,
  onUploadLogo,
  onUploadBanner,
  onDeleteLogo,
  onDeleteBanner,
  isUploadingLogo,
  isUploadingBanner,
}: CatalogBrandingProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("O logo deve ter no máximo 2MB");
        return;
      }
      onUploadLogo(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("O banner deve ter no máximo 5MB");
        return;
      }
      onUploadBanner(file);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">📸 Branding</h3>

      {/* Logo */}
      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          {settings.catalog_logo_url ? (
            <div className="relative">
              <img
                src={settings.catalog_logo_url}
                alt="Logo"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={onDeleteLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => logoInputRef.current?.click()}
            >
              {isUploadingLogo ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
            >
              {isUploadingLogo ? "Enviando..." : "Upload Logo"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: 200x200px, máx. 2MB
            </p>
          </div>
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      {/* Banner */}
      <div className="space-y-2">
        <Label>Banner</Label>
        <div className="space-y-2">
          {settings.catalog_banner_url ? (
            <div className="relative">
              <img
                src={settings.catalog_banner_url}
                alt="Banner"
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={onDeleteBanner}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => bannerInputRef.current?.click()}
            >
              {isUploadingBanner ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar um banner
                  </span>
                </>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => bannerInputRef.current?.click()}
            disabled={isUploadingBanner}
          >
            {isUploadingBanner ? "Enviando..." : "Upload Banner"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Recomendado: 1200x400px (3:1), máx. 5MB
          </p>
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp para contato</Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="(11) 99999-9999"
          value={settings.catalog_whatsapp || ""}
          onChange={(e) => onChange({ catalog_whatsapp: e.target.value || null })}
        />
        <p className="text-xs text-muted-foreground">
          Exibe um botão flutuante de WhatsApp no catálogo público
        </p>
      </div>

      {/* Show Prices Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="show-prices">Exibir preços</Label>
          <p className="text-xs text-muted-foreground">
            Mostrar preços dos produtos no catálogo público
          </p>
        </div>
        <Switch
          id="show-prices"
          checked={settings.catalog_show_prices}
          onCheckedChange={(checked) => onChange({ catalog_show_prices: checked })}
        />
      </div>
    </div>
  );
}
