import Router from 'koa-router';
import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

const r = rethinkdbdash({host: config.rethinkdb.host})
const router = Router()

router.get('/table', tableList)
router.post('/table', tableCreate)

function * tableList (next) {
  let appId = this.header['x-meepcloud-application-id']
  r.db().tableList()
  yield next
}

function * tableCreate (next) {
  console.log('@@@@', this.header)
  yield next
}

export default router.middleware()
