import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionType = "activate" | "expire" | "cancel" | "renew" | "extend";

interface SubscriptionActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ActionType;
  userName: string;
  onConfirm: (days?: number) => void;
  isLoading?: boolean;
}

const actionConfig: Record<ActionType, { title: string; description: string; requiresDays: boolean; buttonText: string; buttonVariant: "default" | "destructive" }> = {
  activate: {
    title: "Ativar Assinatura",
    description: "Tem certeza que deseja ativar a assinatura de",
    requiresDays: false,
    buttonText: "Ativar",
    buttonVariant: "default",
  },
  expire: {
    title: "Expirar Assinatura",
    description: "Tem certeza que deseja expirar a assinatura de",
    requiresDays: false,
    buttonText: "Expirar",
    buttonVariant: "destructive",
  },
  cancel: {
    title: "Cancelar Assinatura",
    description: "Tem certeza que deseja cancelar a assinatura de",
    requiresDays: false,
    buttonText: "Cancelar Assinatura",
    buttonVariant: "destructive",
  },
  renew: {
    title: "Renovar Trial",
    description: "Renovar o período de trial de",
    requiresDays: true,
    buttonText: "Renovar",
    buttonVariant: "default",
  },
  extend: {
    title: "Estender Assinatura",
    description: "Estender a assinatura de",
    requiresDays: true,
    buttonText: "Estender",
    buttonVariant: "default",
  },
};

export function SubscriptionActionDialog({
  open,
  onOpenChange,
  action,
  userName,
  onConfirm,
  isLoading,
}: SubscriptionActionDialogProps) {
  const [days, setDays] = useState<number>(15);
  const config = actionConfig[action];

  const handleConfirm = () => {
    if (config.requiresDays) {
      onConfirm(days);
    } else {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            {config.description} <strong>{userName}</strong>?
          </DialogDescription>
        </DialogHeader>

        {config.requiresDays && (
          <div className="space-y-2 py-4">
            <Label htmlFor="days">Número de dias</Label>
            <Input
              id="days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
