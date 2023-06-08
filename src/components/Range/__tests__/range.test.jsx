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
    const renderRangeWithInvalidValues = () => {
      render(<Range min={100} max={50} />);
    };

    expect(renderRangeWithInvalidValues).toThrow(
      "Invalid min and max values. Min value must be smaller than max value."
    );
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
    const renderRangeWithInvalidValues = () => {
      render(<Range values={[100, 300, 200, 400]} />);
    };

    expect(renderRangeWithInvalidValues).toThrow(
      "Invalid values array. The values must be in ascending order."
    );
  });

  /**
   * Setting values Manually on the inputs
   */

  test("should update min and max values when manually changing the input", () => {
    render(<Range min={1} max={100} />);
    const minInput = screen.getByTestId("min-input");
    const maxInput = screen.getByTestId("max-input");
    fireEvent.change(minInput, {
      target: { value: formatCurrency(25) },
    });
    expect(minInput).toHaveValue(formatCurrency(25));

    fireEvent.change(maxInput, {
      target: { value: formatCurrency(80) },
    });
    expect(maxInput).toHaveValue(formatCurrency(80));
  });

  /**
   * Thumb Movement arrow keys
   */

  test("increments min value when ArrowRight key is pressed", () => {
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

  test("decrements min value when ArrowLeft key is pressed", () => {
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

  test("increments max value when ArrowRight key is pressed", () => {
    render(<Range min={1} max={100} />);
    const maxInput = screen.getByTestId("max-input");
    const maxThumb = screen.getByTestId("max-thumb");
    maxInput.value = formatCurrency(80);

    maxThumb.focus();
    for (let i = 1; i <= 110; i++) {
      fireEvent.keyDown(document, { key: "ArrowRight" });
      console.log(maxInput.value);

      if (i === 10 || i === 50 || i === 90) {
        const expectedValue = formatCurrency(80 - i);
        expect(maxInput.value).toBe(expectedValue);
      }
      if (i === 110) {
        const expectedValue = formatCurrency(100);
        expect(maxInput.value).toBe(expectedValue);
      }
    }
    fireEvent.keyUp(document, { key: "ArrowRight" });
  });

  test("Doesn't increments min value over maxThumbvalue", () => {
    render(<Range min={1} max={100} />);
    const minThumb = screen.getByTestId("min-thumb");
    const minInput = screen.getByTestId("min-input");
    const maxInput = screen.getByTestId("max-input");
    maxInput.value = formatCurrency(80);

    minThumb.focus();
    for (let i = 1; i <= 110; i++) {
      fireEvent.keyDown(document, { key: "ArrowRight" });
      console.log(minInput.value);
      if (i >= 110) {
        const expectedValue = formatCurrency(80);
        expect(minInput.value).toBe(expectedValue);
      }
    }
    fireEvent.keyUp(document, { key: "ArrowRight" });
  });

  test("decrements min value when ArrowLeft key is pressed", () => {
    render(<Range min={1} max={100} />);
    const minThumb = screen.getByTestId("min-thumb");
    const minInput = screen.getByTestId("min-input");
    minInput.value = formatCurrency(20);

    minThumb.focus();
    for (let i = 1; i <= 35; i++) {
      fireEvent.keyDown(document, { key: "ArrowLeft" });
      console.log(minInput.value);
      if (i === 10 || i === 20) {
        const expectedValue = formatCurrency(20 - i);
        expect(minInput.value).toBe(expectedValue);
      }
      if (i === 35) {
        const expectedValue = formatCurrency(1);
        expect(minInput.value).toBe(expectedValue);
      }
    }
    fireEvent.keyUp(document, { key: "ArrowLeft" });
  });

  /**
   * Thumb Movement Constrains
   */

  //FALSE POSITIVE
  test("updates min and max values when dragging the thumbs", () => {
    const main = render(<Range min={1} max={100} />);
    const minThumb = main.getByTestId("min-thumb");
    const maxThumb = main.getByTestId("max-thumb");

    fireEvent.mouseDown(minThumb);
    fireEvent.mouseMove(minThumb, { clientX: 100 });
    fireEvent.mouseUp(minThumb);

    fireEvent.mouseDown(maxThumb);
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(minThumb);

    const minInput = screen.getByTestId("min-input");
    const maxInput = screen.getByTestId("max-input");

    expect(minInput.value).toBe(formatCurrency(1));
    expect(maxInput.value).toBe(formatCurrency(100));
  });

  /**
   * Thumb apearence
   */

  //FALSE POSITIVE
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

//FALSE POSITIVE
test("thumbs do not cross each other when dragging", () => {
  render(<Range min={1} max={100} />);

  const minThumb = screen.getByTestId("min-thumb");
  const maxThumb = screen.getByTestId("max-thumb");
  const minInput = screen.getByTestId("min-input");
  const maxInput = screen.getByTestId("max-input");

  fireEvent.mouseDown(minThumb);
  fireEvent.mouseMove(document, { clientX: 70 });
  fireEvent.mouseUp(document);

  fireEvent.mouseDown(maxThumb);
  fireEvent.mouseMove(document, { clientX: 40 });
  fireEvent.mouseUp(document);

  const minValue = Number(minInput.value.replace(/[^0-9.-]+/g, ""));
  const maxValue = Number(maxInput.value.replace(/[^0-9.-]+/g, ""));

  expect(minValue).toBeLessThanOrEqual(maxValue);
});

test("handles backspace key press", () => {
  render(<Range min={1} max={100} />);
  const minInput = screen.getByTestId("min-input");

  minInput.focus();
  fireEvent.keyDown(minInput, { key: "Backspace" });

  expect(minInput.select()).toHaveBeenCalledTimes(1);
});
