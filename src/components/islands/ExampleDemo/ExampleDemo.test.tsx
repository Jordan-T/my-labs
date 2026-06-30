import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { findA11yViolations } from "@/test/axe";
import ExampleDemo from "./ExampleDemo";

describe("ExampleDemo", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<ExampleDemo />);
    expect(await findA11yViolations(container)).toEqual([]);
  });

  it("does not decrement below zero", () => {
    const { getByText, getByRole } = render(<ExampleDemo />);
    fireEvent.click(getByText("Diminuer"));
    expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("increments when augmenting", () => {
    const { getByText, getByRole } = render(<ExampleDemo />);
    fireEvent.click(getByText("Augmenter"));
    expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("1");
  });
});
