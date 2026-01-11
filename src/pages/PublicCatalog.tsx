import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, Store, MessageCircle } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/hooks/useCatalogSettings";

const PublicCatalog = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      // Use secure RPC function that only exposes catalog-related fields
      const { data, error } = await supabase
        .rpc("get_public_catalog_profile", { p_user_id: userId });
      
      if (error || !data || data.length === 0) return null;
      return data[0];
    },
    enabled: !!userId,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ["public-catalog", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const storeName = profile?.business_name || "Catálogo";
  
  // Get customization settings with defaults
  const settings = {
    logo: profile?.catalog_logo_url,
    banner: profile?.catalog_banner_url,
    primaryColor: profile?.catalog_primary_color || DEFAULT_SETTINGS.catalog_primary_color,
    secondaryColor: profile?.catalog_secondary_color || DEFAULT_SETTINGS.catalog_secondary_color,
    backgroundColor: profile?.catalog_background_color || DEFAULT_SETTINGS.catalog_background_color,
    textColor: profile?.catalog_text_color || DEFAULT_SETTINGS.catalog_text_color,
    showPrices: profile?.catalog_show_prices ?? DEFAULT_SETTINGS.catalog_show_prices,
    whatsapp: profile?.catalog_whatsapp,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    if (settings.whatsapp) {
      const cleanNumber = settings.whatsapp.replace(/\D/g, "");
      const fullNumber = cleanNumber.startsWith("55") ? cleanNumber : `55${cleanNumber}`;
      window.open(`https://wa.me/${fullNumber}`, "_blank");
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Catálogo não encontrado
          </h1>
          <p className="text-muted-foreground">
            O link que você acessou não é válido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Banner */}
      {settings.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden">
          <img
            src={settings.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header 
        className="sticky top-0 z-10 border-b"
        style={{ 
          backgroundColor: settings.backgroundColor,
          borderColor: `${settings.textColor}20`,
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={storeName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${settings.primaryColor}20` }}
              >
                <Store className="h-6 w-6" style={{ color: settings.primaryColor }} />
              </div>
            )}
            <div>
              <h1 
                className="text-2xl font-bold"
                style={{ color: settings.textColor }}
              >
                {storeName}
              </h1>
              <p 
                className="text-sm"
                style={{ color: `${settings.textColor}99` }}
              >
                {items?.length || 0} produto{items?.length !== 1 ? "s" : ""} disponíve{items?.length !== 1 ? "is" : "l"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: settings.backgroundColor }}
              >
                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {item.category && (
                    <Badge
                      className="absolute top-3 left-3 backdrop-blur-sm"
                      style={{ 
                        backgroundColor: `${settings.backgroundColor}E6`,
                        color: settings.textColor,
                      }}
                    >
                      {item.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-1 line-clamp-1"
                    style={{ color: settings.textColor }}
                  >
                    {item.name}
                  </h3>
                  {item.description && (
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: `${settings.textColor}99` }}
                    >
                      {item.description}
                    </p>
                  )}
                  {settings.showPrices && item.price && (
                    <p 
                      className="text-xl font-bold"
                      style={{ color: settings.primaryColor }}
                    >
                      {formatPrice(item.price)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Store 
              className="h-16 w-16 mx-auto mb-4"
              style={{ color: `${settings.textColor}66` }}
            />
            <h2 
              className="text-xl font-semibold mb-2"
              style={{ color: settings.textColor }}
            >
              Nenhum produto disponível
            </h2>
            <p style={{ color: `${settings.textColor}99` }}>
              Este catálogo ainda não possui produtos cadastrados.
            </p>
          </div>
        )}
      </main>

      {/* WhatsApp Floating Button */}
      {settings.whatsapp && (
        <button
          onClick={handleWhatsAppClick}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
          style={{ backgroundColor: "#25D366" }}
          aria-label="Contato via WhatsApp"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </button>
      )}

      {/* Footer */}
      <footer 
        className="border-t mt-auto"
        style={{ 
          backgroundColor: settings.backgroundColor,
          borderColor: `${settings.textColor}20`,
        }}
      >
        <div className="container mx-auto px-4 py-6 text-center">
          <p 
            className="text-sm"
            style={{ color: `${settings.textColor}66` }}
          >
            Catálogo criado com ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicCatalog;
