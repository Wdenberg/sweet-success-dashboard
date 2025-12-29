import { TrendingUp, DollarSign, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RecipeCalculation } from "@/types/recipe";

interface PriceSummaryProps {
  calculation: RecipeCalculation;
  yieldAmount: number;
  yieldUnit: string;
}

export function PriceSummary({ calculation, yieldAmount, yieldUnit }: PriceSummaryProps) {
  return (
    <div className="fixed bottom-0 left-64 right-0 bg-card border-t border-border shadow-lg z-30">
      <div className="container py-4">
        <div className="grid grid-cols-4 gap-6">
          {/* Production Cost */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning-soft flex items-center justify-center">
              <Package className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo de Produção</p>
              <p className="text-xl font-bold text-foreground">
                R$ {calculation.productionCost.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Profit */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Estimado</p>
              <p className="text-xl font-bold text-primary">
                R$ {calculation.profitAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Price per Unit */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preço por {yieldUnit}</p>
              <p className="text-xl font-bold text-foreground">
                R$ {(yieldAmount > 0 ? calculation.suggestedPrice / yieldAmount : 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Suggested Price - Highlighted */}
          <Card className="bg-success text-white border-0 shadow-lg">
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Preço Sugerido</p>
                <p className="text-2xl font-bold text-white">
                  R$ {calculation.suggestedPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
