import { Clock, AlertTriangle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

interface TrialBannerProps {
  compact?: boolean;
}

export function TrialBanner({ compact = false }: TrialBannerProps) {
  const { subscription, isLoading } = useSubscription();

  if (isLoading || !subscription) return null;
  if (subscription.isActive) return null;
  if (!subscription.isTrialActive && !subscription.isExpired) return null;

  const { daysRemaining, isExpired } = subscription;

  const getUrgencyLevel = () => {
    if (isExpired) return "critical";
    if (daysRemaining <= 3) return "high";
    if (daysRemaining <= 7) return "medium";
    return "low";
  };

  const urgency = getUrgencyLevel();

  const urgencyStyles = {
    low: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    medium: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    high: "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400",
    critical: "bg-destructive/10 border-destructive/20 text-destructive",
  };

  const handleContact = () => {
    // WhatsApp com mensagem padrão
    const message = encodeURIComponent(
      "Olá! Gostaria de saber mais sobre os planos de assinatura do app."
    );
    window.open(`https://wa.me/5581999657171?text=${message}`, "_blank");
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm",
          urgencyStyles[urgency]
        )}
      >
        {isExpired ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        <span className="font-medium">
          {isExpired
            ? "Trial expirado"
            : `${daysRemaining} ${daysRemaining === 1 ? "dia" : "dias"} restantes`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border",
        urgencyStyles[urgency]
      )}
    >
      <div className="flex items-center gap-3">
        {isExpired ? (
          <AlertTriangle className="h-5 w-5 shrink-0" />
        ) : (
          <Clock className="h-5 w-5 shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {isExpired
              ? "Seu período de avaliação expirou"
              : `${daysRemaining} ${daysRemaining === 1 ? "dia" : "dias"} restantes do período de avaliação`}
          </p>
          <p className="text-sm opacity-80">
            {isExpired
              ? "Entre em contato para ativar sua assinatura"
              : "Aproveite todos os recursos durante o período de avaliação"}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant={isExpired ? "destructive" : "outline"}
        onClick={handleContact}
        className="shrink-0"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Falar conosco
      </Button>
    </div>
  );
}
