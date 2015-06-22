import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'

let debug = Debug('meepcloud:classes')
let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.post('/classes', create)

function * create (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  let body = yield parse.json(this)
  let result = yield r.db(appid).tableCreate(body.name)
  this.body = result
  yield next
}

export default router.middleware();


