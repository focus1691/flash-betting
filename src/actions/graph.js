export const toggleTransparency = isSelected => {
  return {
    type: "TOGGLE_GRAPH_TRANSPARENCY",
    payload: isSelected
  };
};

export const openGraph = () => {
  return {
    type: "OPEN_GRAPH",
    payload: null
  };
};