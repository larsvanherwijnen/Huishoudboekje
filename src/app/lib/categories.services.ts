import { db } from "@/app/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, where, query, onSnapshot, QuerySnapshot } from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { Category } from "@/app/types/category";

export async function addCategory(data: Omit<Category, "id">) {
  return addDoc(collection(db, "categories"), data);
}

export async function updateCategory(id: string, data: Partial<Category>) {
  return updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, "categories", id));
}

export function listenCategories(
  householdBookId: string,
  listener: (categories: Category[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "categories"),
    where("householdBookId", "==", householdBookId)
  );
  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
    const categories: Category[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
    listener(categories);
  });
  return unsubscribe;
}