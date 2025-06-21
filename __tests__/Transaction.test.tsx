import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionForm } from "@/app/components/transactions/TransactionForm";
import { TransactionsTable } from "@/app/components/transactions/TransactionsTable";
import { TransactionStatsBar } from "@/app/components/transactions/TransactionStatsBar";
import type { Transaction } from "@/app/types/transaction";
import React from "react";

jest.mock("@/app/hooks/useUser", () => ({ useUser: () => ({ user: { uid: "user-1" } }) }));
jest.mock("@/app/context/SelectedHouseholdBookContext", () => ({ useSelectedHouseholdBook: () => ["book-1"] }));
jest.mock("@/app/lib/categories.services", () => ({ listenCategories: jest.fn(() => () => {}) }));

describe("TransactionForm", () => {
  it("renders fields and submits valid form", () => {
    const handleSubmit = jest.fn();
    render(<TransactionForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/bedrag/i), { target: { value: "123.45" } });
    fireEvent.change(screen.getByLabelText(/datum/i), { target: { value: "2025-06-21" } });
    fireEvent.change(screen.getByLabelText(/omschrijving/i), { target: { value: "Boodschappen" } });
    fireEvent.click(screen.getByRole("button", { name: /opslaan/i }));

    expect(handleSubmit).toHaveBeenCalled();
  });
});

describe("TransactionsTable", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "t1",
      type: "income",
      amount: 100,
      date: "2025-06-01",
      householdBookId: "book-1",
      ownerId: "user-1",
      description: "Loon",
    },
    {
      id: "t2",
      type: "expense",
      amount: 50,
      date: "2025-06-02",
      householdBookId: "book-1",
      ownerId: "user-1",
      description: "Boodschappen",
    },
  ];

  const mockCategories = [{ id: "c1", name: "Eten" }];

  it("renders transactions", () => {
    render(
      <TransactionsTable
        transactions={mockTransactions}
        categories={mockCategories}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/loon/i)).toBeInTheDocument();
    expect(screen.getByText(/boodschappen/i)).toBeInTheDocument();
  });
});

describe("TransactionStatsBar", () => {
  it("renders stats and handles month change", () => {
    const setMonth = jest.fn();
    const onCreate = jest.fn();
    render(
      <TransactionStatsBar
        stats={{ income: 200, expense: 100, balance: 100 }}
        selectedMonth="2025-06"
        setSelectedMonth={setMonth}
        onCreate={onCreate}
      />
    );

    expect(screen.getByText(/inkomsten/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/maand/i), { target: { value: "2025-07" } });
    expect(setMonth).toHaveBeenCalledWith("2025-07");
    fireEvent.click(screen.getByRole("button", { name: /nieuwe transactie/i }));
    expect(onCreate).toHaveBeenCalled();
  });
});
