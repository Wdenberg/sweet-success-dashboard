import { Clock, MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function TrialExpired() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContact = () => {
    const message = encodeURIComponent(
      `Olá! Sou ${user?.email} e gostaria de ativar minha assinatura do app.`
    );
    window.open(`https://wa.me/5581999657171?text=${message}`, "_blank");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Período de Avaliação Encerrado</CardTitle>
          <CardDescription className="text-base">
            Seu período gratuito de 15 dias chegou ao fim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Para continuar usando o app:</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Entre em contato conosco pelo WhatsApp</li>
              <li>Escolha o plano ideal para você</li>
              <li>Efetue o pagamento</li>
              <li>Seu acesso será liberado em instantes</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button onClick={handleContact} className="w-full" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar no WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Dúvidas? Entre em contato que teremos prazer em ajudar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
