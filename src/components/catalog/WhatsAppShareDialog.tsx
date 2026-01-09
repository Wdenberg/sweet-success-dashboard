import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { CatalogItem } from "@/hooks/useCatalog";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem | null;
}

export const WhatsAppShareDialog = ({
  open,
  onOpenChange,
  item,
}: WhatsAppShareDialogProps) => {
  const { clients } = useClients();
  const { toast } = useToast();
  
  const [selectedClientId, setSelectedClientId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId && clientId !== "none") {
      const client = clients?.find((c) => c.id === clientId);
      if (client?.phone) {
        setPhoneNumber(formatPhoneNumber(client.phone));
      }
    } else {
      setPhoneNumber("");
    }
  };

  const handleShare = () => {
    if (!item) return;

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    if (!cleanPhone || cleanPhone.length < 10) {
      toast({
        title: "Número inválido",
        description: "Por favor, informe um número de telefone válido.",
        variant: "destructive",
      });
      return;
    }

    const priceLine = item.price ? `\n💰 *Preço: R$ ${item.price.toFixed(2).replace(".", ",")}*` : "";
    const imageLine = item.image_url ? `\n\n📸 Veja a foto: ${item.image_url}` : "";
    const customLine = customMessage.trim() ? `\n\n${customMessage.trim()}` : "\n\n_Entre em contato para encomendar!_";

    const message = `🍰 *${item.name}*${item.description ? `\n\n${item.description}` : ""}${priceLine}${imageLine}${customLine}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    onOpenChange(false);
    
    // Reset form
    setSelectedClientId("");
    setPhoneNumber("");
    setCustomMessage("");
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Enviar via WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Preview */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded bg-muted-foreground/20 flex items-center justify-center">
                🍰
              </div>
            )}
            <div>
              <p className="font-medium">{item.name}</p>
              {item.price && (
                <p className="text-sm text-primary font-semibold">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label>Selecionar Cliente</Label>
            <Select value={selectedClientId || "none"} onValueChange={handleClientSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Digitar número manualmente</SelectItem>
                {clients?.filter(c => c.phone).map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {formatPhoneNumber(client.phone!)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Número do WhatsApp</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">Mensagem personalizada (opcional)</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Adicione uma mensagem extra..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleShare}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
