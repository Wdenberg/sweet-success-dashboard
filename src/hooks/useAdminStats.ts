import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  phone: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  subscription_status: SubscriptionStatus | null;
  trial_ends_at: string | null;
  days_remaining: number | null;
  is_trial_active: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  expiredUsers: number;
  cancelledUsers: number;
  newUsersThisMonth: number;
  totalRecipes: number;
}

export function useAdminStats() {
  const { user } = useAuth();

  // Fetch all profiles for admin
  const profilesQuery = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all recipes count
  const recipesQuery = useQuery({
    queryKey: ["admin-recipes-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("recipes")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Calculate admin stats from real data
  const calculateStats = (): AdminStats => {
    const profiles = profilesQuery.data || [];
    const totalUsers = profiles.length;
    
    const trialUsers = profiles.filter(p => p.subscription_status === "trial").length;
    const activeUsers = profiles.filter(p => p.subscription_status === "active").length;
    const expiredUsers = profiles.filter(p => p.subscription_status === "expired").length;
    const cancelledUsers = profiles.filter(p => p.subscription_status === "cancelled").length;
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsersThisMonth = profiles.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length;

    return {
      totalUsers,
      activeUsers,
      trialUsers,
      expiredUsers,
      cancelledUsers,
      newUsersThisMonth,
      totalRecipes: recipesQuery.data || 0,
    };
  };

  // Transform profiles to admin users with real data
  const getUsers = (): AdminUser[] => {
    const profiles = profilesQuery.data || [];
    const now = new Date();
    
    return profiles.map((profile, index) => {
      const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      const daysRemaining = trialEndsAt 
        ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      const isTrialActive = profile.subscription_status === "trial" && 
        trialEndsAt !== null && 
        trialEndsAt > now;

      return {
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email || "Sem Email", // Placeholder since we can't access auth.users
        phone: profile.phone || "Sem Telefone", // Placeholder since we can't access auth.users
        full_name: profile.full_name,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        subscription_status: profile.subscription_status,
        trial_ends_at: profile.trial_ends_at,
        days_remaining: daysRemaining,
        is_trial_active: isTrialActive,
      };
    });
  };

  return {
    stats: calculateStats(),
    users: getUsers(),
    isLoading: profilesQuery.isLoading || recipesQuery.isLoading,
    error: profilesQuery.error || recipesQuery.error,
    refetch: () => {
      profilesQuery.refetch();
      recipesQuery.refetch();
    },
  };
}
