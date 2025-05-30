import { db } from "@/app/lib/firebase";
import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { endOfMonth } from "date-fns";
import type { Transaction } from "@/app/types/transaction";

export async function getTransactions(
  ownerId: string,
  month?: string,
  householdBookId?: string
) {
  const filters = [
    where("ownerId", "==", ownerId),
  ];

  if (householdBookId) {
    filters.push(where("householdBookId", "==", householdBookId));
  }

  let q = query(
    collection(db, "transactions"),
    ...filters,
    orderBy("date", "desc")
  );

  if (month) {
    const start = new Date(`${month}-01T00:00:00`);
    const end = endOfMonth(start);
    q = query(
      collection(db, "transactions"),
      ...filters,
      where("date", ">=", start.toISOString()),
      where("date", "<=", end.toISOString()),
      orderBy("date", "desc")
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
}

export async function getTransaction(id: string) {
  const ref = doc(db, "transactions", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
  } as Transaction;
}

export async function addTransaction(data: Omit<Transaction, "id">) {
  return addDoc(collection(db, "transactions"), data);
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  return updateDoc(doc(db, "transactions", id), data);
}

export async function deleteTransaction(id: string) {
  return deleteDoc(doc(db, "transactions", id));
}