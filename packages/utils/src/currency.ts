export const formatINRCurrency = (amount: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);

