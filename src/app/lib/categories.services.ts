import { db } from "@/app/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, where, query } from "firebase/firestore";
import type { Category } from "@/app/types/category";

export async function getCategories(householdBookId: string) {
  const q = query(collection(db, "categories"), where("householdBookId", "==", householdBookId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(data: Omit<Category, "id">) {
  return addDoc(collection(db, "categories"), data);
}

export async function updateCategory(id: string, data: Partial<Category>) {
  return updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, "categories", id));
}