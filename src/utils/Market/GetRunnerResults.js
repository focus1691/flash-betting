export default ((runners) => {
  return runners.map(({ selectionId, status }) => ({ selectionId, status })).filter(({ status }) => status !== 'REMOVED');
});
