import { isEmpty } from 'lodash';

export const sortAsc2 = (arr) => {
  if (isEmpty(arr)) return [];
  arr = arr.sort((a, b) => a[0] - b[0]);
  return arr;
};

export const sortAsc = (arr) => {
  if (isEmpty(arr)) return [];
  arr = arr.sort((a, b) => a - b);
  return arr;
};


export const sortDes = (arr) => {
  if (isEmpty(arr)) return [];
  arr = arr.sort((a, b) => b - a);
  return arr;
};

export const sortSports = (sports) =>
  sports.sort((a, b) => {
    const nameA = a.eventType.name.toLowerCase();
    const nameB = b.eventType.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) return 1;
    return 0; // default return value (no sorting)
  });
