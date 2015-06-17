import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import config from '../config'
import Redis from 'ioredis'

const redis = new Redis(6379, '192.168.100.5')

let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/meals', get);

function * get (next) {
  let result = yield redis.get(this.header['x-meepcloud-access-token'])
  if (result !== null) {
    this.body = yield r.table('meals').run();
  } else {
    this.body = 'you dont have rights to access this table'
  }
  yield next;
}

export default router.middleware();
