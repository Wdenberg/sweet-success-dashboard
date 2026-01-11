import { Cake } from "lucide-react";
import { CatalogSettings } from "@/hooks/useCatalogSettings";

interface CatalogPreviewProps {
  settings: CatalogSettings;
  storeName: string;
}

export function CatalogPreview({ settings, storeName }: CatalogPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">👁️ Preview</h3>
      
      <div
        className="rounded-lg border overflow-hidden shadow-sm"
        style={{ backgroundColor: settings.catalog_background_color }}
      >
        {/* Banner */}
        {settings.catalog_banner_url ? (
          <div className="h-20 overflow-hidden">
            <img
              src={settings.catalog_banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="h-12"
            style={{
              background: `linear-gradient(135deg, ${settings.catalog_primary_color}, ${settings.catalog_secondary_color})`,
            }}
          />
        )}

        {/* Header */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            {settings.catalog_logo_url ? (
              <img
                src={settings.catalog_logo_url}
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings.catalog_primary_color }}
              >
                <Cake className="h-4 w-4 text-white" />
              </div>
            )}
            <div>
              <h4
                className="text-sm font-semibold leading-tight"
                style={{ color: settings.catalog_text_color }}
              >
                {storeName || "Minha Loja"}
              </h4>
              <p
                className="text-xs opacity-70"
                style={{ color: settings.catalog_text_color }}
              >
                4 produtos
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-md border overflow-hidden"
                style={{ backgroundColor: settings.catalog_background_color }}
              >
                <div className="h-12 bg-muted" />
                <div className="p-1.5">
                  <div
                    className="h-2 rounded mb-1"
                    style={{
                      backgroundColor: settings.catalog_text_color,
                      opacity: 0.2,
                      width: "70%",
                    }}
                  />
                  {settings.catalog_show_prices && (
                    <div
                      className="text-xs font-semibold"
                      style={{ color: settings.catalog_primary_color }}
                    >
                      R$ 99
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Button Preview */}
        {settings.catalog_whatsapp && (
          <div className="p-3 pt-0 flex justify-end">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: "#25D366" }}
            >
              📱
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
