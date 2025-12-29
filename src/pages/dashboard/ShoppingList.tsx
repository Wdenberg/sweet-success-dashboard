import { useState } from "react";
import { Plus, Send, ShoppingCart, Check, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  estimatedPrice: number;
  category: string;
  checked: boolean;
}

const initialItems: ShoppingItem[] = [
  { id: "1", name: "Farinha de Trigo", quantity: "5kg", estimatedPrice: 25.90, category: "Ingredientes Secos", checked: false },
  { id: "2", name: "Açúcar Refinado", quantity: "2kg", estimatedPrice: 8.50, category: "Ingredientes Secos", checked: false },
  { id: "3", name: "Fermento em Pó", quantity: "100g", estimatedPrice: 6.90, category: "Ingredientes Secos", checked: true },
  { id: "4", name: "Leite Integral", quantity: "2L", estimatedPrice: 9.80, category: "Laticínios", checked: false },
  { id: "5", name: "Manteiga sem Sal", quantity: "500g", estimatedPrice: 18.90, category: "Laticínios", checked: false },
  { id: "6", name: "Ovos", quantity: "30 un", estimatedPrice: 22.00, category: "Laticínios", checked: true },
  { id: "7", name: "Chocolate em Pó", quantity: "400g", estimatedPrice: 15.90, category: "Chocolates", checked: false },
  { id: "8", name: "Creme de Leite", quantity: "3 un", estimatedPrice: 12.00, category: "Laticínios", checked: false },
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", estimatedPrice: 0, category: "Ingredientes Secos" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [...new Set(items.map(item => item.category))];

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removido da lista");
  };

  const addItem = () => {
    if (!newItem.name.trim()) {
      toast.error("Digite o nome do item");
      return;
    }
    
    setItems(prev => [...prev, {
      id: crypto.randomUUID(),
      ...newItem,
      checked: false,
    }]);
    setNewItem({ name: "", quantity: "", estimatedPrice: 0, category: "Ingredientes Secos" });
    setIsDialogOpen(false);
    toast.success("Item adicionado!");
  };

  const sendToWhatsApp = () => {
    const uncheckedItems = items.filter(item => !item.checked);
    if (uncheckedItems.length === 0) {
      toast.error("Todos os itens já foram comprados!");
      return;
    }

    const message = `🛒 *Lista de Compras - DoceGestão*\n\n${
      categories.map(category => {
        const categoryItems = uncheckedItems.filter(i => i.category === category);
        if (categoryItems.length === 0) return "";
        return `*${category}*\n${categoryItems.map(i => `☐ ${i.name} - ${i.quantity}`).join("\n")}`;
      }).filter(Boolean).join("\n\n")
    }\n\n💰 Total Estimado: R$ ${uncheckedItems.reduce((sum, i) => sum + i.estimatedPrice, 0).toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const totalPending = items.filter(i => !i.checked).reduce((sum, item) => sum + item.estimatedPrice, 0);
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lista de Compras</h1>
          <p className="text-muted-foreground">{items.length} itens • {checkedCount} comprados</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={sendToWhatsApp} className="gap-2">
            <Send className="h-4 w-4" />
            Enviar no WhatsApp
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nome do Item</Label>
                  <Input
                    placeholder="Ex: Farinha de Trigo"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      placeholder="Ex: 2kg"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço Estimado</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={newItem.estimatedPrice || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, estimatedPrice: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input
                    placeholder="Ex: Laticínios"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <Button onClick={addItem} className="w-full">Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Items List */}
        <div className="col-span-2 space-y-6">
          {categories.map((category, catIndex) => {
            const categoryItems = items.filter(item => item.category === category);
            return (
              <Card key={category} className="animate-fade-in" style={{ animationDelay: `${catIndex * 100}ms` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    {category}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({categoryItems.filter(i => !i.checked).length} pendentes)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                        item.checked 
                          ? "bg-success-soft/50 opacity-60" 
                          : "bg-secondary/30 hover:bg-secondary/50"
                      }`}
                      style={{ animationDelay: `${(catIndex * 100) + (index * 50)}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="h-5 w-5"
                        />
                        <div>
                          <p className={`font-medium ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground">
                          R$ {item.estimatedPrice.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive-soft transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Total de Itens</span>
                <span className="font-semibold text-foreground">{items.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Já Comprados</span>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="font-semibold text-success">{checkedCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Pendentes</span>
                <span className="font-semibold text-warning">{items.length - checkedCount}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Total Estimado</span>
                <span className="text-2xl font-bold text-foreground">
                  R$ {totalPending.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                (apenas itens pendentes)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
