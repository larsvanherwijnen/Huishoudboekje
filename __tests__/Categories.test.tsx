import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoriesTable } from "../src/app/components/categories/CategoriesTable";
import { CategoryForm } from "../src/app/components/categories/CategoryForm";

import { useRouter } from "next/navigation";
import type { Category } from "@/app/types/category";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push });

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fletcher",
    maxBudget: 100,
    endDate: "2025-12-31",
    householdBookId: "book-1",
    userId: "user-1",
  },
];

describe("CategoriesTable", () => {
  it("renders category name and budget", () => {
    render(<CategoriesTable categories={mockCategories} onDelete={jest.fn()} />);

    expect(screen.getByText("Fletcher")).toBeInTheDocument();
    expect(screen.getByText("€ 100")).toBeInTheDocument();
  });

  it("renders 'Bewerken' and 'Verwijderen' buttons", () => {
    render(<CategoriesTable categories={mockCategories} onDelete={jest.fn()} />);

    const editButtons = screen.getAllByRole("button", { name: /bewerken/i });
    const deleteButtons = screen.getAllByRole("button", { name: /verwijderen/i });

    expect(editButtons).toHaveLength(1);
    expect(deleteButtons).toHaveLength(1);
  });

  it("renders empty message when no categories exist", () => {
    render(<CategoriesTable categories={[]} onDelete={jest.fn()} />);

    expect(screen.getByText(/geen categorieën gevonden/i)).toBeInTheDocument();
  });

  it("calls router.push when 'Bewerken' is clicked", () => {
    render(<CategoriesTable categories={mockCategories} onDelete={jest.fn()} />);

    const editButton = screen.getByRole("button", { name: /bewerken/i });
    fireEvent.click(editButton);

    expect(push).toHaveBeenCalledWith("/categories/1/edit");
  });

  it("calls onDelete with correct id when 'Verwijderen' is clicked", () => {
    const onDeleteMock = jest.fn();

    render(<CategoriesTable categories={mockCategories} onDelete={onDeleteMock} />);

    const deleteButton = screen.getByRole("button", { name: /verwijderen/i });
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });
});

describe("CategoryForm", () => {
  it("renders all input fields and button", () => {
    render(<CategoryForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximaal budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/einddatum/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /opslaan/i })).toBeInTheDocument();
  });

  it("shows validation error if 'name' is empty", () => {
    render(<CategoryForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /opslaan/i }));

    expect(screen.getByText(/naam is verplicht/i)).toBeInTheDocument();
  });

  it("submits valid form data", () => {
    const handleSubmit = jest.fn();
    render(<CategoryForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: "Boodschappen" } });
    fireEvent.change(screen.getByLabelText(/maximaal budget/i), { target: { value: "250" } });
    fireEvent.change(screen.getByLabelText(/einddatum/i), { target: { value: "2025-12-31" } });

    fireEvent.click(screen.getByRole("button", { name: /opslaan/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Boodschappen",
      maxBudget: 250,
      endDate: "2025-12-31",
    });
  });

  it("renders with initial values", () => {
    render(
      <CategoryForm
        initial={{
          name: "Reizen",
          maxBudget: 1000,
          endDate: "2025-08-01",
          householdBookId: "h1",
          userId: "u1",
        }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/naam/i)).toHaveValue("Reizen");
    expect(screen.getByLabelText(/maximaal budget/i)).toHaveValue(1000);
    expect(screen.getByLabelText(/einddatum/i)).toHaveValue("2025-08-01");
  });
});
