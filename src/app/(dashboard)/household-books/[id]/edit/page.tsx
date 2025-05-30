"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HouseholdBookForm } from "@/app/components/household-books/HouseholdBookForm";
import { getHouseholdBook, updateHouseholdBook } from "@/app/lib/householdbooks.service";

export default function EditHouseholdBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [initial, setInitial] = useState<{ name?: string; description?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getHouseholdBook(id).then(book => {
      if (!book) {
        router.replace("/household-books");
        return;
      }
      setInitial({ name: book.name, description: book.description });
      setLoading(false);
    });
  }, [id, router]);

  async function handleSubmit(data: { name: string; description?: string }) {
    setSaving(true);
    await updateHouseholdBook(id, data);
    setSaving(false);
    router.push("/household-books");
  }

  if (loading) return <div className="p-8">Laden...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Huishoudboekje bewerken</CardTitle>
        </CardHeader>
        <CardContent>
          <HouseholdBookForm initial={initial} onSubmit={handleSubmit} loading={saving} />
        </CardContent>
      </Card>
    </div>
  );
}