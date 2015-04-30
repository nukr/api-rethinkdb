import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/bills', get);

function * createIndex (table, indexName) {
  let indexList = yield r.table('bills').indexList().run(this._rdbConn);
  if (indexList.some(item => item === indexName)) {
    console.log(`${indexName} exists`);
  } else {
    console.log(`created ${indexName}`);
    yield r.table(table).indexCreate(indexName).run(this._rdbConn);
  }
}

function * get (next) {
  createIndex('bills', 'createdAt');
  try {
    var cursor = yield r.table('bills').orderBy({index: r.desc('createdAt')}).limit(20).run(this._rdbConn);
    var result = yield cursor.toArray();
    this.body = result;
  } catch (e) {
    /* handle error */
    this.state = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

export default router.middleware();

