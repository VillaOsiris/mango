import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Range from "../index";
import { formatCurrency } from "@/utils/helperFunctions";

describe("Range slider component", () => {
  afterEach(cleanup);

  /**
   * Initial rendering with input values (exercise1)
   */
  test("renders the component with min and max values", () => {
    render(<Range min={1} max={100} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minInput = screen.getByTestId("min-input");
    const maxInput = screen.getByTestId("max-input");
    expect(minInput.value).toBe(formatCurrency(1));
    expect(maxInput.value).toBe(formatCurrency(100));
  });

  test("throws error when min is greater than max", () => {
    render(<Range min={100} max={50} />);
    const errorMessage = screen.getByText(
      "Invalid Minimum and Maximum values."
    );

    expect(errorMessage).toBeInTheDocument();
  });

  /**
   * Initial rendering with input array (exercise2)
   */

  test("renders the component with a range values array", () => {
    render(<Range values={[100, 200, 300, 400]} />);
    expect(screen.getByTestId("rangeSlider")).toBeInTheDocument();

    const minSpan = screen.getByTestId("min-value");
    const maxSpan = screen.getByTestId("max-value");
    expect(minSpan.textContent).toBe(formatCurrency(100));
    expect(maxSpan.textContent).toBe(formatCurrency(400));
  });

  test("throws error when values array is not in ascending order", () => {
    render(<Range values={[100, 300, 200, 400]} />);
    const errorMessage = screen.getByText("Invalid value range.");

    expect(errorMessage).toBeInTheDocument();
  });

  /**
   * Setting values Manually on the inputs
   */

  test("updates the minThumbValue when changing the minimum value input", () => {
    const { getByTestId } = render(<Range min={0} max={100} />);
    const minInput = getByTestId("min-input");

    fireEvent.click(minInput);
    fireEvent.change(minInput, { target: { value: "25" } });
    fireEvent.keyDown(minInput, { key: "Enter" });
    expect(minInput.value).toBe(formatCurrency(25));
  });

  test("updates the maxThumbValue when changing the maximum value input", () => {
    const { getByTestId } = render(<Range min={0} max={100} />);
    const maxInput = getByTestId("max-input");

    fireEvent.click(maxInput);
    fireEvent.change(maxInput, { target: { value: "75" } });
    fireEvent.keyDown(maxInput, { key: "Enter" });
    expect(maxInput.value).toBe(formatCurrency(75));
  });

  test("Doesn't updates the minInputValue when minimum value out of range", () => {
    const { getByTestId } = render(<Range min={0} max={100} />);
    const minInput = getByTestId("min-input");

    fireEvent.click(minInput);
    fireEvent.change(minInput, { target: { value: "125" } });
    fireEvent.keyDown(minInput, { key: "Enter" });
    expect(minInput.value).toBe(formatCurrency(0));
  });

  /**
   * Thumb Movement arrow keys
   */

  test("increments value when ArrowRight key is pressed", () => {
    render(<Range min={1} max={100} />);

    const minInput = screen.getByTestId("min-input");
    const minThumb = screen.getByTestId("min-thumb");

    minThumb.focus();
    for (let i = 1; i <= 110; i++) {
      fireEvent.keyDown(document, { key: "ArrowRight" });
      if (i === 10 || i === 50 || i === 90) {
        const expectedValue = formatCurrency(i + 1);
        expect(minInput).toHaveValue(expectedValue);
      }
      if (i === 110) {
        const expectedValue = formatCurrency(100);
        expect(minInput).toHaveValue(expectedValue);
      }
    }
    fireEvent.keyUp(document, { key: "ArrowRight" });
  });

  test("increments value when ArrowRight key is pressed on exercise 2", () => {
    render(<Range values={[100, 200, 300, 400]} />);

    const minSpan = screen.getByTestId("min-value");
    const minThumb = screen.getByTestId("min-thumb");

    minThumb.focus();
    for (let i = 1; i <= 3; i++) {
      fireEvent.keyDown(document, { key: "ArrowRight" });
      if (i === 1) {
        expect(minSpan).toHaveTextContent(200);
      }
      if (i === 2) {
        expect(minSpan).toHaveTextContent(300);
      }
    }
  });

  test("decrements value when ArrowLeft key is pressed", () => {
    render(<Range min={1} max={100} />);

    const maxInput = screen.getByTestId("max-input");
    const maxThumb = screen.getByTestId("max-thumb");

    maxThumb.focus();
    for (let i = 1; i <= 110; i++) {
      fireEvent.keyDown(document, { key: "ArrowLeft" });
      if (i === 10 || i === 50 || i === 90) {
        const expectedValue = formatCurrency(100 - i);
        expect(maxInput).toHaveValue(expectedValue);
      }
      if (i === 110) {
        const expectedValue = formatCurrency(1);
        expect(maxInput).toHaveValue(expectedValue);
      }
    }
    fireEvent.keyUp(document, { key: "ArrowLeft" });
  });

  test("decrements value when ArrowLeft key is pressed on exercise 2", () => {
    render(<Range values={[100, 200, 300, 400]} />);

    const maxSpan = screen.getByTestId("max-value");
    const maxThumb = screen.getByTestId("max-thumb");

    maxThumb.focus();
    for (let i = 1; i <= 3; i++) {
      fireEvent.keyDown(document, { key: "ArrowLeft" });
      if (i === 1) {
        expect(maxSpan).toHaveTextContent(300);
      }
      if (i === 2) {
        expect(maxSpan).toHaveTextContent(200);
      }
    }
  });

  /**
   * Thumb Movement Constrains
   */

  test("can't drag thumbs outside range provided by min and max values", () => {
    const main = render(<Range min={1} max={100} />);
    const minThumb = main.getByTestId("min-thumb");
    const maxThumb = main.getByTestId("max-thumb");

    fireEvent.mouseDown(minThumb);
    fireEvent.mouseMove(document, { clientX: -100 });
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(maxThumb);
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    const minInput = screen.getByTestId("min-input");
    const maxInput = screen.getByTestId("max-input");

    expect(minInput.value).toBe(formatCurrency(1));
    expect(maxInput.value).toBe(formatCurrency(100));
  });
});
