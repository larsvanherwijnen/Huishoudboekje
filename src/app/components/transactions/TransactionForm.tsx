import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/app/lib/categories.services";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import type { Transaction } from "@/app/lib/transactions.service";
import type { Category } from "@/app/types/category";

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
  const [type, setType] = useState<"income" | "expense">(initial?.type ?? "expense");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBookId) {
      getCategories(selectedBookId).then(setCategories);
    }
  }, [selectedBookId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!amount) {
      setError("Bedrag is verplicht.");
      return;
    }
    if (!selectedBookId) {
      setError("Geen huishoudboekje geselecteerd.");
      return;
    }
    const transactionData: any = {
      ...initial,
      householdBookId: selectedBookId,
      type,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description: description || undefined,
    };
    if (categoryId) transactionData.categoryId = categoryId;

    onSubmit(transactionData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <select
          value={type}
          onChange={e => setType(e.target.value as "income" | "expense")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="expense">Uitgave</option>
          <option value="income">Inkomst</option>
        </select>
      </div>
      <div>
        <Label>Bedrag</Label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Datum</Label>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Categorie</Label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Geen</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Omschrijving</Label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Omschrijving"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>Opslaan</Button>
    </form>
  );
}