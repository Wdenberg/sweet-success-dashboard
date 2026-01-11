import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CatalogSettings, COLOR_THEMES } from "@/hooks/useCatalogSettings";

interface CatalogAppearanceProps {
  settings: CatalogSettings;
  onChange: (settings: Partial<CatalogSettings>) => void;
}

export function CatalogAppearance({ settings, onChange }: CatalogAppearanceProps) {
  const applyTheme = (theme: typeof COLOR_THEMES[0]) => {
    onChange({
      catalog_primary_color: theme.primary,
      catalog_secondary_color: theme.secondary,
      catalog_background_color: theme.background,
      catalog_text_color: theme.text,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">🎨 Cores</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor primária</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.catalog_primary_color}
                  onChange={(e) => onChange({ catalog_primary_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.catalog_primary_color}
                  onChange={(e) => onChange({ catalog_primary_color: e.target.value })}
                  className="flex-1"
                  placeholder="#EC4899"
                />
              </div>
              <p className="text-xs text-muted-foreground">Botões, preços e destaques</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={settings.catalog_secondary_color}
                  onChange={(e) => onChange({ catalog_secondary_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.catalog_secondary_color}
                  onChange={(e) => onChange({ catalog_secondary_color: e.target.value })}
                  className="flex-1"
                  placeholder="#F472B6"
                />
              </div>
              <p className="text-xs text-muted-foreground">Elementos secundários</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="background-color">Cor de fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="background-color"
                  type="color"
                  value={settings.catalog_background_color}
                  onChange={(e) => onChange({ catalog_background_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.catalog_background_color}
                  onChange={(e) => onChange({ catalog_background_color: e.target.value })}
                  className="flex-1"
                  placeholder="#FFFFFF"
                />
              </div>
              <p className="text-xs text-muted-foreground">Fundo da página</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Cor do texto</Label>
              <div className="flex gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={settings.catalog_text_color}
                  onChange={(e) => onChange({ catalog_text_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.catalog_text_color}
                  onChange={(e) => onChange({ catalog_text_color: e.target.value })}
                  className="flex-1"
                  placeholder="#1F2937"
                />
              </div>
              <p className="text-xs text-muted-foreground">Textos principais</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Temas prontos</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_THEMES.map((theme) => (
            <Button
              key={theme.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTheme(theme)}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: theme.primary }}
              />
              {theme.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
