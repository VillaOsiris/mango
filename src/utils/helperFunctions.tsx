// Format currency value
export const formatCurrency = (value: number) => {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
};
