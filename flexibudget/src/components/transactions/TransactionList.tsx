import React from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { Transaction } from '../../types/Transaction';
import { useSettingsStore } from '../../stores/settingsStore';
import { useCurrencyFormatter } from '../../utils/format';

interface TransactionListProps {
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const { transactions, deleteTransaction } = useTransactionStore((state) => ({
    transactions: state.transactions,
    deleteTransaction: state.deleteTransaction,
  }));
  const getCategoryById = useCategoryStore((state) => state.getCategoryById);
  const dateFormat = useSettingsStore(state => state.dateFormat);
  const formatCurrency = useCurrencyFormatter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    switch (dateFormat) {
      case 'MM/dd/yyyy':
        return `${mm}/${dd}/${yyyy}`;
      case 'yyyy-MM-dd':
        return `${yyyy}-${mm}-${dd}`;
      default:
        return `${dd}/${mm}/${yyyy}`;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par ajouter une nouvelle transaction.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 my-8">
      {transactions.map((transaction) => {
        const category = getCategoryById(transaction.categoryId);
        return (
          <div key={transaction.id} className="bg-white shadow-lg rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{transaction.description}</h3>
                  <p className={`text-sm font-medium ${category?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {category?.name || <span className="text-gray-500 italic">Non Catégorisé</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                   <p className={`text-xl font-bold mb-2 ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                     {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                   </p>
                   <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <button 
                      onClick={() => onEditTransaction(transaction)} 
                      className="w-full sm:w-auto px-3 py-1 text-xs font-medium text-center text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => deleteTransaction(transaction.id)} 
                      className="w-full sm:w-auto px-3 py-1 text-xs font-medium text-center text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
