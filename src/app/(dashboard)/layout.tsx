"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { Book, List, User, LogOut, Tag, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  SelectedHouseholdBookProvider,
  useSelectedHouseholdBook,
} from "@/app/context/SelectedHouseholdBookContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SelectedHouseholdBookProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SelectedHouseholdBookProvider>
  );
}

// Splits je layout op zodat je de hook in DashboardLayoutContent gebruikt:
function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { user, logout } = useUser();
  const [selectedBookId, setSelectedBookId, householdBooks] =
    useSelectedHouseholdBook();

  useEffect(() => {
    if (!user) return;
    if (!selectedBookId && householdBooks.length > 0) {
      setSelectedBookId(householdBooks[0].id);
    }
  }, [user, setSelectedBookId, selectedBookId, householdBooks]);

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-lg border-b">
          Huishoudboekjes
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <MenuLink href="/" icon={<Home className="w-4 h-4" />}>
            Dashboard
          </MenuLink>
          <MenuLink href="/household-books" icon={<Book className="w-4 h-4" />}>
            Boekjes
          </MenuLink>
          <MenuLink href="/transactions" icon={<List className="w-4 h-4" />}>
            Transacties
          </MenuLink>
          <MenuLink href="/categories" icon={<Tag className="w-4 h-4" />}>
            Categorieën
          </MenuLink>
        </nav>
        <div className="mt-auto px-4 py-4 border-t flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-5 h-5" />
            <span className="truncate">{user?.email ?? "Niet ingelogd"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </Button>
        </div>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-16 flex-shrink-0 border-b flex items-center px-6 bg-background font-semibold text-lg">
          <div className="flex items-center gap-4">
            <span>Huidig boekje:</span>
            <select
              value={selectedBookId ?? ""}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="border rounded px-2 py-1"
              disabled={householdBooks.length === 0}
            >
              {householdBooks.length === 0 ? (
                <option value="">Geen boekjes gevonden</option>
              ) : (
                householdBooks
                  .filter((book) => !book.archived)
                  .map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))
              )}
            </select>
          </div>
        </header>
        <main className="flex-1 min-h-0 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

// Helper for menu links
function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
