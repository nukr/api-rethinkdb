import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

import Debug from 'debug'
let debug = Debug('meals')

let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/object/:object', get);
router.post('/object', create)

function * get (next) {
  // http://api.meepcloud.com/_User
  // http://api.meepcloud.com/Object/Product
  // Token in header
  // AppId in header
  // 我要透過這兩個東西找到
  // this.body = r.db(this.accountName).table(AppId + ObjectName)

  this.body = yield r.table('meals').run();
  yield next;
}

function * create (next) {
  yield next
}

export default router.middleware();

