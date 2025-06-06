import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '../types/Transaction';
import { v4 as uuidv4 } from 'uuid'; // Use uuid to generate unique transaction IDs

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, id: uuidv4() }],
        })),
      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    { name: 'transactions' }
  )
);
