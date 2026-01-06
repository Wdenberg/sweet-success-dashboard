import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ingredient } from "@/types/recipe";

interface IngredientRowProps {
  ingredient: Ingredient;
  index: number;
  onUpdate: (index: number, field: keyof Ingredient, value: string | number) => void;
  onRemove: (index: number) => void;
  calculatedCost: number;
}

export function IngredientRow({ 
  ingredient, 
  index, 
  onUpdate, 
  onRemove,
  calculatedCost 
}: IngredientRowProps) {
  return (
    <>
      {/* Mobile Layout - Stack vertical */}
      <div 
        className="md:hidden p-4 bg-secondary/30 rounded-xl space-y-3 animate-fade-in" 
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Ex: Farinha de Trigo"
            value={ingredient.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            className="bg-card border-border/50 flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive-soft shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Quantidade Usada</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Qtd"
                value={ingredient.quantity || ''}
                onChange={(e) => onUpdate(index, 'quantity', parseFloat(e.target.value) || 0)}
                className="bg-card border-border/50"
              />
              <Input
                placeholder="g"
                value={ingredient.unit}
                onChange={(e) => onUpdate(index, 'unit', e.target.value)}
                className="bg-card border-border/50 w-16"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Preço do Pacote</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={ingredient.packagePrice || ''}
                onChange={(e) => onUpdate(index, 'packagePrice', parseFloat(e.target.value) || 0)}
                className="bg-card border-border/50 pl-9"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Tamanho do Pacote</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="1000"
                value={ingredient.packageSize || ''}
                onChange={(e) => onUpdate(index, 'packageSize', parseFloat(e.target.value) || 0)}
                className="bg-card border-border/50"
              />
              <Input
                placeholder="g"
                value={ingredient.packageUnit}
                onChange={(e) => onUpdate(index, 'packageUnit', e.target.value)}
                className="bg-card border-border/50 w-16"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Custo Calculado</label>
            <div className="h-10 flex items-center justify-center bg-primary-soft rounded-lg">
              <span className="font-bold text-primary">
                R$ {calculatedCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Grid horizontal */}
      <div 
        className="hidden md:grid grid-cols-12 gap-3 items-center p-4 bg-secondary/30 rounded-xl group hover:bg-secondary/50 transition-colors animate-fade-in" 
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Ingredient Name */}
        <div className="col-span-3">
          <Input
            placeholder="Ex: Farinha de Trigo"
            value={ingredient.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            className="bg-card border-border/50"
          />
        </div>

        {/* Quantity Used */}
        <div className="col-span-1">
          <Input
            type="number"
            step="0.01"
            placeholder="Qtd"
            value={ingredient.quantity || ''}
            onChange={(e) => onUpdate(index, 'quantity', parseFloat(e.target.value) || 0)}
            className="bg-card border-border/50 text-center"
          />
        </div>

        {/* Unit */}
        <div className="col-span-1">
          <Input
            placeholder="g"
            value={ingredient.unit}
            onChange={(e) => onUpdate(index, 'unit', e.target.value)}
            className="bg-card border-border/50 text-center"
          />
        </div>

        {/* Package Price */}
        <div className="col-span-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={ingredient.packagePrice || ''}
              onChange={(e) => onUpdate(index, 'packagePrice', parseFloat(e.target.value) || 0)}
              className="bg-card border-border/50 pl-9"
            />
          </div>
        </div>

        {/* Package Size */}
        <div className="col-span-1">
          <Input
            type="number"
            step="0.01"
            placeholder="1000"
            value={ingredient.packageSize || ''}
            onChange={(e) => onUpdate(index, 'packageSize', parseFloat(e.target.value) || 0)}
            className="bg-card border-border/50 text-center"
          />
        </div>

        {/* Package Unit */}
        <div className="col-span-1">
          <Input
            placeholder="g"
            value={ingredient.packageUnit}
            onChange={(e) => onUpdate(index, 'packageUnit', e.target.value)}
            className="bg-card border-border/50 text-center"
          />
        </div>

        {/* Calculated Cost */}
        <div className="col-span-2 flex items-center justify-between">
          <div className="flex-1 text-right pr-3">
            <span className="text-sm font-bold text-foreground">
              R$ {calculatedCost.toFixed(2)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive-soft opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
