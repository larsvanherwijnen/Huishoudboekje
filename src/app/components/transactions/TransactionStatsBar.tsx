import { Button } from "@/components/ui/button";

export function TransactionStatsBar({
  stats,
  selectedMonth,
  setSelectedMonth,
  onCreate,
}: {
  stats: { income: number; expense: number; balance: number };
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onCreate: () => void;
}) {
  return (
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
      <Button onClick={onCreate}>
        Nieuwe transactie
      </Button>
    </div>
  );
}