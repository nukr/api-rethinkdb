import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/users', get);

function * get (next) {
  var cursor = yield r.table('products').run(this._rdbConn);
  var result = yield cursor.toArray();
  this.body = result;
  yield next;
}

export default router.middleware();

