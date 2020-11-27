import { omit } from 'lodash';

const initialState = {
  selected: false,
  operator: '<',
  ticks: 3,
  stake: 2,
  price: 2,
  side: 'BACK',
  list: {},
  selections: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STOP_ENTRY_SELECTED':
      return { ...state, selected: !state.selected };
    case 'SET_STOP_ENTRY_OPERATOR':
      return { ...state, operator: action.payload };
    case 'SET_STOP_ENTRY_TICKS':
      return { ...state, ticks: action.payload };
    case 'SET_STOP_ENTRY_STAKE':
      return { ...state, stake: action.payload };
    case 'SET_STOP_ENTRY_PRICE':
      return { ...state, price: action.payload };
    case 'SET_STOP_ENTRY_SIDE':
      return { ...state, side: action.payload };
    case 'UPDATE_STOP_ENTRY_LIST':
      return { ...state, list: action.payload };
    case 'SET_STOP_ENTRY_SELECTIONS':
      return { ...state, selections: action.payload };
    case 'ADD_STOP_ENTRY_BET':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId], action.payload],
        },
      };
    case 'REMOVE_STOP_ENTRY_BET':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId].filter((v) => v.rfs !== action.payload.rfs)],
        },
      };
    case 'REMOVE_STOP_ENTRY_BETS_ON_SIDE':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId].filter((v) => v.side !== action.payload.side)],
        },
      };
    case 'REMOVE_ALL_STOP_ENTRY_BETS':
      return {
        ...state,
        list: omit(state.list, action.payload.selectionId),
      };
    default:
      return state;
  }
};

export default reducer;
