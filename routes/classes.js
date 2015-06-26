import Router from 'koa-router';
import r from '../utils/rdb'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'

let debug = Debug('meepcloud:classes')

let router = Router();
router.get('/classes/:className', get)
router.get('/classes', getAll)
router.post('/classes', create)
router.del('/classes/:className', del)

function * create (next) {
  let body = yield parse.json(this)
  let result = yield r.db(this.meepcloudDbName).tableCreate(body.name)
  this.body = result
  yield next
}

function * get (next) {
  let count = yield r.db(this.meepcloudDbName).table(this.params.className).count()
  let indexes = yield r.db(this.meepcloudDbName).table(this.params.className).indexList()
  this.body = {
    count: count,
    indexes: indexes
  }
  yield next
}

function * getAll (next) {
  this.body = yield r.db(this.meepcloudDbName).tableList()
  yield next
}

function * del (next) {
  this.body = yield r.db(this.meepcloudDbName).tableDrop(this.params.className)
  yield next
}

export default router.middleware();
