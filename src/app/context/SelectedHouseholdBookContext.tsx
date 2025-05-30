import { createContext, useContext, useState, useEffect } from "react";
import { listenHouseholdBooks, HouseholdBook } from "@/app/lib/householdbooks.service";
import { useUser } from "@/app/hooks/useUser";

const STORAGE_KEY = "selectedHouseholdBookId";

type ContextType = {
  householdBooks: HouseholdBook[];
  selectedBookId: string | null;
  setSelectedBookId: (id: string) => void;
};

const SelectedHouseholdBookContext = createContext<ContextType | undefined>(undefined);

export function SelectedHouseholdBookProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [householdBooks, setHouseholdBooks] = useState<HouseholdBook[]>([]);
  const [selectedBookId, setSelectedBookIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || null;
    }
    return null;
  });

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenHouseholdBooks(user.uid, (books) => {
      setHouseholdBooks(books);
      if ((!selectedBookId || !books.find(b => b.id === selectedBookId)) && books.length > 0) {
        setSelectedBookIdState(books[0].id);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedBookId) {
      localStorage.setItem(STORAGE_KEY, selectedBookId);
    }
  }, [selectedBookId]);

  const setSelectedBookId = (id: string) => {
    setSelectedBookIdState(id);
  };

  return (
    <SelectedHouseholdBookContext.Provider value={{ householdBooks, selectedBookId, setSelectedBookId }}>
      {children}
    </SelectedHouseholdBookContext.Provider>
  );
}

export function useSelectedHouseholdBook() {
  const ctx = useContext(SelectedHouseholdBookContext);
  if (!ctx) throw new Error("useSelectedHouseholdBook must be used within SelectedHouseholdBookProvider");
  return [ctx.selectedBookId, ctx.setSelectedBookId, ctx.householdBooks] as const;
}