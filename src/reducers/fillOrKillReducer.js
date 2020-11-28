import { omit, omitBy } from 'lodash';

const initialState = {
  selected: false,
  seconds: 10,
  list: {},
};
initialState.text = `${initialState.seconds} seconds`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILL_OR_KILL_SELECTED':
      return { ...state, selected: !state.selected };
    case 'SET_FILL_OR_KILL_TEXT':
      return { ...state, text: action.payload };
    case 'SET_FILL_OR_KILL_TIME':
      return { ...state, seconds: action.payload };
    case 'UPDATE_FILL_OR_KILL_LIST':
      return { ...state, list: action.payload };
    case 'ADD_FILL_OR_KILL':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.betId]: {
            ...action.payload,
          },
        },
      };
    case 'REMOVE_FILL_OR_KILL':
      return {
        ...state,
        list: omit(state.list, action.payload.betId),
      };
    case 'REMOVE_ALL_FILL_OR_KILL':
      return {
        ...state,
        list: {},
      };
    default:
      return state;
  }
};

export default reducer;
