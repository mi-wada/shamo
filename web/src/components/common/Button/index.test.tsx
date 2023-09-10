import { render, screen } from "@testing-library/react";
import { Button } from ".";

test("when loading is true", () => {
  render(
    <Button onClick={() => {}} loading={true}>
      Click me
    </Button>,
  );
  const button = screen.getByRole("button");

  expect(button).toBeDisabled();
  expect(button).toHaveTextContent("Loading...");
});

test("when loading is false", () => {
  render(
    <Button onClick={() => {}} loading={false}>
      Click me
    </Button>,
  );
  const button = screen.getByRole("button");

  expect(button).not.toBeDisabled();
  expect(button).toHaveTextContent("Click me");
});

test("when button clicked, onClick is called", () => {
  const mockOnClick = jest.fn();
  render(<Button onClick={mockOnClick}>Click me</Button>);
  const button = screen.getByRole("button");

  button.click();

  expect(mockOnClick).toBeCalledTimes(1);
});
