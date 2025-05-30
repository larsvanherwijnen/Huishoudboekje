"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/app/components/transactions/TransactionForm";
import { getTransaction, updateTransaction } from "@/app/lib/transactions.service";
import type { Transaction } from "@/app/types/transaction";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [initial, setInitial] = useState<Partial<Transaction>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTransaction(id).then(tx => {
      if (!tx) {
        router.replace("/transactions");
        return;
      }
      setInitial(tx);
      setLoading(false);
    });
  }, [id, router]);

  async function handleSubmit(data: Omit<Transaction, "id">) {
    setSaving(true);
    await updateTransaction(id, data);
    setSaving(false);
    router.push("/transactions");
  }

  if (loading) return <div className="p-8">Laden...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Transactie bewerken</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm initial={initial} onSubmit={handleSubmit} loading={saving} />
        </CardContent>
      </Card>
    </div>
  );
}