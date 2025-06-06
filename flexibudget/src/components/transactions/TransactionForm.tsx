import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from './transactionSchema';
import type { TransactionFormData } from './transactionSchema';
import { useTransactionStore } from '../../stores/transactionStore';
import { useCategoryStore } from '../../stores/categoryStore';
import type { Category } from '../../types/Category';
import type { Transaction } from '../../types/Transaction';
import { Link } from 'react-router-dom';

interface TransactionFormProps {
  transactionToEdit?: Transaction | null;
  onFormClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transactionToEdit, onFormClose }) => {
  const addTransaction = useTransactionStore(state => state.addTransaction);
  const updateTransaction = useTransactionStore(state => state.updateTransaction);
  const allCategories = useCategoryStore((state) => state.categories);
 
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transactionToEdit || {
      description: '',
      amount: 0, // Ensuring amount is initialized, even if 0
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      categoryId: '',
    }
  });

  const selectedType = watch('type');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
     if (transactionToEdit) {
         setValue('description', transactionToEdit.description);
         setValue('amount', transactionToEdit.amount);
         setValue('date', transactionToEdit.date);
         setValue('type', transactionToEdit.type);
         // categoryId will be set after categories are filtered based on type
     } else {
        // Reset to default values when transactionToEdit is null (e.g. after editing and then closing)
        setValue('description', '');
        setValue('amount', 0);
        setValue('date', new Date().toISOString().split('T')[0]);
        setValue('type', 'expense');
        setValue('categoryId', '');
     }
  }, [transactionToEdit, setValue]);

  useEffect(() => {
    // Use transactionToEdit's categoryId only if we are in edit mode and it's the first load for this edit
    const categoryIdToUse = transactionToEdit && watch('type') === transactionToEdit.type 
                            ? transactionToEdit.categoryId 
                            : '';

    const newFilteredCategories = allCategories.filter(cat => cat.type === selectedType);
    setFilteredCategories(newFilteredCategories);

    const isCurrentCategoryValid = newFilteredCategories.some(cat => cat.id === categoryIdToUse);
    
    if (isCurrentCategoryValid) {
        setValue('categoryId', categoryIdToUse);
    } else {
        setValue('categoryId', ''); // Reset if not valid or not in new list
    }
    
  }, [selectedType, allCategories, watch, setValue, transactionToEdit]);


  const onSubmit: SubmitHandler<TransactionFormData> = (data) => {
    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, data);
      if (onFormClose) onFormClose();
    } else {
      addTransaction(data);
    }
    // Reset form to default add state
    reset({
        description: '', 
        amount: 0, 
        date: new Date().toISOString().split('T')[0], 
        type: 'expense', 
        categoryId: '' 
    });
    setValue('type', 'expense'); // Ensure type is reset for category filtering
     // if (onFormClose && !transactionToEdit) onFormClose(); // Optionally close form after add
  };

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm";
  const inputFocusClasses = "focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-red-600 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white shadow-xl rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
        {transactionToEdit ? 'Modifier la Transaction' : 'Ajouter une Transaction'}
      </h2>
      
      <div>
        <label htmlFor="description" className={labelClasses}>Description</label>
        <input type="text" id="description" {...register('description')} className={`${inputBaseClasses} ${errors.description ? 'border-red-500' : 'border-gray-300'} ${inputFocusClasses}`} />
        {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="amount" className={labelClasses}>Montant (€)</label>
          <input type="number" id="amount" step="0.01" {...register('amount')} className={`${inputBaseClasses} ${errors.amount ? 'border-red-500' : 'border-gray-300'} ${inputFocusClasses}`} />
          {errors.amount && <p className={errorClasses}>{errors.amount.message}</p>}
        </div>
        <div>
          <label htmlFor="date" className={labelClasses}>Date</label>
          <input type="date" id="date" {...register('date')} className={`${inputBaseClasses} ${errors.date ? 'border-red-500' : 'border-gray-300'} ${inputFocusClasses}`} />
          {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className={labelClasses}>Type</label>
          <select 
            id="type" 
            {...register('type')} 
            className={`${inputBaseClasses} ${errors.type ? 'border-red-500' : 'border-gray-300'} ${inputFocusClasses}`}
          >
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
          {errors.type && <p className={errorClasses}>{errors.type.message}</p>}
        </div>
        <div>
          <label htmlFor="categoryId" className={labelClasses}>Catégorie</label>
          <select 
            id="categoryId" 
            {...register('categoryId')} 
            className={`${inputBaseClasses} ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} ${inputFocusClasses}`}
            disabled={filteredCategories.length === 0}
          >
            <option value="">Sélectionnez une catégorie</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className={errorClasses}>{errors.categoryId.message}</p>}
          {filteredCategories.length === 0 && selectedType && (
            <p className="text-sm text-gray-500 mt-2">
              Aucune catégorie de type '{selectedType}'. 
              <Link to="/categories" className="text-indigo-600 hover:underline ml-1">Ajoutez-en une.</Link>
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-4 border-t mt-8">
        {transactionToEdit && onFormClose && (
          <button 
            type="button" 
            onClick={() => {
                if (onFormClose) onFormClose();
                reset({ 
                    description: '', amount: 0, date: new Date().toISOString().split('T')[0], 
                    type: 'expense', categoryId: '' 
                });
                setValue('type', 'expense');
            }} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Annuler
          </button>
        )}
        <button 
          type="submit" 
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
        >
          {transactionToEdit ? 'Mettre à Jour' : 'Ajouter Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
