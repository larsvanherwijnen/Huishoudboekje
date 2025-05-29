import { db } from "@/app/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Unsubscribe, getDoc } from "firebase/firestore";

export type HouseholdBook = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  archived?: boolean;
  participants?: string[];
};

export function listenHouseholdBooks(
  userId: string,
  listener: (books: HouseholdBook[]) => void
): Unsubscribe {
  const q = query(collection(db, "householdBooks"), where("ownerId", "==", userId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const books: HouseholdBook[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      books.push({
        id: docSnap.id,
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        archived: data.archived,
        participants: data.participants,
      });
    });
    listener(books);
  });
  return unsubscribe;
}


export async function updateHouseholdBook(
  id: string,
  data: { name: string; description?: string }
) {
  return updateDoc(doc(db, "householdBooks", id), data);
}

export async function getHouseholdBook(id: string) {
  const ref = doc(db, "householdBooks", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    ownerId: data.ownerId,
    archived: data.archived,
    participants: data.participants,
  } as HouseholdBook;
}

export async function addHouseholdBook({
  name,
  description,
  ownerId,
}: {
  name: string;
  description?: string;
  ownerId: string;
}) {
  return addDoc(collection(db, "householdBooks"), {
    name,
    description,
    ownerId,
    archived: false,
    participants: [],
  });
}

export async function archiveHouseholdBook(id: string) {
  return updateDoc(doc(db, "householdBooks", id), { archived: true });
}

export async function deArchiveHouseholdBook(id: string) {
  return updateDoc(doc(db, "householdBooks", id), { archived: false });
}