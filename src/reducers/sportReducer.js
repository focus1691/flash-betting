const initialState = {
  sports: [],
  submenuList: {},
  submenuListMyMarkets: {},
  currentSubmenu: '',
  currentSubmenuMyMarkets: '',
  myMarkets: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SPORTS_LIST':
      return { ...state, sports: action.payload };
    case 'UPDATE_SUBMENU_LIST':
      return { ...state, submenuList: action.payload };
    case 'CLEAR_SUBMENU_LIST':
      return {
        ...state,
        submenuList: {},
        currentSubmenu: '',
      };
    case 'UPDATE_SUBMENU_LIST_MYMARKETS':
      return { ...state, submenuListMyMarkets: action.payload };
    case 'UPDATE_SUBMENU_CURRENT':
      return { ...state, currentSubmenu: action.payload };
    case 'UPDATE_SUBMENU_CURRENT_MYMARKETS':
      return { ...state, currentSubmenuMyMarkets: action.payload };
    case 'LOAD_MY_MARKETS':
      return { ...state, myMarkets: action.payload };
    default:
      return state;
  }
};

export default reducer;
