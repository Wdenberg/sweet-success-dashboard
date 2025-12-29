import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: "admin" | "confectioner";
  status: "active" | "blocked";
  plan: "free" | "pro" | "business";
  total_recipes: number;
  total_revenue: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  freeUsers: number;
  mrr: number;
  churnRate: number;
  newUsersThisMonth: number;
  totalRecipes: number;
}

// Simulated pricing
const PLAN_PRICES = {
  free: 0,
  pro: 49.90,
  business: 149.90,
};

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

  // Calculate admin stats
  const calculateStats = (): AdminStats => {
    const profiles = profilesQuery.data || [];
    const totalUsers = profiles.length;
    
    // Simulated data for demo - in production, this would come from a subscriptions table
    const proUsersCount = Math.floor(totalUsers * 0.3);
    const businessUsersCount = Math.floor(totalUsers * 0.1);
    const freeUsersCount = totalUsers - proUsersCount - businessUsersCount;
    
    const mrr = (proUsersCount * PLAN_PRICES.pro) + (businessUsersCount * PLAN_PRICES.business);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsersThisMonth = profiles.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length;

    return {
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.85),
      proUsers: proUsersCount,
      freeUsers: freeUsersCount,
      mrr,
      churnRate: 2.3,
      newUsersThisMonth,
      totalRecipes: recipesQuery.data || 0,
    };
  };

  // Transform profiles to admin users
  const getUsers = (): AdminUser[] => {
    const profiles = profilesQuery.data || [];
    
    return profiles.map((profile, index) => ({
      id: profile.user_id,
      email: `user${index + 1}@email.com`, // Simulated since we can't access auth.users
      full_name: profile.full_name,
      created_at: profile.created_at,
      last_sign_in_at: profile.updated_at,
      role: index === 0 ? "admin" as const : "confectioner" as const,
      status: Math.random() > 0.1 ? "active" as const : "blocked" as const,
      plan: index % 3 === 0 ? "pro" as const : index % 5 === 0 ? "business" as const : "free" as const,
      total_recipes: Math.floor(Math.random() * 20),
      total_revenue: Math.floor(Math.random() * 5000),
    }));
  };

  return {
    stats: calculateStats(),
    users: getUsers(),
    isLoading: profilesQuery.isLoading || recipesQuery.isLoading,
    error: profilesQuery.error || recipesQuery.error,
  };
}
