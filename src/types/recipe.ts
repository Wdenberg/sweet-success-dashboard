export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  packagePrice: number;
  packageSize: number;
  packageUnit: string;
}

export interface IndirectCost {
  id: string;
  name: string;
  enabled: boolean;
  value: number;
}

export interface RecipeFormData {
  name: string;
  yield: number;
  yieldUnit: string;
  image: File | null;
  imagePreview: string | null;
  ingredients: Ingredient[];
  indirectCosts: IndirectCost[];
  profitMargin: number;
}

export interface RecipeCalculation {
  ingredientsCost: number;
  indirectCostTotal: number;
  productionCost: number;
  profitAmount: number;
  suggestedPrice: number;
  pricePerUnit: number;
}
