export type HouseholdBook = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  archived?: boolean;
  participants?: string[];
};