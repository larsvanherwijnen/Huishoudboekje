export type Transaction = {
  id: string;
  householdBookId: string;
  ownerId: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  categoryId?: string;
  description?: string;
};
