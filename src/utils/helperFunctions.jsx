// Format currency value
export const formatCurrency = (value) => {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
};
