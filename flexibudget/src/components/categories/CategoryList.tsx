import React from 'react';
import { useCategoryStore } from '../../stores/categoryStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { Category } from '../../types/Category';
import { useCurrencyFormatter } from '../../utils/format';

interface CategoryListProps {
  onEditCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onEditCategory }) => {
  const { categories, deleteCategory } = useCategoryStore((state) => ({
     categories: state.categories,
     deleteCategory: state.deleteCategory,
  }));
  const transactions = useTransactionStore((state) => state.transactions);
  const formatCurrency = useCurrencyFormatter();

  const getCategoryExpenses = (categoryId: string): number => {
     return transactions
         .filter(t => t.categoryId === categoryId && t.type === 'expense')
         .reduce((sum, t) => sum + t.amount, 0);
  };

  if (categories.length === 0) {
    return <p className="text-gray-500">Aucune catégorie pour le moment. Ajoutez-en une ci-dessus !</p>;
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const spent = category.type === 'expense' ? getCategoryExpenses(category.id) : 0;
        const budget = category.budget || 0;
        const progress = budget > 0 ? (spent / budget) * 100 : 0;
        const progressBarColor = progress > 100 ? 'bg-red-500' : (progress > 75 ? 'bg-yellow-500' : 'bg-green-500');

        return (
         <div key={category.id} className="p-4 bg-white shadow-md rounded-lg">
             <div className="flex justify-between items-center mb-2">
                 <div>
                     <h3 className="text-lg font-semibold">{category.name}</h3>
                     <p className={`text-sm font-medium ${category.type === 'income' ? 'text-green-600' : 'text-blue-600'}`}>
                         Type: {category.type}
                     </p>
                 </div>
                 <div className="space-x-2">
                     <button 
                         onClick={() => onEditCategory(category)}
                         className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                     >
                         Modifier
                     </button>
                     <button 
                         onClick={() => deleteCategory(category.id)}
                         className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                     >
                         Supprimer
                     </button>
                 </div>
             </div>
             {category.type === 'expense' && category.budget !== undefined && category.budget > 0 && (
                 <div>
                     <div className="flex justify-between text-sm text-gray-600 mb-1">
                         <span>Dépensé: {formatCurrency(spent)}</span>
                         <span>Budget: {formatCurrency(budget)}</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                         <div 
                             className={`h-2.5 rounded-full ${progressBarColor}`} 
                             style={{ width: `${Math.min(progress, 100)}%` }} // Plafonner la barre à 100% visuellement
                         ></div>
                     </div>
                     {progress > 100 && (
                         <p className="text-xs text-red-600 mt-1 text-right">
                             Dépassement de {formatCurrency(spent - budget)} ({(progress - 100).toFixed(1)}%)
                         </p>
                     )}
                 </div>
             )}
              {category.type === 'expense' && (category.budget === undefined || category.budget === 0) && (
                 <p className="text-xs text-gray-400 italic">Aucun budget défini pour cette catégorie.</p>
             )}
         </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
