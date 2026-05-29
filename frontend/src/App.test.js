import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Diamond Square authentication screen", () => {
  render(<App />);
  expect(screen.getByText(/Residential society operations/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^Login$/i })).toBeInTheDocument();
});
