import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { HouseholdBookForm } from "../src/app/components/household-books/HouseholdBookForm";
import { HouseHoldBooksTable } from "../src/app/components/household-books/HouseHoldBooksTable";
import type { HouseholdBook } from "../src/app/types/householdbook";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// ---------- HouseholdBookForm Tests ----------
describe("HouseholdBookForm", () => {
  it("renders input fields and submit button", () => {
    render(<HouseholdBookForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/omschrijving/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /opslaan/i })).toBeInTheDocument();
  });

  it("shows validation errors if fields are empty", () => {
    render(<HouseholdBookForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /opslaan/i }));
    expect(screen.getByText(/naam is verplicht/i)).toBeInTheDocument();
    expect(screen.getByText(/omschrijving is verplicht/i)).toBeInTheDocument();
  });

  it("submits correct data", () => {
    const handleSubmit = jest.fn();
    render(<HouseholdBookForm onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: "Test Book" } });
    fireEvent.change(screen.getByLabelText(/omschrijving/i), { target: { value: "Test Desc" } });
    fireEvent.click(screen.getByRole("button", { name: /opslaan/i }));
    expect(handleSubmit).toHaveBeenCalledWith({ name: "Test Book", description: "Test Desc" });
  });
});

// ---------- HouseHoldBooksTable Tests ----------
describe("HouseHoldBooksTable", () => {
  const mockBooks: HouseholdBook[] = [
    { id: "1", name: "Boek 1", description: "Beschrijving 1", archived: false, userId: "user1" },
    { id: "2", name: "Boek 2", description: "Beschrijving 2", archived: true, userId: "user2" },
  ];

  it("renders a list of books", () => {
    render(<HouseHoldBooksTable books={mockBooks} />);
    expect(screen.getByText("Boek 1")).toBeInTheDocument();
    expect(screen.getByText("Boek 2")).toBeInTheDocument();
  });

  it("shows empty message when no books", () => {
    render(<HouseHoldBooksTable books={[]} />);
    expect(screen.getByText(/geen huishoudboekjes gevonden/i)).toBeInTheDocument();
  });

  it("calls onArchive when archive button clicked", () => {
    const handleArchive = jest.fn();
    render(<HouseHoldBooksTable books={[mockBooks[0]]} onArchive={handleArchive} />);
    fireEvent.click(screen.getByRole("button", { name: /archiveren/i }));
    expect(handleArchive).toHaveBeenCalledWith("1");
  });

  it("calls onDeArchive when de-archive button clicked", () => {
    const handleDeArchive = jest.fn();
    render(<HouseHoldBooksTable books={[mockBooks[1]]} onDeArchive={handleDeArchive} />);
    fireEvent.click(screen.getByRole("button", { name: /de-archiveer/i }));
    expect(handleDeArchive).toHaveBeenCalledWith("2");
  });
});
