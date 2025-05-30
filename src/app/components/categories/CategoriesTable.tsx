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
import type { Category } from "@/app/types/category";
import { useRouter } from "next/navigation";

export function CategoriesTable({
  categories,
  onDelete,
}: {
  categories: Category[];
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
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
                onClick={() => onDelete(cat.id)}
              >
                Verwijderen
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}