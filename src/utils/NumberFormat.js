const formatCurrency = (localeCode, currencyCode, number) => new Intl.NumberFormat(
  'gb-GB',
  {
    style: 'currency',
    currency: 'GBP',
  },
).format(number);

const formatTotalMatched = (localeCode, currencyCode, number) => new Intl.NumberFormat(
  localeCode
    ? `${localeCode}-${localeCode.toUpperCase()}`
    : 'gb-GB',
  {
    style: 'currency',
    currency: currencyCode || 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
).format(number);

export { formatCurrency, formatTotalMatched };
