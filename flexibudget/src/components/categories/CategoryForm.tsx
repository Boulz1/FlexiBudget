import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormData } from './categorySchema';
import { useCategoryStore } from '../../stores/categoryStore';
import { Category } from '../../types/Category';

interface CategoryFormProps {
  categoryToEdit?: Category | null;
  onFormClose?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToEdit, onFormClose }) => {
  const { addCategory, updateCategory } = useCategoryStore(state => ({
     addCategory: state.addCategory,
     updateCategory: state.updateCategory
  }));
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { 
         name: '', 
         type: 'expense', 
         budget: undefined 
    }
  });

  const categoryType = watch("type");

  useEffect(() => {
    if (categoryToEdit) {
      setValue('name', categoryToEdit.name);
      setValue('type', categoryToEdit.type);
      setValue('budget', categoryToEdit.budget || undefined);
    } else {
      setValue('name', '');
      setValue('type', 'expense');
      setValue('budget', undefined);
    }
  }, [categoryToEdit, setValue]);
  
  // Si le type change en "income", effacer le budget
  useEffect(() => {
     if (categoryType === 'income') {
         setValue('budget', undefined);
     }
  }, [categoryType, setValue]);


  const onSubmit: SubmitHandler<CategoryFormData> = (data) => {
    const dataToSubmit: Partial<Category> = { name: data.name, type: data.type };
    if (data.type === 'expense' && data.budget !== undefined && data.budget > 0) {
      dataToSubmit.budget = data.budget;
    } else {
      // Assurez-vous que le budget est undefined si non applicable
      dataToSubmit.budget = undefined;
    }

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, dataToSubmit);
    } else {
      addCategory(dataToSubmit as Omit<Category, 'id'>);
    }
    
    reset({ name: '', type: 'expense', budget: undefined });
    if (onFormClose) onFormClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg mb-6">
      <h2 className="text-xl font-semibold">{categoryToEdit ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la Catégorie</label>
        <input type="text" id="name" {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de Catégorie</label>
        <select id="type" {...register('type')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="expense">Dépense</option>
          <option value="income">Revenu</option>
        </select>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
      </div>
      {categoryType === 'expense' && (
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget Mensuel (Optionnel)</label>
          <input 
             type="number" 
             id="budget" 
             step="0.01" 
             {...register('budget')} 
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
             placeholder="Ex: 200"
          />
          {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
        </div>
      )}
      <div className="flex space-x-2">
         <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
             {categoryToEdit ? 'Mettre à Jour' : 'Ajouter'}
         </button>
         {categoryToEdit && onFormClose && (
             <button 
             type="button" 
             onClick={() => {
                 onFormClose();
                 reset({ name: '', type: 'expense', budget: undefined });
             }} 
             className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
             >
             Annuler
             </button>
         )}
      </div>
    </form>
  );
};

export default CategoryForm;
