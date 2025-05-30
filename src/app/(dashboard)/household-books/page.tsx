"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/app/hooks/useUser";
import {
  HouseholdBook,
  listenHouseholdBooks,
  archiveHouseholdBook,
  deArchiveHouseholdBook,
} from "@/app/lib/householdbooks.service";
import { toast } from "sonner";
import { HouseHoldBooksTable } from "@/app/components/household-books/HouseHoldBooksTable";

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
              <HouseHoldBooksTable
                books={activeBooks}
                onDelete={handleArchive}
              />
            </TabsContent>
            <TabsContent value="archived">
              <HouseHoldBooksTable
                books={archivedBooks}
                onDelete={handleDeArchive}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
