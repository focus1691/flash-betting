const initialState = {
  oneClickOn: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_ONE_CLICK':
      return { ...state, oneClickOn: action.payload };
    default:
      return state;
  }
};

export default reducer;
