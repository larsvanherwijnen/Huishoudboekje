import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import type { Transaction } from "@/app/types/transaction";

export function TransactionsTable({
  transactions,
  categories,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  categories: { id: string; name: string; maxBudget?: number }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Bedrag</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead>Omschrijving</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              Geen transacties gevonden voor deze maand.
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                {format(parseISO(t.date), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>
                {t.type === "income" ? (
                  <span className="text-green-700 font-medium">
                    Inkomst
                  </span>
                ) : (
                  <span className="text-red-700 font-medium">Uitgave</span>
                )}
              </TableCell>
              <TableCell>€ {t.amount.toFixed(2)}</TableCell>
              <TableCell>
                {categories.find((c) => c.id === t.categoryId)?.name || "-"}
              </TableCell>
              <TableCell>{t.description || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(t.id)}
                >
                  Bewerken
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(t.id)}
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