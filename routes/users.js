import r from 'rethinkdb';
import router from 'koa-router';

router = router();
router.get('/users', get);

function * get (next) {
  var cursor = yield r.table('tv_shows').run(this._rdbConn);
  var result = yield cursor.toArray();
  this.body = JSON.stringify(result);
  yield next;
}

export default router.middleware();

