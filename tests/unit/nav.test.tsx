import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Nav } from "@/components/Nav";
import { primaryNav } from "@/lib/site-config";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("Nav", () => {
  it("renders every primary nav link", () => {
    render(<Nav />);
    for (const item of primaryNav) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("marks the active route with aria-current=page", () => {
    render(<Nav />);
    const active = screen.getByRole("link", { name: "Projects" });
    expect(active).toHaveAttribute("aria-current", "page");
    const inactive = screen.getByRole("link", { name: "Blog" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });
});
