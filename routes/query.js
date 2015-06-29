import Router from 'koa-router';
import r from '../utils/rdb'
import parse from 'co-body'
import config from '../config'
import Debug from 'debug'

let debug = Debug('meepcloud:query')
let router = Router();

router.post('/query', query)
router.get('/query', query)

function * query (next) {
  this.body = 'hihi'
  yield next
}

export default router.middleware()
