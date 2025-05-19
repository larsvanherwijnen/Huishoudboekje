import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function AddHouseholdBook({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addBook = async () => {
    if (!name) return alert("Name is required!");
    await addDoc(collection(db, "householdBooks"), {
      name,
      description,
      ownerId: userId,
      createdAt: serverTimestamp(),
      archived: false,
    });
    setName("");
    setDescription("");
  };

  return (
    <div>
      <input placeholder="Book Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={addBook}>Add Household Book</button>
    </div>
  );
}
