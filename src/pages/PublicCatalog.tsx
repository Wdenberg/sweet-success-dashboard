import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, Store } from "lucide-react";

const PublicCatalog = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("business_name, full_name")
        .eq("user_id", userId)
        .single();
      
      if (error) return null;
      return data;
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

  const storeName = profile?.business_name || profile?.full_name || "Catálogo";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{storeName}</h1>
              <p className="text-sm text-muted-foreground">
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
                      variant="secondary"
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                    >
                      {item.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.price && (
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum produto disponível
            </h2>
            <p className="text-muted-foreground">
              Este catálogo ainda não possui produtos cadastrados.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Catálogo criado com ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicCatalog;
