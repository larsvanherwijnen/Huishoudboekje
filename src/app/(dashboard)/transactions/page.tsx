"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
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
} from "@/components/ui/table";
import {
  getTransactions,
  Transaction,
  deleteTransaction,
} from "@/app/lib/transactions.service";
import { format, parseISO } from "date-fns";

export default function TransactionsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    // Haal transacties op voor deze maand
    getTransactions(user.uid, selectedMonth).then(setTransactions);
  }, [user, selectedMonth]);

  // Statistieken berekenen
  const stats = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  if (loading) return <div className="p-8">Laden...</div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Uitgaven & Inkomsten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="font-semibold">
                Statistieken ({selectedMonth})
              </div>
              <div className="flex gap-8 mt-2">
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Inkomsten
                  </span>
                  <span className="font-bold text-green-700">
                    € {stats.income.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Uitgaven
                  </span>
                  <span className="font-bold text-red-700">
                    € {stats.expense.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Balans
                  </span>
                  <span className="font-bold">
                    € {stats.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1" htmlFor="month">
                Maand
              </label>
              <input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <Button onClick={() => router.push("/transactions/create")}>
              Nieuwe transactie
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transacties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Omschrijving</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    Geen transacties gevonden voor deze maand.
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((t) => (
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
                  <TableCell>{t.categoryId || "-"}</TableCell>
                  <TableCell>{t.description || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/transactions/${t.id}/edit`)}
                    >
                      Bewerken
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (
                          confirm(
                            "Weet je zeker dat je deze transactie wilt verwijderen?"
                          )
                        ) {
                          await deleteTransaction(t.id);
                          setTransactions(
                            transactions.filter((tx) => tx.id !== t.id)
                          );
                        }
                      }}
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
