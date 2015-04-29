import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/bills', get);

function * get (next) {
  try {
    var cursor = yield r.table('bills').orderBy({index: r.desc('orderTime')}).limit(20).run(this._rdbConn);
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

