import React, { useState } from 'react';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';
import { Category } from '../types/Category'; // Importer Category

const CategoriesPage: React.FC = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleFormClose = () => {
    setEditingCategory(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-4 text-center">Gérer les Catégories</h1>
      <CategoryForm 
        categoryToEdit={editingCategory}
        onFormClose={handleFormClose}
      />
      <CategoryList onEditCategory={handleEditCategory} />
    </div>
  );
};

export default CategoriesPage;
