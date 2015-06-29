import Router from 'koa-router';
import r from '../utils/rdb'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'

let debug = Debug('meepcloud:query')
let router = Router();

router.post('/query', query)

function * (next) {
  r.db(this.meepcloudDbName)
  yield next
}

export default router
