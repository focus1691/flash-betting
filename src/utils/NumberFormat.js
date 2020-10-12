const formatCurrency = (localeCode, currencyCode, number) => {
  if (!localeCode || !currencyCode || typeof number !== 'number') return null;
  return new Intl.NumberFormat(
    localeCode.replace(/_/g, '-'),
    {
      style: 'currency',
      currency: currencyCode,
    },
  ).format(number);
};

const formatTotalMatched = (localeCode, currencyCode, number) => {
  if (!localeCode || !currencyCode || typeof number !== 'number') return null;

  return new Intl.NumberFormat(
    localeCode.replace(/_/g, '-'),
    {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).format(number);
};

export { formatCurrency, formatTotalMatched };
