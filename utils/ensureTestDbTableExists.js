import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

const r = rethinkdbdash({host: config.rethinkdb.host})

export default function * (next) {
  let dbList = yield r.dbList()
  let isDbExists = dbList.indexOf('apiTest') === -1 ? false : true
  if (!isDbExists) {
    let dbCreateResult = yield r.dbCreate('apiTest')
  }

  let tableList = yield r.db('apiTest').tableList()
  let isTableExists = tableList.indexOf('accounts') === -1 ? false : true
  if (!isTableExists) {
    let tableCreateResult = yield r.db('apiTest').tableCreate('accounts')
  }
  yield next
}
