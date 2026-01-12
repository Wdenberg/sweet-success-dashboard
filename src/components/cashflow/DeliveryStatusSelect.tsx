import { Clock, ChefHat, CheckCircle, Truck, XCircle } from "lucide-react";
import { DeliveryStatus } from "@/hooks/useSales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusConfig: Record<DeliveryStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pendente", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  in_production: { label: "Em Produção", icon: ChefHat, className: "bg-blue-100 text-blue-700 border-blue-200" },
  ready: { label: "Pronto", icon: CheckCircle, className: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Entregue", icon: Truck, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelado", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
};

const statusOptions: DeliveryStatus[] = ["pending", "in_production", "ready", "delivered", "cancelled"];

interface DeliveryStatusSelectProps {
  saleId: string;
  currentStatus: DeliveryStatus;
  onStatusChange: (saleId: string, newStatus: DeliveryStatus) => void;
  disabled?: boolean;
}

export function DeliveryStatusSelect({ 
  saleId, 
  currentStatus, 
  onStatusChange,
  disabled = false 
}: DeliveryStatusSelectProps) {
  const currentConfig = statusConfig[currentStatus] || statusConfig.pending;
  const CurrentIcon = currentConfig.icon;

  const handleChange = (value: string) => {
    if (value !== currentStatus) {
      onStatusChange(saleId, value as DeliveryStatus);
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger 
        className={cn(
          "h-7 w-[140px] gap-1 text-xs font-medium border rounded-full px-2",
          currentConfig.className,
          "hover:opacity-80 transition-opacity"
        )}
      >
        <CurrentIcon className="h-3 w-3 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 z-50">
        {statusOptions.map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <SelectItem 
              key={status} 
              value={status}
              className="text-xs"
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-3 w-3", status === currentStatus && "text-primary")} />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
