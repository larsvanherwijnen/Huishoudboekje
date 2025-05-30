export type Category = {
  id: string;
  name: string;
  maxBudget?: number;
  endDate?: string; // ISO string, optioneel
  householdBookId: string;
  userId: string;
};