import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, CheckCircle, Truck, XCircle } from "lucide-react";
import { DeliveryStatus } from "@/hooks/useSales";
import { cn } from "@/lib/utils";

const statusConfig: Record<DeliveryStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pendente", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  in_production: { label: "Em Produção", icon: ChefHat, className: "bg-blue-100 text-blue-700 border-blue-200" },
  ready: { label: "Pronto", icon: CheckCircle, className: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Entregue", icon: Truck, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelado", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
};

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  showIcon?: boolean;
}

export function DeliveryStatusBadge({ status, showIcon = true }: DeliveryStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", config.className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
