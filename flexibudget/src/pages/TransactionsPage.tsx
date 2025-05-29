import React, { useState } from 'react';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import { Transaction } from '../types/Transaction'; // Importer Transaction

const TransactionsPage: React.FC = () => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleFormClose = () => {
    setEditingTransaction(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-4 text-center">Gérer les Transactions</h1>
      <TransactionForm 
        transactionToEdit={editingTransaction} 
        onFormClose={handleFormClose} 
      />
      <TransactionList onEditTransaction={handleEditTransaction} />
    </div>
  );
};

export default TransactionsPage;
