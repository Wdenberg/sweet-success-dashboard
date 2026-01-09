import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, ImageIcon, Loader2 } from "lucide-react";
import { useCatalog, CatalogItem, CATALOG_CATEGORIES } from "@/hooks/useCatalog";
import { CatalogItemCard } from "@/components/catalog/CatalogItemCard";
import { CatalogItemDialog } from "@/components/catalog/CatalogItemDialog";
import { WhatsAppShareDialog } from "@/components/catalog/WhatsAppShareDialog";
import { DeleteCatalogItemDialog } from "@/components/catalog/DeleteCatalogItemDialog";

const Catalog = () => {
  const { items, isLoading, deleteItem } = useCatalog();
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharingItem, setSharingItem] = useState<CatalogItem | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);

  const filteredItems = items?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && item.is_active) ||
      (statusFilter === "inactive" && !item.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleShare = (item: CatalogItem) => {
    setSharingItem(item);
    setShareDialogOpen(true);
  };

  const handleDelete = (item: CatalogItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      await deleteItem.mutateAsync(deletingItem);
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meu Catálogo</h1>
            <p className="text-muted-foreground">
              {items?.length || 0} produto{items?.length !== 1 ? "s" : ""} cadastrado{items?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={handleNewItem}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATALOG_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {items?.length === 0 
                ? "Nenhum produto cadastrado"
                : "Nenhum produto encontrado"
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {items?.length === 0 
                ? "Comece adicionando seus produtos ao catálogo"
                : "Tente ajustar os filtros de busca"
              }
            </p>
            {items?.length === 0 && (
              <Button onClick={handleNewItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems?.map((item) => (
              <CatalogItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CatalogItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
      />

      <WhatsAppShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        item={sharingItem}
      />

      <DeleteCatalogItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
};

export default Catalog;
