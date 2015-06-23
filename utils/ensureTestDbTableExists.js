import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

const r = rethinkdbdash({host: config.rethinkdb.host})

export default function * (next) {
  let dbList = yield r.dbList()
  let isDbExists = dbList.indexOf(config.rethinkdb.db) === -1 ? false : true
  if (!isDbExists) {
    let dbCreateResult = yield r.dbCreate(config.rethinkdb.db)
  }

  let tableList = yield r.db(config.rethinkdb.db).tableList()
  let isAccountTableExists = tableList.indexOf('accounts') === -1 ? false : true
  if (!isAccountTableExists) {
    let tableCreateResult = yield r.db(config.rethinkdb.db).tableCreate('accounts')
  }

  let isServiceTableExists = tableList.indexOf('services') === -1 ? false : true
  if (!isServiceTableExists) {
    let tableCreateResult = yield r.db(config.rethinkdb.db).tableCreate('services')
  }
  yield next
}
