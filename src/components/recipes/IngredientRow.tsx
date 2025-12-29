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
    <div className="grid grid-cols-12 gap-3 items-center p-4 bg-secondary/30 rounded-xl group hover:bg-secondary/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
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
  );
}
