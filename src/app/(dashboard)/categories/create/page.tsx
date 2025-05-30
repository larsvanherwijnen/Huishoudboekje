"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/app/components/categories/CategoryForm";
import { addCategory } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import type { Category } from "@/app/types/category";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [selectedBookId] = useSelectedHouseholdBook();

  async function handleAdd(data: Omit<Category, "id">) {
    if (!selectedBookId) {
      // Handle the error as appropriate for your app, e.g., show a message or return early
      throw new Error("Geen huishoudboek geselecteerd.");
    }
    await addCategory({ ...data, householdBookId: selectedBookId });
    router.push("/categories");
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nieuwe categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleAdd} />
        </CardContent>
      </Card>
    </div>
  );
}