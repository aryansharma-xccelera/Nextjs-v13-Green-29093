import { render } from "@testing-library/react";
import { vi } from "vitest";
import Page from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/dashboard",
}));

test("renders without crashing", () => {
  render(<Page />);
});
