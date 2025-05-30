import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listenCategories } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import { useUser } from "@/app/hooks/useUser";
import type { Category } from "@/app/types/category";
import type { Transaction } from "@/app/types/transaction";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Bedrag is verplicht"),
  date: z.string().min(1, "Datum is verplicht"),
  categoryId: z.string().optional(),
  description: z.string().min(1, "Omschrijving is verplicht"),
});

export function TransactionForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<Transaction>;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  loading?: boolean;
}) {
  const [selectedBookId] = useSelectedHouseholdBook();
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<"income" | "expense">(
    initial?.type ?? "expense"
  );
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [date, setDate] = useState(
    initial?.date
      ? initial.date.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useUser();

  useEffect(() => {
    if (!selectedBookId) return;
    const unsubscribe = listenCategories(selectedBookId, setCategories);
    return () => unsubscribe();
  }, [selectedBookId]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});
        const result = transactionSchema.safeParse({
          type,
          amount,
          date,
          categoryId,
          description,
        });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }
        if (!selectedBookId) {
          setErrors({ householdBookId: "Geen huishoudboekje geselecteerd." });
          return;
        }
        const data: Omit<Transaction, "id"> = {
          householdBookId: selectedBookId,
          type,
          amount: parseFloat(amount),
          date: new Date(date).toISOString(),
          description: description || undefined,
          ownerId: initial?.ownerId ?? user?.uid ?? "", // fallback to user id or empty string
          ...(categoryId ? { categoryId } : {}),
        };
        onSubmit(data);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Type *</Label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="expense">Uitgave</option>
          <option value="income">Inkomst</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type}</p>}
      </div>
      <div>
        <Label>Bedrag *</Label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errors.amount && <p className="text-red-500">{errors.amount}</p>}
      </div>
      <div>
        <Label>Datum *</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="text-red-500">{errors.date}</p>}
      </div>
      <div>
        <Label>Categorie</Label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Geen</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500">{errors.categoryId}</p>
        )}
      </div>
      <div>
        <Label>Omschrijving *</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Omschrijving"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}
      </div>
      {errors.householdBookId && (
        <p className="text-red-500">{errors.householdBookId}</p>
      )}
      <Button type="submit" disabled={loading}>
        Opslaan
      </Button>
    </form>
  );
}
