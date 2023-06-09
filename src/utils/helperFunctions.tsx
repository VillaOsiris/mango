// Format currency value
export const formatCurrency = (value: number) => {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
};

export const isAscending = (arr: number[]) => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
};

export const isDataValid = (data: any) => {
  return (
    typeof data === "object" &&
    ((data.hasOwnProperty("min") && data.hasOwnProperty("max")) ||
      data.hasOwnProperty("values"))
  );
};
