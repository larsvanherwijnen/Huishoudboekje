import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const bookSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  description: z.string().min(1, "Omschrijving is verplicht"),
});

export function HouseholdBookForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: { name?: string; description?: string };
  onSubmit: (data: { name: string; description?: string }) => void;
  loading?: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const result = bookSchema.safeParse({ name, description });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSubmit({ name, description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="mb-2 block">Naam</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="description" className="mb-2 block">Omschrijving</Label>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>
      <Button type="submit" disabled={loading}>Opslaan</Button>
    </form>
  );
}