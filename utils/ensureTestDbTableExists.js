import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

const r = rethinkdbdash({host: config.rethinkdb.host})

async () => {
  let dbList = await r.dbList()
  let isDbExists = dbList.indexOf(config.rethinkdb.db) === -1 ? false : true
  if (isDbExists) await r.dbDrop(config.rethinkdb.db)
  await r.dbCreate(config.rethinkdb.db)

  let tableList = await r.db(config.rethinkdb.db).tableList()
  let isAccountTableExists = tableList.indexOf('accounts') === -1 ? false : true
  if (isAccountTableExists) await r.db(config.rethinkdb.db).tableDrop('accounts')
  await r.db(config.rethinkdb.db).tableCreate('accounts')

  let isServiceTableExists = tableList.indexOf('services') === -1 ? false : true
  if (isServiceTableExists) await r.db(config.rethinkdb.db).tableCreate('services')
  await r.db(config.rethinkdb.db).tableCreate('services')
  r.getPoolMaster().drain()
}()

