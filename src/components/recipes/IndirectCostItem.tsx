import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { IndirectCost } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface IndirectCostItemProps {
  cost: IndirectCost;
  onToggle: (id: string) => void;
  onValueChange: (id: string, value: number) => void;
}

export function IndirectCostItem({ cost, onToggle, onValueChange }: IndirectCostItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
      cost.enabled 
        ? "bg-primary-soft/50 border-primary/30" 
        : "bg-secondary/30 border-transparent"
    )}>
      <div className="flex items-center gap-3">
        <Switch
          checked={cost.enabled}
          onCheckedChange={() => onToggle(cost.id)}
        />
        <span className={cn(
          "font-medium transition-colors",
          cost.enabled ? "text-foreground" : "text-muted-foreground"
        )}>
          {cost.name}
        </span>
      </div>
      <div className="w-32">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
          <Input
            type="number"
            step="0.01"
            value={cost.value || ''}
            onChange={(e) => onValueChange(cost.id, parseFloat(e.target.value) || 0)}
            disabled={!cost.enabled}
            className={cn(
              "pl-9 text-right",
              !cost.enabled && "opacity-50"
            )}
          />
        </div>
      </div>
    </div>
  );
}
