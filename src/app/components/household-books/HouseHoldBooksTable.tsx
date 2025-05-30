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
import { useRouter } from "next/navigation";

export type HouseHoldBook = {
  id: string;
  name: string;
  description?: string;
};

export function HouseHoldBooksTable({
  books,
  onDelete,
}: {
  books: HouseHoldBook[];
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <Table>
      <TableCaption>Overzicht van je huishoudboekjes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Naam</TableHead>
          <TableHead>Omschrijving</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
              Geen huishoudboekjes gevonden.
            </TableCell>
          </TableRow>
        ) : (
          books.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.name}</TableCell>
              <TableCell>{book.description || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/household-books/${book.id}/edit`)}
                >
                  Bewerken
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(book.id)}
                >
                  Verwijderen
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}