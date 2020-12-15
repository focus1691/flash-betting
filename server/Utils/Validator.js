function isAuthURL(url) {
  return url === '/api/login' || url === '/api/logout';
}

module.exports = {
  isAuthURL,
}