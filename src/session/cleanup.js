export const clearCookies = (cookies) => {
  cookies.remove('username');
  cookies.remove('sessionKey');
  cookies.remove('accessToken');
};

export const redirectToLogin = () => {
  window.location.href = window.location.origin;
};
