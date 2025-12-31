import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireActiveSubscription?: boolean;
}

export function ProtectedRoute({ children, requireActiveSubscription = true }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading, canAccess } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check subscription status
  if (requireActiveSubscription && subscription && !canAccess) {
    return <Navigate to="/dashboard/trial-expirado" replace />;
  }

  return <>{children}</>;
}
