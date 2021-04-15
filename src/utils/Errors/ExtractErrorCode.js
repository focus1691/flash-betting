export default ((error) => {
  const { data } = error;
  let errorCode = '';
  if (data) {
    const { AccountAPINGException, APINGException } = data;
    if (AccountAPINGException) {
      errorCode = AccountAPINGException.errorCode;
    }
    else if (APINGException) {
      errorCode = APINGException.errorCode;
    }
  } else if (error) {
    errorCode = error;
  }
  return errorCode;
});
