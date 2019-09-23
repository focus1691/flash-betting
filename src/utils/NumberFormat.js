const formatCurrency = (localeCode, currencyCode, number) => {
    console.log(number);
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
