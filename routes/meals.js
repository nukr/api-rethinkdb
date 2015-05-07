import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/meals', get);

function * get (next) {
  var cursor = yield r.table('meals').run(this._rdbConn);
  this.body = yield cursor.toArray();
  yield next;
}

export default router.middleware();
