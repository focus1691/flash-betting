import { omit } from 'lodash';
import { setupStorage, addNewMarket, removeMarket } from '../localStorage/sportsMenu';

setupStorage();

const initialState = {
  sports: [],
  submenuList: {},
  submenuListMyMarkets: {},
  myMarkets: JSON.parse(localStorage.getItem('myMarkets')),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SPORTS_LIST':
      return { ...state, sports: action.payload };
    case 'UPDATE_SUBMENU_LIST':
      return { ...state, submenuList: action.payload };
    case 'UPDATE_SUBMENU_LIST_MYMARKETS':
      return { ...state, submenuListMyMarkets: action.payload };
    case 'ADD_NEW_MARKET':
      addNewMarket(action.payload);
      return {
        ...state,
        myMarkets: {
          ...state.myMarkets,
          [action.payload.id]: {
            ...action.payload,
          },
        },
      };
    case 'REMOVE_MARKET':
      removeMarket(action.payload);
      return {
        ...state,
        myMarkets: omit(state.myMarkets, action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
