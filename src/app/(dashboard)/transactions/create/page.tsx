"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/app/hooks/useUser";
import { addTransaction } from "@/app/lib/transactions.service";

export default function CreateTransactionPage() {
  const { user } = useUser();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!amount) {
      setError("Bedrag is verplicht.");
      return;
    }
    try {
      await addTransaction({
        householdBookId: "", // Vul in indien van toepassing
        userId: user?.uid ?? "",
        type,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        categoryId: categoryId || undefined,
        description: description || undefined,
      });
      router.push("/transactions");
    } catch  {
      setError("Fout bij opslaan.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nieuwe transactie</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Input
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                placeholder="Categorie"
              />
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
            <Button type="submit">Opslaan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}