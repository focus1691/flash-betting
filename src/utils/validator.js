function assertString(input) {
  const isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    let invalidType = typeof input;
    if (input === null) invalidType = 'null';
    else if (invalidType === 'object') invalidType = input.constructor.name;

    throw new TypeError(`Expected a string but received a ${invalidType}`);
  }
}

const decimal = {
  'en-US': '.',
  ar: '٫',
};

const numericNoSymbols = /^[0-9]+$/;

export function isNumeric(str, options) {
  assertString(str);
  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }
  return (new RegExp(`^[+-]?([0-9]*[${(options || {}).locale ? decimal[options.locale] : '.'}])?[0-9]+$`)).test(str);
}