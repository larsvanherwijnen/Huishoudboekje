"use client";

import { useUser } from "@/app/hooks/useUser";
import { AddHouseholdBook } from "@/app/components/AddHouseholdBook";
import { HouseholdBooksList } from "@/app/components/HouseholdBooksList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HouseholdBooksPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); 
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Prevent flashing for unauthenticated users

  return (
    <div>
      <h1>Your Household Books</h1>
      <AddHouseholdBook userId={user.uid} />
      <HouseholdBooksList userId={user.uid} />
    </div>
  );
}
