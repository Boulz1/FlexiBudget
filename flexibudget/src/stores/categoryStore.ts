import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types/Category';
import { v4 as uuidv4 } from 'uuid';
import { useTransactionStore } from './transactionStore';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => boolean;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: (categoryData) => // categoryData peut inclure budget
        set((state) => ({
          categories: [...state.categories, { ...categoryData, id: uuidv4() }],
        })),
      updateCategory: (id, updatedCategoryData) => // updatedCategoryData peut inclure budget
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedCategoryData } : c
          ),
        })),
      deleteCategory: (id) => {
        const transactions = useTransactionStore.getState().transactions;
        const isCategoryUsed = transactions.some(t => t.categoryId === id);

        if (isCategoryUsed) {
          alert("Cette catégorie est utilisée par des transactions et ne peut pas être supprimée. Veuillez d'abord supprimer ou modifier les transactions associées.");
          return false;
        }
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
        return true;
      },
      getCategoryById: (id: string) => {
         return get().categories.find(c => c.id === id);
      }
    }),
    { name: 'categories' }
  )
);
