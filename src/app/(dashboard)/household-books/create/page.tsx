"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HouseholdBookForm } from "@/app/components/household-books/HouseholdBookForm";
import { addHouseholdBook } from "@/app/lib/householdbooks.service";
import { useUser } from "@/app/hooks/useUser";
import { useState } from "react";

export default function CreateHouseholdBookPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: { name: string; description?: string }) {
    if (!user) return;
    setLoading(true);
    await addHouseholdBook({
      ...data,
      ownerId: user.uid,
    });
    setLoading(false);
    router.push("/household-books");
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nieuw huishoudboekje</CardTitle>
        </CardHeader>
        <CardContent>
          <HouseholdBookForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}