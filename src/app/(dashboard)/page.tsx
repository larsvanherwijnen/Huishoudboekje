"use client";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Welkom bij Huishoudboekjes</h1>
      <p className="text-muted-foreground mb-2">
        Hier vind je een overzicht van je huishoudboekjes, uitgaven en categorieën.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
        <li>Bekijk en beheer je huishoudboekjes</li>
        <li>Voeg nieuwe uitgaven of inkomsten toe</li>
        <li>Analyseer je financiën met grafieken en tabellen</li>
        <li>Navigeer via het menu aan de linkerkant</li>
      </ul>
    </div>
  );
}