"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SaldoChart({
  data,
}: {
  data: { date: string; saldo: number; income: number; expense: number }[];
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Saldo verloop (maand)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#22c55e" name="Inkomsten" />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Uitgaven" />
          <Line type="monotone" dataKey="saldo" stroke="#3b82f6" name="Saldo" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  );
}