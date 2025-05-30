"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/app/types/transaction";
import { TransactionStatsBar } from "@/app/components/transactions/TransactionStatsBar";
import {
  listenTransactions,
  deleteTransaction,
} from "@/app/lib/transactions.service";
import { listenCategories } from "@/app/lib/categories.services";
import { format, parseISO } from "date-fns";
import { useSelectedHouseholdBook } from "@/app/context/SelectedHouseholdBookContext";
import SaldoChart from "@/app/components/transactions/MonthlyBalanceChart";
import CategoryBar from "@/app/components/transactions/CategoryBarchart";
import { TransactionsTable } from "@/app/components/transactions/TransactionsTable";

export default function TransactionsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [selectedBookId] = useSelectedHouseholdBook();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; maxBudget?: number }[]
  >([]);
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

  // Listen for transactions (realtime)
  useEffect(() => {
    if (!user || !selectedBookId) return;
    const unsubscribe = listenTransactions(
      user.uid,
      setTransactions,
      selectedMonth,
      selectedBookId
    );
    return () => unsubscribe();
  }, [user, selectedBookId, selectedMonth]);

  // Listen for categories (realtime)
  useEffect(() => {
    if (!selectedBookId) return;
    const unsubscribe = listenCategories(selectedBookId, setCategories);
    return () => unsubscribe();
  }, [selectedBookId, selectedMonth]);

  // Calculate stats
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

  // Lijngrafiek: som per dag
  const saldoChartData = useMemo(() => {
    const daysSet = new Set<string>();
    transactions.forEach((t) => {
      daysSet.add(format(parseISO(t.date), "dd-MM"));
    });
    const days = Array.from(daysSet).sort((a, b) => {
      const [da, ma] = a.split("-").map(Number);
      const [db, mb] = b.split("-").map(Number);
      return ma !== mb ? ma - mb : da - db;
    });

    let saldo = 0;
    const saldoData: {
      date: string;
      saldo: number;
      income: number;
      expense: number;
    }[] = [];
    days.forEach((day) => {
      let income = 0;
      let expense = 0;
      transactions
        .filter((t) => format(parseISO(t.date), "dd-MM") === day)
        .forEach((t) => {
          if (t.type === "income") {
            income += t.amount;
            saldo += t.amount;
          } else {
            expense += t.amount;
            saldo -= t.amount;
          }
        });
      saldoData.push({ date: day, saldo, income, expense });
    });
    return saldoData;
  }, [transactions]);

  // Staafdiagram: som per categorie
  const categoryBarData = useMemo(() => {
    return categories.map((cat) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        spent,
        budget: cat.maxBudget,
      };
    });
  }, [transactions, categories]);

  if (loading) return <div className="p-8">Laden...</div>;
  if (!user) return null;

  return (
    <div className="p-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Uitgaven & Inkomsten</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionStatsBar
            stats={stats}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            onCreate={() => router.push("/transactions/create")}
          />
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transacties</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={transactions}
            categories={categories}
            onEdit={(id) => router.push(`/transactions/${id}/edit`)}
            onDelete={async (id) => {
              if (
                confirm(
                  "Weet je zeker dat je deze transactie wilt verwijderen?"
                )
              ) {
                await deleteTransaction(id);
                setTransactions(transactions.filter((tx) => tx.id !== id));
              }
            }}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col">
        <SaldoChart data={saldoChartData} />
        <CategoryBar data={categoryBarData} layout="horizontal" />{" "}
      </div>
    </div>
  );
}
