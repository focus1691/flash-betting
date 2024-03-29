const _ = require('lodash');

class CookieJar {
  constructor() {
    this.cookies = {};
  }

  // serialize the whole jar
  serialize() {
    const cookies = [];
    _.each(this.cookies, (value, name) => {
      cookies.push([name, value].join('='));
    });
    return cookies.join('; ');
  }

  // parse string and add cookies to cookie var
  parse(cookies = []) {
    cookies.forEach((cookie) => {
      const parts = cookie.split(';');
      const [name, value] = parts[0].split('=');
      this.cookies[name] = value;
    });
  }

  // get cookie from jar
  get(name) {
    return this.cookies[name];
  }

  // store cookie to jar
  set(name, value) {
    this.cookies[name] = value;
  }
}

module.exports = new CookieJar();
