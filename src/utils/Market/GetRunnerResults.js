export default ((runners) => {
  return runners.map(({ marketId, selectionId, status }) => ({ marketId, selectionId, status }).filter(({ status }) => status !== 'REMOVED'));
});
