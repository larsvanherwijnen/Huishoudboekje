import { db } from "@/app/lib/firebase";
import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { endOfMonth } from "date-fns";
export type Transaction = {
  id: string;
  householdBookId: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  categoryId?: string;
  description?: string;
};

export async function getTransactions(userId: string, month?: string) {
  let q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );

  if (month) {
    // month: "2024-05"
    const start = new Date(`${month}-01T00:00:00`);
    console.log("Start date:", start);
    const end = endOfMonth(start);
    q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
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