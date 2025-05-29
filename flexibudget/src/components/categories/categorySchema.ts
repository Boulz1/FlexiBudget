import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Le nom de la catégorie est requis" }),
  type: z.enum(['income', 'expense'], { message: "Le type doit être soit revenu, soit dépense" }),
  budget: z.preprocess(
     // Convertir une chaîne vide en undefined, sinon garder la valeur pour la coercition numérique
     (val) => (val === "" || val === undefined || val === null ? undefined : val),
     z.coerce.number().positive({ message: "Le budget doit être un nombre positif" }).optional()
  )
}).refine(data => data.type === 'income' ? data.budget === undefined || data.budget === null || data.budget === 0 : true, { // Budget ne doit pas être défini pour 'income' ou doit être 0
     message: "Le budget ne peut pas être défini pour les catégories de revenus.",
     path: ["budget"],
});

export type CategoryFormData = z.infer<typeof categorySchema>;
