import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export function HouseholdBooksList({ userId }: { userId: string }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      const q = query(collection(db, "householdBooks"), where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);
      setBooks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    if (userId) fetchBooks();
  }, [userId]);

  return (
    <div>
      <h2>My Household Books</h2>
      <ul>
        {books.map((book: any) => (
          <li key={book.id}>{book.name} - {book.description}</li>
        ))}
      </ul>
    </div>
  );
}
