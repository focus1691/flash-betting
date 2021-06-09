import { omit, omitBy } from 'lodash';

const initialState = {
  selected: false,
  offset: 5,
  units: 'Ticks',
  trailing: true,
  hedged: true,
  list: {},
  selections: null,
};
initialState.text = `${initialState.offset} ${initialState.units} [${initialState.trailing ? 'x' : '-'}][${initialState.hedged ? 'x' : '-'}]`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STOP_LOSS_SELECTED':
      return { ...state, selected: !state.selected };
    case 'SET_STOP_LOSS_TEXT':
      return { ...state, text: action.payload };
    case 'SET_STOP_LOSS_OFFSET':
      return { ...state, offset: action.payload };
    case 'SET_STOP_LOSS_UNITS':
      return { ...state, units: action.payload };
    case 'TOGGLE_STOP_LOSS_TRAILING':
      return { ...state, trailing: action.payload };
    case 'TOGGLE_STOP_LOSS_HEDGED':
      return { ...state, hedged: action.payload };
    case 'SET_STOP_LOSS_SELECTIONS':
      return { ...state, selections: action.payload };
    case 'UPDATE_STOP_LOSS_LIST':
      return { ...state, list: action.payload };
    case 'ADD_STOP_LOSS':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: {
            ...action.payload,
          },
        },
      };
    case 'SET_STOP_LOSS_BET_MATCHED':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: {
            ...state.list[action.payload.selectionId],
            assignedIsOrderMatched: true,
          },
        },
      };
    case 'REPLACE_STOP_LOSS':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: {
            ...state.list[action.payload.selectionId],
            size: action.payload.size,
            price: action.payload.price,
            units: action.payload.units,
            custom: action.payload.custom,
            assignedIsOrderMatched: action.payload.assignedIsOrderMatched,
            tickOffset: action.payload.tickOffset,
            hedged: action.payload.hedged,
          },
        },
      };
    case 'REMOVE_STOP_LOSS_ON_SIDE':
      return {
        ...state,
        list: omitBy(state.list, () => state.list[action.payload.selectionId].side === action.payload.side),
      };
    case 'REMOVE_STOP_LOSS':
      return {
        ...state,
        list: omit(state.list, action.payload.selectionId),
      };
    case 'REMOVE_ALL_STOP_LOSS':
      return {
        ...state,
        list: {},
      };
    case 'UPDATE_STOP_LOSS_BET_PRICE':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: {
            ...state.list[action.payload.selectionId],
            price: action.payload.price,
          },
        },
      };
    case 'UPDATE_STOP_LOSS_TICKS':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: {
            ...state.list[action.payload.selectionId],
            ticks: action.payload.ticks,
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
