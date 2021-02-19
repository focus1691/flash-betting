function isAuthURL(url) {
  return url.includes('login') || url.includes('logout') || url.includes('get-subscription-status') || url.includes('get-vendor-client-id') || url.includes('keep-alive');
}

module.exports = {
  isAuthURL,
};
