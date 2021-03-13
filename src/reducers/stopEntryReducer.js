import update from 'immutability-helper';
import { findIndex, omit } from 'lodash';

const initialState = {
  selected: false,
  operator: '<',
  targetLTP: 3,
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
    case 'SET_TARGET_LTP':
      return { ...state, targetLTP: action.payload };
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
    case 'REMOVE_MULTI_SELECTION_STOP_ENTRY_BETS':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId].filter((v) => !action.payload.betsToRemove.includes(v.rfs))],
        },
      };
    case 'REMOVE_ALL_SELECTION_STOP_ENTRY_BETS':
      return {
        ...state,
        list: omit(state.list, action.payload.selectionId),
      };
    case 'REMOVE_ALL_STOP_ENTRY_BETS':
      return {
        ...state,
        list: {},
      };
    case 'UPDATE_STOP_ENTRY_BET_PRICE':
      return update(state, {
        list: {
          [action.payload.selectionId]: {
            [findIndex(state.list[action.payload.selectionId], { rfs: action.payload.rfs })]: {
              price: {
                $set: action.payload.price,
              },
            }
          },
        },
      });
    default:
      return state;
  }
};

export default reducer;
