"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Home, Book, Archive, List, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/hooks/useUser";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useUser();

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-lg border-b">
          Huishoudboekjes
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <MenuLink href="/dashboard" icon={<Home className="w-4 h-4" />}>
            Dashboard
          </MenuLink>
          <MenuLink href="/household-books" icon={<Book className="w-4 h-4" />}>
            Boekjes
          </MenuLink>
          <MenuLink href="/household-books/archived" icon={<Archive className="w-4 h-4" />}>
            Gearchiveerd
          </MenuLink>
          <MenuLink href="/transactions" icon={<List className="w-4 h-4" />}>
            Transacties
          </MenuLink>
          <MenuLink href="/categories" icon={<List className="w-4 h-4" />}>
            Categorieën
          </MenuLink>
          <MenuLink href="/users" icon={<User className="w-4 h-4" />}>
            Gebruikers
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
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6 bg-background font-semibold text-lg">
        </header>
        <main className="flex-1 p-6">{children}</main>
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