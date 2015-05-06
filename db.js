import r from 'rethinkdb';

export default function (config) {
  return function * rethinkdb(next) {
    try {
      let conn = yield r.connect(config.rethinkdb);
      this._rdbConn = conn;
    } catch (e) {
      this.status = 500;
      this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
    this._rdbConn.close();
  };
}

