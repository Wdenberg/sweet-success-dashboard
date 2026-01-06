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
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-card border-t border-border shadow-lg z-30">
      <div className="container py-3 md:py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {/* Production Cost */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-warning-soft flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground truncate">Custo</p>
              <p className="text-base md:text-xl font-bold text-foreground truncate">
                R$ {calculation.productionCost.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Profit */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground truncate">Lucro</p>
              <p className="text-base md:text-xl font-bold text-primary truncate">
                R$ {calculation.profitAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Price per Unit - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">Preço por {yieldUnit}</p>
              <p className="text-xl font-bold text-foreground truncate">
                R$ {(yieldAmount > 0 ? calculation.suggestedPrice / yieldAmount : 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Suggested Price - Highlighted */}
          <Card className="bg-success text-white border-0 shadow-lg col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-white/80 truncate">Preço Sugerido</p>
                <p className="text-lg md:text-2xl font-bold text-white truncate">
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
