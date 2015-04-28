import r from 'rethinkdb';
import config from './config';

class Database {
  *createConnection (next) {
    try {
      let conn = yield r.connect(config.rethinkdb);
      this._rdbConn = conn;
    } catch (e) {
      this.status = 500;
      this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
  }

  *closeConnection (next) {
    this._rdbConn.close();
  }
}

export default Database;
