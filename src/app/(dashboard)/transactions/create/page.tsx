"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/app/components/transactions/TransactionForm";
import { addTransaction } from "@/app/lib/transactions.service";
import { useUser } from "@/app/hooks/useUser";
import type { Transaction } from "@/app/types/transaction";

export default function CreateTransactionPage() {
  const router = useRouter();
  const { user } = useUser();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(data: Omit<Transaction, "id">) {
    setSaving(true);
    await addTransaction({
      ...data,
      ownerId: user?.uid ?? "",
      householdBookId: data.householdBookId,
      type: data.type,
      amount: data.amount,
      date: data.date,
    });
    setSaving(false);
    router.push("/transactions");
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nieuwe transactie</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm onSubmit={handleSubmit} loading={saving} />
        </CardContent>
      </Card>
    </div>
  );
}
