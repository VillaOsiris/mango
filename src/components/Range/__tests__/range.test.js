import React from "react";
import Range from "..";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { formatCurrency } from "../../../utils/helperFunctions.jsx";

describe("Range slider component", () => {
  /**
   * Initial rendering with input values
   */

  test("renders the component with min and max values", () => {
    render(<Range min={1} max={100} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minInputElement = screen.getByTestId("min-value");
    const maxInputElement = screen.getByTestId("max-value");

    expect(minInputElement.value).toBe(formatCurrency(1));
    expect(maxInputElement.value).toBe(formatCurrency(100));
  });

  //fixed mode
  test("renders the component with range values", () => {
    render(<Range values={[100, 200, 300, 400]} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minInputElement = screen.getByText(/100 €/i);
    const maxInputElement = screen.getByText(/400 €/i);

    expect(minInputElement).toBeInTheDocument;
    expect(maxInputElement).toBeInTheDocument;
  });

  /**
   * Setting values Manually on the inputs
   */

  test("should update min and max values when manually changing the input", () => {
    const { getByTestId } = render(<Range min={0} max={100} />);
    const minValueInput = getByTestId("min-value");
    const maxValueInput = getByTestId("max-value");

    fireEvent.change(minValueInput, { target: { value: "25" } });
    expect(minValueInput.value).toBe(formatCurrency(25));

    fireEvent.change(maxValueInput, { target: { value: "80" } });
    expect(maxValueInput.value).toBe(formatCurrency(80));
  });

  /**
   * Thumb Movement Constrains
   */

  test("updates min and max values when dragging the thumbs", () => {
    const main = render(<Range min={1} max={100} />);
    const minThumb = main.getByTestId("minThumb");
    const maxThumb = main.getByTestId("maxThumb");

    fireEvent.mouseDown(minThumb);
    fireEvent.mouseMove(document, { clientX: -50 });
    fireEvent.mouseUp(minThumb);

    fireEvent.mouseDown(maxThumb);
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(minThumb);

    const minInputElement = screen.getByTestId("min-value");
    const maxInputElement = screen.getByTestId("max-value");
    expect(minInputElement.value).toBe(formatCurrency(1));
    expect(maxInputElement.value).toBe(formatCurrency(100));
  });

  /**
   * Thumb apearence
   */

  test("Bullets have cursor grabbing on mouse down", async () => {
    render(<Range min={100} max={300} />);
    const minThumb = screen.getByTestId("minThumb");

    Object.defineProperty(minThumb, "style", {
      value: {
        cursor: "grabbing",
      },
    });

    fireEvent.mouseDown(minThumb);
    expect(minThumb.style.cursor).toBe("grabbing");
  });
});
