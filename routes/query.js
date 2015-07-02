import Router from 'koa-router';
import r from '../utils/rdb'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'
import reqlDriver from '../../reql-replay-driver'

let debug = Debug('meepcloud:query')
let router = Router();

router.post('/query', query)

function * query (next) {
  let body = yield parse(this)
  reqlDriver.options(config.rethinkdb)
  let query = new reqlDriver(body, this.meepcloudDbName)
  try {
    var result = yield query.run()
    this.body = result
  } catch (e) {
    this.status = 500
    this.message = e.message
  }
  yield next
}

export default router.middleware()
