import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/meals', get);

function * get (next) {
  var cursor = yield r.table('meals').run(this._rdbConn);
  this._results = yield cursor.toArray();
  yield next;
}

export default router.middleware();


