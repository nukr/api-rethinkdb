import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/meals', get);

function * get (next) {
  this.body = yield r.table('meals').run();
  yield next;
}

export default router.middleware();
