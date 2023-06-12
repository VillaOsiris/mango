import { formatCurrency, isAscending, isDataValid } from "../helperFunctions";

describe("formatCurrency", () => {
  test("Correctly formats the value to currency type", () => {
    expect(formatCurrency(100)).toContain("100");
  });
});

describe("isAscending", () => {
  test("Returns true if range of values is in ascending order", () => {
    expect(isAscending([1, 2, 3, 4, 5])).toBe(true);

    expect(isAscending([10, 20, 30, 40, 50])).toBe(true);
  });

  test("Returns false if range of values is not in ascending order", () => {
    expect(isAscending([5, 4, 3, 2, 1])).toBe(false);

    expect(isAscending([50, 40, 30, 20, 10])).toBe(false);
  });
});

describe("isDataValid", () => {
  test("Returns true if data is valid", () => {
    expect(isDataValid({ min: 0, max: 100 })).toBe(true);

    expect(isDataValid({ values: [1, 2, 3] })).toBe(true);
  });

  test("Returns false if data is not valid", () => {
    expect(isDataValid(100)).toBe(false);

    expect(isDataValid({ min: 0 })).toBe(false);

    expect(isDataValid({ max: 100 })).toBe(false);

    expect(isDataValid({})).toBe(false);
  });
});
