import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("renders a radiogroup with three theme options", () => {
    render(<ThemeToggle />);
    const group = screen.getByRole("radiogroup", { name: /theme/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /light theme/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /dark theme/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /warm theme/i })).toBeInTheDocument();
  });

  it("marks the currently active theme with aria-checked=true", () => {
    document.documentElement.setAttribute("data-theme", "warm");
    render(<ThemeToggle />);
    expect(screen.getByRole("radio", { name: /warm theme/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: /light theme/i })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("clicking a theme updates data-theme and localStorage", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: /dark theme/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    await user.click(screen.getByRole("radio", { name: /warm theme/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("warm");
    expect(window.localStorage.getItem("theme")).toBe("warm");

    await user.click(screen.getByRole("radio", { name: /light theme/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem("theme")).toBe("light");
  });
});
