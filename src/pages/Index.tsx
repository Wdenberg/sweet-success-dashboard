import { useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat, ArrowRight, Calculator, ShoppingCart, Users, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calculator,
    title: "Calculadora de Preços",
    description: "Precifique suas receitas com precisão, incluindo todos os custos e margem de lucro.",
  },
  {
    icon: ShoppingCart,
    title: "Lista de Compras",
    description: "Organize suas compras por categoria e envie direto no WhatsApp.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Acompanhe seus clientes, pedidos e histórico de compras.",
  },
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-pink">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DoceGestão</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button className="gap-2">
                Começar Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border p-4 space-y-3">
            <Link to="/auth" className="block">
              <Button variant="ghost" className="w-full">Entrar</Button>
            </Link>
            <Link to="/auth" className="block">
              <Button className="w-full gap-2">
                Começar Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Gestão completa para confeiteiras
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Precifique suas receitas com{" "}
              <span className="text-primary">precisão</span> e{" "}
              <span className="text-primary">simplicidade</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              Chega de cobrar errado! Calcule o preço ideal considerando todos os custos, 
              gerencie sua lista de compras e organize seus clientes em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link to="/dashboard/receitas/nova" className="w-full sm:w-auto">
                <Button size="xl" className="gap-2 w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tudo que você precisa para sua confeitaria
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ferramentas pensadas especialmente para confeiteiras que querem crescer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary-soft flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-pink">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Pronta para transformar sua confeitaria?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto text-sm md:text-base">
              Junte-se a centenas de confeiteiras que já estão precificando corretamente
            </p>
            <Link to="/dashboard">
              <Button size="xl" variant="secondary" className="gap-2 w-full sm:w-auto">
                Começar Gratuitamente
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <ChefHat className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">DoceGestão</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2024 DoceGestão. Feito com 💖 para confeiteiras.
          </p>
        </div>
      </footer>
    </div>
  );
}
