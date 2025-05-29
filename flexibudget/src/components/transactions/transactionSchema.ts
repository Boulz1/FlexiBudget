// src/components/transactions/transactionSchema.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, { message: "Category is required" }) 
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
