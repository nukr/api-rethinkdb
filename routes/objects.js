import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import config from '../config'
import parse from 'co-body'

import Debug from 'debug'
let debug = Debug('meals')

let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/objects/:object/:id', get)
router.get('/objects/:object', getAll)
router.post('/objects/:object', create)
router.put('/objects/:object/:id', update)
router.del('/objects/:object/:id', del)

function * get (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.object).get(this.params.id).run()
  yield next;
}

function * getAll (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.object).run()
  yield next;
}

function * create (next) {
  let body = yield parse.json(this)
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.object).insert(body).run()
  yield next
}

function * update (next) {
  let body = yield parse.json(this)
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.object).get(this.params.id).update(body).run()
  yield next
}

function * del (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.object).get(this.params.id).delete().run()
  yield next
}

export default router.middleware();

