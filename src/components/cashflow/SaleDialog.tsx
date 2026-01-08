import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSales, CreateSaleData, SaleItem, PaymentMethod, DeliveryStatus } from "@/hooks/useSales";
import { useClients } from "@/hooks/useClients";
import { useRecipes } from "@/hooks/useRecipes";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyItem: SaleItem = {
  product_name: "",
  quantity: 1,
  unit_price: 0,
  total_price: 0,
};

export function SaleDialog({ open, onOpenChange }: SaleDialogProps) {
  const { createSale } = useSales();
  const { clients } = useClients();
  const { recipes } = useRecipes();

  const [clientId, setClientId] = useState<string>("");
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("pending");
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<SaleItem[]>([{ ...emptyItem }]);

  const subtotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const totalAmount = subtotal - discount;

  const addItem = () => {
    setItems([...items, { ...emptyItem }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate total price
    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].total_price = 
        (updatedItems[index].quantity || 0) * (updatedItems[index].unit_price || 0);
    }

    setItems(updatedItems);
  };

  const selectRecipe = (index: number, recipeId: string) => {
    const recipe = recipes?.find((r) => r.id === recipeId);
    if (recipe) {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        recipe_id: recipeId,
        product_name: recipe.name,
        unit_price: recipe.suggested_price || 0,
        total_price: (updatedItems[index].quantity || 1) * (recipe.suggested_price || 0),
      };
      setItems(updatedItems);
    }
  };

  const handleSubmit = async () => {
    if (items.some((item) => !item.product_name)) {
      return;
    }

    const data: CreateSaleData = {
      client_id: clientId || null,
      sale_date: saleDate.toISOString(),
      delivery_date: deliveryDate?.toISOString() || null,
      payment_method: paymentMethod,
      delivery_status: deliveryStatus,
      subtotal,
      discount,
      total_amount: totalAmount,
      notes: notes || null,
      items,
    };

    await createSale.mutateAsync(data);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setClientId("");
    setSaleDate(new Date());
    setDeliveryDate(undefined);
    setPaymentMethod("pix");
    setDeliveryStatus("pending");
    setDiscount(0);
    setNotes("");
    setItems([{ ...emptyItem }]);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <Select value={clientId || "none"} onValueChange={(v) => setClientId(v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem cliente</SelectItem>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da Venda</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !saleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {saleDate ? format(saleDate, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={saleDate}
                    onSelect={(date) => date && setSaleDate(date)}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Entrega (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Pagamento e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status da Entrega</Label>
              <Select value={deliveryStatus} onValueChange={(v) => setDeliveryStatus(v as DeliveryStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_production">Em Produção</SelectItem>
                  <SelectItem value="ready">Pronto</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Itens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Produtos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/30">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Produto</Label>
                  <div className="flex gap-2">
                    <Select
                      value={item.recipe_id || ""}
                      onValueChange={(v) => selectRecipe(index, v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione uma receita" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipes?.map((recipe) => (
                          <SelectItem key={recipe.id} value={recipe.id}>
                            {recipe.name} - R$ {recipe.suggested_price?.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Preço Unitário</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unit_price || ""}
                      onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total</Label>
                    <Input
                      type="number"
                      value={item.total_price.toFixed(2)}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desconto e Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="space-y-1">
              <Label className="text-sm">Subtotal</Label>
              <p className="text-lg font-semibold">R$ {subtotal.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Desconto</Label>
              <Input
                type="number"
                step="0.01"
                value={discount || ""}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Total</Label>
              <p className="text-2xl font-bold text-primary">R$ {totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre a venda..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createSale.isPending}>
              {createSale.isPending ? "Salvando..." : "Registrar Venda"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
