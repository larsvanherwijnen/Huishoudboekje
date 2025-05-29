"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getHouseholdBook,
  updateHouseholdBook,
} from "@/app/lib/householdbooks.service";
import { toast } from "sonner"

export default function EditHouseholdBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getHouseholdBook(id).then(book => {
      if (!book) {
        setError("Boekje niet gevonden.");
        setLoading(false);
        return;
      }
      setName(book.name || "");
      setDescription(book.description || "");
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Naam is verplicht.");
      return;
    }
    try {
      await updateHouseholdBook(id, {
        name,
        description,
      });
      toast("Huishoudboekje is bijgewerkt.");
      router.push("/household-books");
    } catch (err) {
      setError("Fout bij opslaan.");
    }
  }

  if (loading) return <div className="p-8">Laden...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Huishoudboekje bewerken</CardTitle>
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
            <Button type="submit">Opslaan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}