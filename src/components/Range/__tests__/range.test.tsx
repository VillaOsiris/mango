import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Range from "../index";
import { formatCurrency } from "@/utils/helperFunctions";

describe("Range slider component", () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Initial rendering with input values
   */

  test("renders the component with min and max values", () => {
    render(<Range min={1} max={100} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minInputElement: HTMLInputElement = screen.getByTestId("min-input");
    const maxInputElement: HTMLInputElement = screen.getByTestId("max-input");
    expect(minInputElement.value).toBe(formatCurrency(1));
    expect(maxInputElement.value).toBe(formatCurrency(100));
  });

  //fixed mode
  test("renders the component with range values", () => {
    render(<Range values={[100, 200, 300, 400]} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minSpanElement = screen.getByTestId("min-value");
    const maxSpanElement = screen.getByTestId("max-value");
    expect(minSpanElement.textContent).toBe(formatCurrency(100));
    expect(maxSpanElement.textContent).toBe(formatCurrency(400));
  });

  /**
   * Setting values Manually on the inputs
   */

  test("should update min and max values when manually changing the input", () => {
    render(<Range min={0} max={100} />);
    const minInputElement: HTMLInputElement = screen.getByTestId("min-input");
    const maxInputElement: HTMLInputElement = screen.getByTestId("max-input");
    fireEvent.change(minInputElement, {
      target: { value: formatCurrency(25) },
    });
    expect(minInputElement.value).toBe(formatCurrency(25));

    fireEvent.change(maxInputElement, {
      target: { value: formatCurrency(80) },
    });
    expect(maxInputElement.value).toBe(formatCurrency(80));
  });

  /**
   * Thumb Movement Constrains
   */

  test("updates min and max values when dragging the thumbs", () => {
    const main = render(<Range min={1} max={100} />);
    const minThumb = main.getByTestId("min-thumb");
    const maxThumb = main.getByTestId("max-thumb");

    fireEvent.mouseDown(minThumb);
    fireEvent.mouseMove(document, { clientX: -50 });
    fireEvent.mouseUp(minThumb);

    fireEvent.mouseDown(maxThumb);
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(minThumb);

    const minInputElement: HTMLInputElement = screen.getByTestId("min-input");
    const maxInputElement: HTMLInputElement = screen.getByTestId("max-input");
    console.log(minThumb);
    expect(minInputElement.value).toBe(formatCurrency(1));
    expect(maxInputElement.value).toBe(formatCurrency(100));
  });

  /**
   * Thumb apearence
   */

  test("Bullets have cursor grabbing on mouse down", async () => {
    render(<Range min={100} max={300} />);
    const minThumb = screen.getByTestId("min-thumb");

    Object.defineProperty(minThumb, "style", {
      value: {
        cursor: "grabbing",
      },
    });

    fireEvent.mouseDown(minThumb);
    expect(minThumb.style.cursor).toBe("grabbing");
  });
});
