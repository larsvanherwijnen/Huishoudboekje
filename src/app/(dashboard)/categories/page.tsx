"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listenCategories, deleteCategory } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import type { Category } from "@/app/types/category";
import { CategoriesTable } from "@/app/components/categories/CategoriesTable";

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedBookId] = useSelectedHouseholdBook();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!selectedBookId) return;
    const unsubscribe = listenCategories(selectedBookId, setCategories);
    return () => unsubscribe();
  }, [selectedBookId]);

  async function handleDelete(id: string) {
    if (confirm("Weet je zeker dat je deze categorie wilt verwijderen?")) {
      await deleteCategory(id);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categorieën</CardTitle>
          <Button onClick={() => router.push("/categories/create")}>
            Nieuwe categorie
          </Button>
        </CardHeader>
        <CardContent>
          <CategoriesTable categories={categories} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
