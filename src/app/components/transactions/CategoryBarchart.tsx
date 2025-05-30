"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { TooltipProps } from "recharts";

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const spent = payload.find((p: TooltipProps<number, string>["payload"][number]) => p.dataKey === "spent")?.value ?? 0;
    const budget = payload[0]?.payload?.budget ?? undefined;
    return (
      <div className="bg-white border rounded shadow p-2 text-xs">
        <div>
          <strong>{label}</strong>
        </div>
        <div>
          Uitgegeven: €{" "}
          {spent.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
        </div>
        {budget !== undefined && (
          <div>
            Gebudgetteerd: €{" "}
            {budget.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function CategoryBar({
  data,
  layout = "vertical", // "vertical" (default) or "horizontal"
}: {
  data: { name: string; spent: number; budget?: number }[];
  layout?: "vertical" | "horizontal";
}) {
  const stackedData = data.map((d) => ({
    ...d,
    budgetRest: d.budget && d.budget > d.spent ? d.budget - d.spent : 0,
    spent: d.spent,
    budget: d.budget ?? 0,
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Uitgaven vs. budget per categorie</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={Math.max(250, stackedData.length * 40)}
        >
          <BarChart
            data={stackedData}
            layout={layout === "horizontal" ? "vertical" : "horizontal"}
          >
            <XAxis type={layout === "horizontal" ? "number" : "category"} />
            <YAxis
              type={layout === "horizontal" ? "category" : "number"}
              dataKey="name"
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="spent" stackId="a" name="Uitgegeven">
              {stackedData.map((entry, idx) => {
                let color = "#22c55e";
                if (entry.budget) {
                  if (entry.spent > entry.budget) color = "#ef4444";
                  else if (entry.spent > entry.budget * 0.9) color = "#f59e42";
                }
                return <Cell key={entry.name} fill={color} />;
              })}
            </Bar>
            <Bar
              dataKey="budgetRest"
              stackId="a"
              name="Beschikbaar budget"
              fill="#d1fae5"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-xs mt-2 text-muted-foreground">
          <span
            className="inline-block w-3 h-3 rounded-full mr-1"
            style={{ background: "#22c55e" }}
          />{" "}
          Binnen budget
          <span
            className="inline-block w-3 h-3 rounded-full mx-2"
            style={{ background: "#f59e42" }}
          />{" "}
          Bijna op
          <span
            className="inline-block w-3 h-3 rounded-full mx-2"
            style={{ background: "#ef4444" }}
          />{" "}
          Over budget
          <span
            className="inline-block w-3 h-3 rounded-full mx-2"
            style={{ background: "#d1fae5" }}
          />{" "}
          Beschikbaar budget
        </div>
      </CardContent>
    </Card>
  );
}
