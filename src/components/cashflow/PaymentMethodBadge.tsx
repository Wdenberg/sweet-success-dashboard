import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Smartphone, ArrowRightLeft } from "lucide-react";
import { PaymentMethod } from "@/hooks/useSales";
import { cn } from "@/lib/utils";

const paymentConfig: Record<PaymentMethod, { label: string; icon: typeof CreditCard; className: string }> = {
  pix: { label: "PIX", icon: Smartphone, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  credit_card: { label: "Crédito", icon: CreditCard, className: "bg-blue-100 text-blue-700 border-blue-200" },
  debit_card: { label: "Débito", icon: CreditCard, className: "bg-purple-100 text-purple-700 border-purple-200" },
  cash: { label: "Dinheiro", icon: Banknote, className: "bg-green-100 text-green-700 border-green-200" },
  transfer: { label: "Transferência", icon: ArrowRightLeft, className: "bg-orange-100 text-orange-700 border-orange-200" },
};

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  showIcon?: boolean;
}

export function PaymentMethodBadge({ method, showIcon = true }: PaymentMethodBadgeProps) {
  const config = paymentConfig[method] || paymentConfig.pix;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", config.className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
