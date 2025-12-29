import { useState } from "react";
import { Plus, Search, CakeSlice, MoreHorizontal, Edit2, Trash2, Copy, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRecipes } from "@/hooks/useRecipes";

export default function Recipes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const { recipes, isLoading, deleteRecipe, duplicateRecipe } = useRecipes();
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/dashboard/receitas/${id}/editar`);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateRecipe.mutateAsync(id);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRecipe.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 50) return "text-success";
    if (margin >= 40) return "text-warning";
    return "text-destructive";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando receitas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Receitas</h1>
          <p className="text-muted-foreground">{recipes.length} receitas cadastradas</p>
        </div>
        <Link to="/dashboard/receitas/nova">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Receita
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar receitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12"
        />
      </div>

      {/* Empty State */}
      {recipes.length === 0 && (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <CakeSlice className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma receita cadastrada</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Comece a precificar suas receitas corretamente criando sua primeira ficha técnica.
            </p>
            <Link to="/dashboard/receitas/nova">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeira Receita
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Recipes Grid */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <Card 
              key={recipe.id}
              className="overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image / Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary-soft to-accent flex items-center justify-center relative">
                {recipe.image_url ? (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CakeSlice className="h-12 w-12 text-primary/50" />
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg shadow-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(recipe.id)} className="gap-2">
                        <Edit2 className="h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDuplicate(recipe.id)} 
                        className="gap-2"
                        disabled={duplicateRecipe.isPending}
                      >
                        <Copy className="h-4 w-4" /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(recipe.id)} 
                        className="gap-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {recipe.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card/90 text-xs font-medium text-foreground">
                    {recipe.category}
                  </span>
                )}
              </div>

              <CardContent className="pt-4">
                <h3 className="font-bold text-foreground mb-1">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Rend: {recipe.yield_amount} {recipe.yield_unit}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Preço</p>
                    <p className="text-lg font-bold text-foreground">
                      R$ {(recipe.suggested_price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Margem</p>
                    <p className={`text-lg font-bold ${getMarginColor(recipe.profit_margin)}`}>
                      {recipe.profit_margin}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir receita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A receita e todos os seus ingredientes serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRecipe.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
