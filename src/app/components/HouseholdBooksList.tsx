import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";


type HouseholdBook = {
  id: string;
  name: string;
  description?: string;
  // add other fields as needed
};


export function HouseholdBooksList({ userId }: { userId: string }) {
  const [books, setBooks] = useState<HouseholdBook[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      const q = query(collection(db, "householdBooks"), where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);
      setBooks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HouseholdBook)));
    }
    if (userId) fetchBooks();
  }, [userId]);

  return (
    <div>
      <h2>My Household Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.name} - {book.description}</li>
        ))}
      </ul>
    </div>
  );
}
