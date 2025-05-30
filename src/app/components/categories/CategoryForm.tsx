import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/app/types/category";

export function CategoryForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Category>;
  onSubmit: (data: Omit<Category, "id">) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [maxBudget, setMaxBudget] = useState(initial?.maxBudget ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const data: Omit<Category, "id"> = {
          ...initial,
          name,
        } as Omit<Category, "id">;
        if (maxBudget) data.maxBudget = Number(maxBudget);
        if (endDate) data.endDate = endDate;
        onSubmit(data);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Naam *</Label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Maximaal budget</Label>
        <Input
          type="number"
          value={maxBudget}
          onChange={e => setMaxBudget(e.target.value)}
          min={0}
        />
      </div>
      <div>
        <Label>Einddatum</Label>
        <Input
          type="date"
          value={endDate ? endDate.slice(0, 10) : ""}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      <Button type="submit">Opslaan</Button>
    </form>
  );
}