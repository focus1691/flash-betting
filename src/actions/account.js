export const setAccountDetails = (details) => ({
  type: 'ACCOUNT_DETAILS',
  payload: details,
});

export const setBalance = (balance) => ({
  type: 'ACCOUNT_BALANCE',
  payload: balance,
});

export const setTime = (time) => ({
  type: 'UPDATE_TIME',
  payload: time,
});

export const setUserId = (id) => ({
  type: 'SET_USER_ID',
  payload: id,
})