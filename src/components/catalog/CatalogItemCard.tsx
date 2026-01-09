import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, MessageCircle, ImageIcon } from "lucide-react";
import { CatalogItem } from "@/hooks/useCatalog";

interface CatalogItemCardProps {
  item: CatalogItem;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
  onShare: (item: CatalogItem) => void;
}

export const CatalogItemCard = ({
  item,
  onEdit,
  onDelete,
  onShare,
}: CatalogItemCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${!item.is_active ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {!item.is_active && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Inativo
          </Badge>
        )}
        
        {item.category && (
          <Badge className="absolute top-2 right-2 bg-primary/90">
            {item.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
            {item.price !== null && item.price > 0 && (
              <p className="text-lg font-bold text-primary mt-2">
                R$ {item.price.toFixed(2).replace(".", ",")}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(item)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
