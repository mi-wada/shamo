import { render, screen } from "@testing-library/react";
import { Link } from ".";

describe("when href is external", () => {
  test("href starts with http", () => {
    render(<Link href="http://example.com">home</Link>);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("href starts with https", () => {
    render(<Link href="https://example.com">home</Link>);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("when href is not external", () => {
  test("href is path", () => {
    render(<Link href="/home">home</Link>);
    const link = screen.getByRole("link");

    expect(link).not.toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("rel", "noopener noreferrer");
  });

  test("href is fragment", () => {
    render(<Link href="#top">home</Link>);
    const link = screen.getByRole("link");

    expect(link).not.toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("rel", "noopener noreferrer");
  });
});
