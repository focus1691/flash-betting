function isAuthURL(url) {
  return url.includes('login') ||
    url.includes('logout') ||
    url.includes('get-subscription-status') ||
    url.includes('get-vendor-client-id') ||
    url.includes('keep-alive') ||
    url.includes('registration-status') ||
    url.includes('authenticate-user');
}

module.exports = {
  isAuthURL,
};
