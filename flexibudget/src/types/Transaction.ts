export interface Transaction {
  id: string;
  amount: number;
  date: string; // Or Date, recommend string for simplicity in forms/storage
  description: string;
  type: 'expense' | 'income';
  categoryId: string; 
}
