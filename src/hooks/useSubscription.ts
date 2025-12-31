import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type SubscriptionStatus = "trial" | "active" | "expired" | "cancelled";

interface SubscriptionData {
  trialEndsAt: Date | null;
  status: SubscriptionStatus;
  daysRemaining: number;
  isTrialActive: boolean;
  isExpired: boolean;
  isActive: boolean;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<SubscriptionData> => {
      if (!user) {
        return {
          trialEndsAt: null,
          status: "expired",
          daysRemaining: 0,
          isTrialActive: false,
          isExpired: true,
          isActive: false,
        };
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      const trialEndsAt = profile?.trial_ends_at
        ? new Date(profile.trial_ends_at)
        : null;
      const status = (profile?.subscription_status as SubscriptionStatus) || "expired";
      const now = new Date();

      let daysRemaining = 0;
      if (trialEndsAt) {
        const diffTime = trialEndsAt.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      const isTrialActive = status === "trial" && daysRemaining > 0;
      const isExpired = status === "expired" || (status === "trial" && daysRemaining <= 0);
      const isActive = status === "active";

      return {
        trialEndsAt,
        status,
        daysRemaining,
        isTrialActive,
        isExpired,
        isActive,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    subscription: data,
    isLoading,
    error,
    refetch,
    canAccess: data?.isActive || data?.isTrialActive || false,
  };
}
