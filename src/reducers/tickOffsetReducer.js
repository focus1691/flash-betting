import { omit, omitBy } from 'lodash';

const initialState = {
  selected: false,
  ticks: 2,
  units: 'Ticks',
  percentTrigger: 2,
  hedged: false,
  list: {},
};
initialState.text = `${initialState.ticks} ${initialState.units} [${initialState.hedged ? 'x' : '-'}]`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TICK_OFFSET_SELECTED':
      return { ...state, selected: !state.selected };
    case 'SET_TICK_OFFSET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_TICK_OFFSET_TICKS':
      return { ...state, ticks: action.payload };
    case 'SET_TICK_OFFSET_UNIT':
      return { ...state, units: action.payload };
    case 'SET_TICK_OFFSET_PERCENT_TRIGGER':
      return { ...state, percentTrigger: action.payload };
    case 'TOGGLE_TICK_OFFSET_HEDGED':
      return { ...state, hedged: action.payload };
    case 'UPDATE_TICK_OFFSET_LIST':
      return { ...state, list: action.payload };
    case 'ADD_TICK_OFFSET':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.rfs]: {
            ...action.payload,
          },
        },
      };
    case 'REMOVE_TICK_OFFSET_ON_SIDE':
      return {
        ...state,
        list: omitBy(state.list, () => state.list[action.payload.selectionId].side === action.payload.side),
      };
    case 'REMOVE_TICK_OFFSET':
      return {
        ...state,
        list: omit(state.list, action.payload.selectionId),
      };
    case 'REMOVE_ALL_TICK_OFFSET':
      return {
        ...state,
        list: {},
      };
    default:
      return state;
  }
};

export default reducer;
