import r from 'rethinkdb';
import http from 'http';

export default function (config) {
  return function * rethinkdb (next) {
    try {
      let conn = yield r.connect(config.rethinkdb);
      this._rdbConn = conn;
    } catch (e) {
      this.status = 500;
      this.body = e.message || http.STATUS_CODES[this.status];
    }
    let ctx = this;
    this.rethinkdb = {
      * ensureIndex (table, indexName) {
        console.log('ensureIndex ...');
        let indexList = yield r.table(table).indexList().run(ctx._rdbConn);
        if (indexList.some(item => item === indexName)) {
          console.log(`${indexName} exists`);
        } else {
          console.log(`created ${indexName}`);
          yield r.table(table).indexCreate(indexName).run(ctx._rdbConn);
        }
      }
    };
    yield next;
    this._rdbConn.close();
  };
}
