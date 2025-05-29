"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/app/hooks/useUser";
import { addHouseholdBook } from "@/app/lib/householdbooks.service";
import { toast } from "sonner"

export default function CreateHouseholdBookPage() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Naam is verplicht.");
      return;
    }
    if (!user?.uid) {
      setError("Gebruiker niet gevonden.");
      return;
    }
    try {
      await addHouseholdBook({
        name,
        description,
        ownerId: user.uid,
      });
      toast("Event has been created.");
      router.push("/household-books");
    } catch {
      setError("Fout bij toevoegen.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nieuw huishoudboekje</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button type="submit">Aanmaken</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}