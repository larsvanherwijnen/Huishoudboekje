// import { useEffect, useState } from "react";

// const STORAGE_KEY = "selectedHouseholdBookId";

// export function useSelectedHouseholdBook(defaultId?: string) {
//   const [selectedId, setSelectedId] = useState<string | null>(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem(STORAGE_KEY) || defaultId || null;
//     }
//     return defaultId || null;
//   });

//   useEffect(() => {
//     if (selectedId) {
//       localStorage.setItem(STORAGE_KEY, selectedId);
//     }
//   }, [selectedId]);

//   return [selectedId, setSelectedId] as const;
// }