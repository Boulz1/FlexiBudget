export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  budget?: number; // Budget mensuel optionnel pour les catégories de dépenses
}
