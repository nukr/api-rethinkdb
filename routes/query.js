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
  reqlDriver.db({host: '192.168.184.5'})
  let query = new reqlDriver(body)
  let result = yield query.run()
  this.body = result
  yield next
}

export default router.middleware()
