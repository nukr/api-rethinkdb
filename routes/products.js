import r from 'rethinkdb';
import router from 'koa-router';

router = router();
router.get('/products', get);

function * get (next) {
  var cursor = yield r.table('tv_shows').run(this._rdbConn);
  var result = yield cursor.toArray();
  this.body = result;
  yield next;
}

export default router.routes();

