"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/app/components/categories/CategoryForm";
import { getCategories, updateCategory } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import type { Category } from "@/app/types/category";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [selectedBookId] = useSelectedHouseholdBook();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!selectedBookId || !id) return;
    getCategories(selectedBookId).then(cats => {
      const found = cats.find(c => c.id === id);
      if (found) setCategory(found);
      else router.replace("/categories");
    });
  }, [selectedBookId, id, router]);

  async function handleEdit(data: Omit<Category, "id">) {
    await updateCategory(id, data);
    router.push("/categories");
  }

  if (!category) return <div className="p-8">Laden...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Categorie bewerken</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm initial={category} onSubmit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}