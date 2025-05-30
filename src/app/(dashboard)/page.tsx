"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welkom op je dashboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Selecteer een huishoudboekje of kies een onderdeel in het menu om te beginnen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}