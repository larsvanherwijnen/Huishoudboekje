import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Naam is verplicht.");
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
          required
        />
      </div>
      <div>
        <Label htmlFor="description" className="mb-2 block">Omschrijving</Label>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>Opslaan</Button>
    </form>
  );
}