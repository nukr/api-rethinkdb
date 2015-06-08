import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'

let r = rethinkdbdash({host: '192.168.100.5', port: 28015})

let router = Router();
router.get('/meals', get);

function * get (next) {
  this.body = yield r.table('meals').run();
  yield next;
}

export default router.middleware();
