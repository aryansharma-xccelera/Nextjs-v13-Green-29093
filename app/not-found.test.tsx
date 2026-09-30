import { render } from "@testing-library/react";
import Page from "./not-found";

test("renders without crashing", () => {
  render(<Page />);
});
