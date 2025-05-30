import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/app/types/category";

const categorySchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  maxBudget: z.union([z.string(), z.number()]).optional(),
  endDate: z.string().optional(),
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setErrors({});
        const result = categorySchema.safeParse({ name, maxBudget, endDate });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
            if (err.path[0]) fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }
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
        <Input value={name} onChange={e => setName(e.target.value)} />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <Label>Maximaal budget</Label>
        <Input
          type="number"
          value={maxBudget}
          onChange={e => setMaxBudget(e.target.value)}
          min={0}
        />
        {errors.maxBudget && <p className="text-red-500">{errors.maxBudget}</p>}
      </div>
      <div>
        <Label>Einddatum</Label>
        <Input
          type="date"
          value={endDate ? endDate.slice(0, 10) : ""}
          onChange={e => setEndDate(e.target.value)}
        />
        {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
      </div>
      <Button type="submit">Opslaan</Button>
    </form>
  );
}