const sortAsc = arr => {
  if (!arr || arr.length <= 0) return [];

  arr = arr.sort(function(a, b) {
    return a[0] - b[0];
  });
  return arr;
};

const sortDes = arr => {
  if (!arr || arr.length <= 0) return [];

  arr = arr.sort(function(a, b) {
    return b[0] - a[0];
  });
  return arr;
};

export { sortAsc, sortDes };
