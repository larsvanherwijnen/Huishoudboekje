"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { getCategories, deleteCategory } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import type { Category } from "@/app/types/category";

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedBookId] = useSelectedHouseholdBook();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!selectedBookId) return;
    getCategories(selectedBookId).then(setCategories);
  }, [selectedBookId]);

  async function handleDelete(id: string) {
    if (confirm("Weet je zeker dat je deze categorie wilt verwijderen?")) {
      await deleteCategory(id);
      getCategories(selectedBookId).then(setCategories);
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
          <Table>
            <TableCaption>Overzicht van je categorieën.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Max. budget</TableHead>
                <TableHead>Einddatum</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    Geen categorieën gevonden.
                  </TableCell>
                </TableRow>
              )}
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    {cat.maxBudget ? `€ ${cat.maxBudget}` : "-"}
                  </TableCell>
                  <TableCell>
                    {cat.endDate ? new Date(cat.endDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/categories/${cat.id}/edit`)}
                    >
                      Bewerken
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Verwijderen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}