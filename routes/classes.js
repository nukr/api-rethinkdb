import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'

let debug = Debug('meepcloud:classes')
let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/classes/:className', get)
router.get('/classes', getAll)
router.post('/classes', create)
router.del('/classes/:className', del)

function * create (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  let body = yield parse.json(this)
  let result = yield r.db(serviceId).tableCreate(body.name)
  this.body = result
  yield next
}

function * get (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  let count = yield r.db(serviceId).table(this.params.className).count()
  let indexes = yield r.db(serviceId).table(this.params.className).indexList()
  this.body = {
    count: count,
    indexes: indexes
  }
  yield next
}

function * getAll (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).tableList()
  yield next
}

function * del (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).tableDrop(this.params.className)
  yield next
}

export default router.middleware();
