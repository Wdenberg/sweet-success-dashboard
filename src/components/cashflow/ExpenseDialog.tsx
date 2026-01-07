import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useExpenses, CreateExpenseData, EXPENSE_CATEGORIES } from "@/hooks/useExpenses";
import { PaymentMethod } from "@/hooks/useSales";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDialog({ open, onOpenChange }: ExpenseDialogProps) {
  const { createExpense } = useExpenses();

  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<string>("Insumos");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async () => {
    if (!description || amount <= 0) {
      return;
    }

    const data: CreateExpenseData = {
      expense_date: format(expenseDate, "yyyy-MM-dd"),
      category,
      description,
      amount,
      payment_method: paymentMethod,
      notes: notes || null,
    };

    await createExpense.mutateAsync(data);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setExpenseDate(new Date());
    setCategory("Insumos");
    setDescription("");
    setAmount(0);
    setPaymentMethod("pix");
    setNotes("");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Data */}
          <div className="space-y-2">
            <Label>Data da Despesa</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expenseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expenseDate ? format(expenseDate, "PPP", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expenseDate}
                  onSelect={(date) => date && setExpenseDate(date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra de farinha e açúcar"
            />
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          {/* Forma de Pagamento */}
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

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createExpense.isPending}>
              {createExpense.isPending ? "Salvando..." : "Registrar Despesa"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
