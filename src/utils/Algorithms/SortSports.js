const sortSports = (sports) => sports.sort((a, b) => {
  const nameA = a.eventType.name.toLowerCase(); const
    nameB = b.eventType.name.toLowerCase();
  if (nameA < nameB) { return -1; }
  if (nameA > nameB) return 1;
  return 0; // default return value (no sorting)
});

export { sortSports };
