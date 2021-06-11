export const toggleTransparency = (isSelected) => ({
  type: 'TOGGLE_GRAPH_TRANSPARENCY',
  payload: isSelected,
});

export const openGraph = () => ({
  type: 'OPEN_GRAPH',
  payload: null,
});

export const openLiveStream = () => ({
  type: 'OPEN_LIVE_STREAM',
  payload: null,
});
