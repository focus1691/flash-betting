const initialState = {
  id: '',
  name: '',
  countryCode: '',
  currencyCode: '',
  localeCode: '',
  balance: '',
  time: new Date().toLocaleString(),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ACCOUNT_DETAILS':
      return {
        ...state,
        name: action.payload.name,
        countryCode: action.payload.countryCode.toLowerCase(),
        currencyCode: action.payload.currencyCode,
        localeCode: action.payload.localeCode,
      };
    case 'LAST_NAME':
      return action.payload;
    case 'ACCOUNT_BALANCE':
      return { ...state, balance: action.payload };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload };
    case 'SET_USER_ID':
      return { ...state, id: action.payload };
    default:
      return state;
  }
};

export default reducer;
