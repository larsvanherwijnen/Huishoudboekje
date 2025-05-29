"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/app/hooks/useUser";
import {
  HouseholdBook,
  listenHouseholdBooks,
  archiveHouseholdBook,
  deArchiveHouseholdBook,
} from "@/app/lib/householdbooks.service";
import { toast } from "sonner";
export default function HouseholdBooksPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [books, setBooks] = useState<HouseholdBook[]>([]);
  const [tab, setTab] = useState<"active" | "archived">("active");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenHouseholdBooks(user.uid, setBooks);
    return () => unsubscribe && unsubscribe();
  }, [user]);

  if (loading) return <div className="p-8">Laden...</div>;
  if (!user) return null;

  async function handleArchive(id: string) {
    await archiveHouseholdBook(id);
    toast("Het huishoudboekje is gearchiveerd.");
  }

  async function handleDeArchive(id: string) {
    await deArchiveHouseholdBook(id);
    toast("Het huishoudboekje is gede-archiveerd.");
  }

  const activeBooks = books.filter((b) => !b.archived);
  const archivedBooks = books.filter((b) => b.archived);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Huishoudboekjes</CardTitle>
          <Button onClick={() => router.push("/household-books/create")}>
            Nieuw huishoudboekje
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "active" | "archived")}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="active">Actief</TabsTrigger>
              <TabsTrigger value="archived">Gearchiveerd</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <Table>
                <TableCaption>
                  Overzicht van je actieve huishoudboekjes.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Omschrijving</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBooks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>Geen actieve boekjes.</TableCell>
                    </TableRow>
                  )}
                  {activeBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.name}</TableCell>
                      <TableCell>{book.description}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/household-books/${book.id}/edit`)
                          }
                        >
                          Bewerken
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleArchive(book.id)}
                        >
                          Archiveer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="archived">
              <Table>
                <TableCaption>
                  Overzicht van je gearchiveerde huishoudboekjes.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Omschrijving</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedBooks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        Geen gearchiveerde boekjes.
                      </TableCell>
                    </TableRow>
                  )}
                  {archivedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.name}</TableCell>
                      <TableCell>{book.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeArchive(book.id)}
                        >
                          De-archiveer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
