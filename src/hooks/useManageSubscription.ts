import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];

interface UpdateSubscriptionParams {
  userId: string;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;
}

export function useManageSubscription() {
  const queryClient = useQueryClient();

  const updateSubscription = useMutation({
    mutationFn: async ({ userId, status, trialEndsAt }: UpdateSubscriptionParams) => {
      const updateData: { subscription_status: SubscriptionStatus; trial_ends_at?: string | null } = {
        subscription_status: status,
      };

      if (trialEndsAt !== undefined) {
        updateData.trial_ends_at = trialEndsAt;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
  });

  const activateSubscription = async (userId: string) => {
    try {
      await updateSubscription.mutateAsync({
        userId,
        status: "active",
        trialEndsAt: null,
      });
      toast.success("Assinatura ativada com sucesso!");
    } catch (error) {
      toast.error("Erro ao ativar assinatura");
      console.error(error);
    }
  };

  const expireSubscription = async (userId: string) => {
    try {
      await updateSubscription.mutateAsync({
        userId,
        status: "expired",
      });
      toast.success("Assinatura expirada com sucesso!");
    } catch (error) {
      toast.error("Erro ao expirar assinatura");
      console.error(error);
    }
  };

  const cancelSubscription = async (userId: string) => {
    try {
      await updateSubscription.mutateAsync({
        userId,
        status: "cancelled",
      });
      toast.success("Assinatura cancelada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cancelar assinatura");
      console.error(error);
    }
  };

  const renewTrial = async (userId: string, days: number) => {
    try {
      const newTrialEnd = new Date();
      newTrialEnd.setDate(newTrialEnd.getDate() + days);

      await updateSubscription.mutateAsync({
        userId,
        status: "trial",
        trialEndsAt: newTrialEnd.toISOString(),
      });
      toast.success(`Trial renovado por ${days} dias!`);
    } catch (error) {
      toast.error("Erro ao renovar trial");
      console.error(error);
    }
  };

  const extendSubscription = async (userId: string, days: number) => {
    try {
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + days);

      await updateSubscription.mutateAsync({
        userId,
        status: "active",
        trialEndsAt: newEndDate.toISOString(),
      });
      toast.success(`Assinatura estendida por ${days} dias!`);
    } catch (error) {
      toast.error("Erro ao estender assinatura");
      console.error(error);
    }
  };

  return {
    activateSubscription,
    expireSubscription,
    cancelSubscription,
    renewTrial,
    extendSubscription,
    isLoading: updateSubscription.isPending,
  };
}
