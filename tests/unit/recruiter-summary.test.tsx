import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the MDX import: vitest does not run the @next/mdx loader, so we
// substitute a deterministic component for the summary body.
vi.mock("@/content/recruiter-summary.mdx", () => ({
  default: () => <p>Currently targeting QA Automation, SDET, and related roles.</p>,
}));

import { RecruiterSummary } from "@/components/RecruiterSummary";

describe("RecruiterSummary", () => {
  it("renders the summary body inside an aside with an accessible label", () => {
    render(<RecruiterSummary />);
    const aside = screen.getByRole("complementary", { name: /recruiter summary/i });
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveTextContent(/Currently targeting/i);
  });
});
