const sqlite3 = require('sqlite3').verbose();

class SQLiteDatabase {
  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.create();
    this.getThem();
  }

  create() {
    this.db.serialize(() => {
      this.db.run('CREATE TABLE lorem (info TEXT)');

      const stmt = this.db.prepare('INSERT INTO lorem VALUES (?)');
      for (let i = 0; i < 10; i += 1) {
        stmt.run(`Ipsum ${i}`);
      }
      stmt.finalize();
      console.log('1');
    });
  }

  getThem() {
    this.db.serialize(() => {
      this.db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
        console.log(`${row.id}: ${row.info}`);
      });
      console.log('2');
    });
  }
}

module.exports = new SQLiteDatabase();
