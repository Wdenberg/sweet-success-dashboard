import { useState, useMemo, useCallback } from "react";
import { Plus, Save, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/recipes/ImageUpload";
import { IngredientRow } from "@/components/recipes/IngredientRow";
import { IndirectCostItem } from "@/components/recipes/IndirectCostItem";
import { PriceSummary } from "@/components/recipes/PriceSummary";
import { Ingredient, IndirectCost, RecipeCalculation } from "@/types/recipe";
import { toast } from "sonner";

const defaultIndirectCosts: IndirectCost[] = [
  { id: "labor", name: "Mão de Obra", enabled: true, value: 25 },
  { id: "energy", name: "Gás / Energia", enabled: true, value: 8 },
  { id: "packaging", name: "Embalagem", enabled: true, value: 12 },
  { id: "transport", name: "Transporte", enabled: false, value: 0 },
];

const createEmptyIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: "",
  quantity: 0,
  unit: "g",
  packagePrice: 0,
  packageSize: 1000,
  packageUnit: "g",
});

export default function NewRecipe() {
  // Form State
  const [name, setName] = useState("");
  const [yieldAmount, setYieldAmount] = useState(1);
  const [yieldUnit, setYieldUnit] = useState("unidade");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profitMargin, setProfitMargin] = useState(45);
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    createEmptyIngredient(),
    createEmptyIngredient(),
    createEmptyIngredient(),
  ]);
  
  const [indirectCosts, setIndirectCosts] = useState<IndirectCost[]>(defaultIndirectCosts);

  // Handlers
  const handleImageChange = useCallback((file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
  }, []);

  const handleAddIngredient = useCallback(() => {
    setIngredients(prev => [...prev, createEmptyIngredient()]);
  }, []);

  const handleRemoveIngredient = useCallback((index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateIngredient = useCallback((index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
  }, []);

  const handleToggleIndirectCost = useCallback((id: string) => {
    setIndirectCosts(prev => prev.map(cost =>
      cost.id === id ? { ...cost, enabled: !cost.enabled } : cost
    ));
  }, []);

  const handleIndirectCostValueChange = useCallback((id: string, value: number) => {
    setIndirectCosts(prev => prev.map(cost =>
      cost.id === id ? { ...cost, value } : cost
    ));
  }, []);

  // Calculate ingredient cost
  const calculateIngredientCost = useCallback((ingredient: Ingredient): number => {
    if (ingredient.packageSize <= 0 || ingredient.quantity <= 0) return 0;
    return (ingredient.quantity / ingredient.packageSize) * ingredient.packagePrice;
  }, []);

  // Calculate totals
  const calculation: RecipeCalculation = useMemo(() => {
    const ingredientsCost = ingredients.reduce(
      (sum, ing) => sum + calculateIngredientCost(ing), 
      0
    );

    const indirectCostTotal = indirectCosts
      .filter(c => c.enabled)
      .reduce((sum, c) => sum + c.value, 0);

    const productionCost = ingredientsCost + indirectCostTotal;
    const profitAmount = productionCost * (profitMargin / 100);
    const suggestedPrice = productionCost + profitAmount;
    const pricePerUnit = yieldAmount > 0 ? suggestedPrice / yieldAmount : 0;

    return {
      ingredientsCost,
      indirectCostTotal,
      productionCost,
      profitAmount,
      suggestedPrice,
      pricePerUnit,
    };
  }, [ingredients, indirectCosts, profitMargin, yieldAmount, calculateIngredientCost]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Digite o nome da receita");
      return;
    }
    
    const validIngredients = ingredients.filter(i => i.name.trim());
    if (validIngredients.length === 0) {
      toast.error("Adicione pelo menos um ingrediente");
      return;
    }

    // Here you would save to database
    toast.success("Receita salva com sucesso!", {
      description: `Preço sugerido: R$ ${calculation.suggestedPrice.toFixed(2)}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/receitas">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nova Ficha Técnica</h1>
              <p className="text-muted-foreground">Calcule o preço ideal para sua receita</p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Receita
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardContent className="pt-6">
                <ImageUpload 
                  imagePreview={imagePreview} 
                  onImageChange={handleImageChange} 
                />
              </CardContent>
            </Card>

            {/* Recipe Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Receita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Receita</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Bolo de Chocolate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yield">Rendimento</Label>
                    <Input
                      id="yield"
                      type="number"
                      step="0.1"
                      placeholder="1"
                      value={yieldAmount || ''}
                      onChange={(e) => setYieldAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Input
                      id="unit"
                      placeholder="kg ou unidade"
                      value={yieldUnit}
                      onChange={(e) => setYieldUnit(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indirect Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custos Indiretos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {indirectCosts.map(cost => (
                  <IndirectCostItem
                    key={cost.id}
                    cost={cost}
                    onToggle={handleToggleIndirectCost}
                    onValueChange={handleIndirectCostValueChange}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Ingredients & Profit */}
          <div className="col-span-2 space-y-6">
            {/* Ingredients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Ingredientes</CardTitle>
                <Button variant="soft" size="sm" onClick={handleAddIngredient} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </CardHeader>
              <CardContent>
                {/* Header Labels */}
                <div className="grid grid-cols-12 gap-3 mb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-3">Ingrediente</div>
                  <div className="col-span-1 text-center">Qtd</div>
                  <div className="col-span-1 text-center">Un.</div>
                  <div className="col-span-2 text-center">Preço Pacote</div>
                  <div className="col-span-1 text-center">Tam.</div>
                  <div className="col-span-1 text-center">Un.</div>
                  <div className="col-span-2 text-right pr-12">Custo</div>
                </div>

                {/* Ingredient Rows */}
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <IngredientRow
                      key={ingredient.id}
                      ingredient={ingredient}
                      index={index}
                      onUpdate={handleUpdateIngredient}
                      onRemove={handleRemoveIngredient}
                      calculatedCost={calculateIngredientCost(ingredient)}
                    />
                  ))}
                </div>

                {/* Ingredients Total */}
                <div className="flex justify-end mt-4 pt-4 border-t border-border">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Ingredientes</p>
                    <p className="text-xl font-bold text-foreground">
                      R$ {calculation.ingredientsCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Margin */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary-soft/30 to-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Margem de Lucro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ajuste sua margem</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-primary">{profitMargin}%</span>
                    </div>
                  </div>
                  <Slider
                    value={[profitMargin]}
                    onValueChange={(value) => setProfitMargin(value[0])}
                    min={0}
                    max={200}
                    step={5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                    <span>150%</span>
                    <span>200%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Summary */}
      <PriceSummary 
        calculation={calculation}
        yieldAmount={yieldAmount}
        yieldUnit={yieldUnit}
      />
    </DashboardLayout>
  );
}
