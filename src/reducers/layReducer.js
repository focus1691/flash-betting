import update from 'immutability-helper';
import { findIndex, omit } from 'lodash';

const initialState = {
  selected: false,
  stake: 2,
  price: 2,
  offset: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  executionTime: 'Before',
  selections: null,
  list: {}, //! {selectionId(parameter): [{executionTime: Before, timeOffset: (seconds) , size: (2) , price: (750) },]  }
};
initialState.text = `${initialState.stake} @ ${initialState.price}`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LAY_SELECTED':
      return { ...state, selected: !state.selected };
    case 'SET_LAY_TEXT':
      return { ...state, text: action.payload };
    case 'SET_LAY_STAKE':
      return { ...state, stake: action.payload };
    case 'SET_LAY_PRICE':
      return { ...state, price: action.payload };
    case 'SET_LAY_HOURS':
      return {
        ...state,
        offset: {
          hours: action.payload,
          minutes: state.offset.minutes,
          seconds: state.offset.seconds,
        },
      };
    case 'SET_LAY_MINUTES':
      return {
        ...state,
        offset: {
          hours: state.offset.hours,
          minutes: action.payload,
          seconds: state.offset.seconds,
        },
      };
    case 'SET_LAY_SECONDS':
      return {
        ...state,
        offset: {
          hours: state.offset.hours,
          minutes: state.offset.minutes,
          seconds: action.payload,
        },
      };
    case 'TOGGLE_LAY_EXECUTION_BEFORE_OR_AFTER':
      return { ...state, executionTime: action.payload };
    case 'SET_LAY_SELECTIONS':
      return { ...state, selections: action.payload };
    case 'UPDATE_LAY_LIST':
      return { ...state, list: action.payload };
    case 'ADD_LAY_BET':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId], action.payload],
        },
      };
    case 'REMOVE_LAY_BET':
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.selectionId]: [...state.list[action.payload.selectionId].filter((v) => v.rfs !== action.payload.rfs)],
        },
      };
    case 'REMOVE_ALL_SELECTION_LAY_BETS':
      return {
        ...state,
        list: omit(state.list, action.payload.selectionId),
      };
    case 'REMOVE_ALL_LAY_BETS':
      return {
        ...state,
        list: {},
      };
    case 'UPDATE_LAY_BET_PRICE':
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
