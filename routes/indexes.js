import Router from 'koa-router';
import r from '../utils/rdb'
import config from '../config'
import parse from 'co-body'
import Debug from 'debug'

let debug = Debug('meepcloud:indexes')
let router = Router();

router.get('/indexes/:tableName', getAll)
router.post('/indexes/:tableName/:indexName', create)
router.del('/indexes/:tableName/:indexName', del)

function * getAll (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.tableName).indexList()
  yield next
}

function * create (next) {
  let body = yield parse.json(this)
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.tableName).indexCreate(this.params.indexName)
  yield next
}

function * del (next) {
  let token = this.header['x-meepcloud-access-token']
  let appid = this.header['x-meepcloud-application-id'].replace(/-/g, '_')
  this.body = yield r.db(appid).table(this.params.tableName).indexDrop(this.params.indexName)
  yield next
}
export default router.middleware();
