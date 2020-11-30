/* eslint-disable max-classes-per-file */
// (C) 2016 Anton Zemlyanov, rewritten in JavaScript 6 (ES6)

/*
 * This logger generates bunyan-compatible logs
 * use 'npm install -g bunyan' to install log formatter
 */

const os = require('os');
const fs = require('fs');
const _ = require('lodash');

const LOG_LEVELS = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

class Logger {
  constructor(name, logLevel = 'INFO') {
    this.name = name;
    this.currentLogLevel = LOG_LEVELS[logLevel.toUpperCase()];
    this.logs = [];

    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
      this[level] = (message, data) => {
        const logLevel = LOG_LEVELS[level.toUpperCase()];
        if (logLevel < this.currentLogLevel) {
          return;
        }
        const now = new Date();
        const logItem = {
          name: this.name,
          hostname: os.hostname(),
          pid: process.pid,
          level: logLevel,
          msg: message,
          time: now.toISOString(),
          v: '0',
        };
        if (data) {
          if (_.isArray(data)) {
            data = { data };
          }
          _.extend(logItem, data);
        }
        this.logs.forEach((log) => { log.write(logItem); });
      };
    });
  }

  addFileLog(filename) {
    const log = new FileLog(filename);
    this.logs.push(log);
    return log;
  }

  addMemoryLog(limit) {
    const log = new MemoryLog(limit);
    this.logs.push(log);
    return log;
  }

  close() {
    this.logs.forEach((log) => {
      log.close();
    });
    this.logs = [];
  }
}

class FileLog {
  constructor(filename) {
    this.file = fs.createWriteStream(filename, { flags: 'w', defaultEncoding: 'utf8', autoClose: true });
    this.file.on('error', (error) => {
      console.log('file log error', error);
    });
  }

  write(data) {
    this.file.write(`${JSON.stringify(data)}\n`);
  }

  close() {
    this.file.end();
  }
}

class MemoryLog {
  constructor(limit = 256) {
    this.limit = limit;
    this.log = [];
  }

  write(data) {
    this.log.push(data);
    while (this.log.length > this.limit) {
      this.log.shift();
    }
  }

  flush() {
  }

  getRecords() {
    return this.log;
  }
}

module.exports = Logger;
