import { useState } from "react";
import { Plus, Search, CakeSlice, MoreHorizontal, Edit2, Trash2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
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

const recipes = [
  { 
    id: 1, 
    name: "Bolo Red Velvet", 
    price: 180.00, 
    yield: "2kg", 
    margin: 48,
    cost: 93.60,
    image: null,
    category: "Bolos"
  },
  { 
    id: 2, 
    name: "Cupcakes de Morango", 
    price: 8.50, 
    yield: "1 un", 
    margin: 52,
    cost: 4.08,
    image: null,
    category: "Cupcakes"
  },
  { 
    id: 3, 
    name: "Torta de Limão", 
    price: 95.00, 
    yield: "1.5kg", 
    margin: 41,
    cost: 56.05,
    image: null,
    category: "Tortas"
  },
  { 
    id: 4, 
    name: "Brigadeiro Gourmet", 
    price: 3.20, 
    yield: "1 un", 
    margin: 65,
    cost: 1.12,
    image: null,
    category: "Doces"
  },
  { 
    id: 5, 
    name: "Bolo de Chocolate", 
    price: 120.00, 
    yield: "1.5kg", 
    margin: 45,
    cost: 66.00,
    image: null,
    category: "Bolos"
  },
  { 
    id: 6, 
    name: "Cheesecake de Frutas", 
    price: 150.00, 
    yield: "1kg", 
    margin: 55,
    cost: 67.50,
    image: null,
    category: "Tortas"
  },
];

export default function Recipes() {
  const [search, setSearch] = useState("");
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Recipes Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredRecipes.map((recipe, index) => (
          <Card 
            key={recipe.id}
            className="overflow-hidden group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image / Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary-soft to-accent flex items-center justify-center relative">
              <CakeSlice className="h-12 w-12 text-primary/50" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg shadow-md">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit2 className="h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Copy className="h-4 w-4" /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card/90 text-xs font-medium text-foreground">
                {recipe.category}
              </span>
            </div>

            <CardContent className="pt-4">
              <h3 className="font-bold text-foreground mb-1">{recipe.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Rend: {recipe.yield}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Preço</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ {recipe.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Margem</p>
                  <p className={`text-lg font-bold ${
                    recipe.margin >= 50 ? "text-success" : 
                    recipe.margin >= 40 ? "text-warning" : 
                    "text-destructive"
                  }`}>
                    {recipe.margin}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
