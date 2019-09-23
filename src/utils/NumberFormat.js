const formatCurrency = (localeCode, currencyCode, number) => {
  return new Intl.NumberFormat(
    localeCode
      ? `${localeCode}-${localeCode.toUpperCase()}`
      : "gb-GB",
    {
      style: "currency",
      currency: currencyCode || "GBP"
    }
  ).format(number);
};

export { formatCurrency };
