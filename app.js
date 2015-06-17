import koa from 'koa';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
let app = koa();

import config from './config';
import routes from './routes';
import cors from 'koa-cors';
import rethinkdbdash from 'rethinkdbdash'
import co from 'co'

const r = rethinkdbdash({host: '192.168.100.5'})

app.use(logger());
app.use(function * (next) {
  if (!(yield isDbExists('apiTest'))) {
    let dbCreateResult = yield r.dbCreate('apiTest')
  }

  if (!(yield isTableExists('apiTest', 'accounts'))) {
    let tableCreateResult = yield r.db('apiTest').tableCreate('accounts')
  }
  yield next
})
app.use(responseTime());
app.use(cors());
app.use(routes);

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

app.listen(config.koa.port);
console.log(`koa server start at ${config.koa.port}`);

let isDbExists = (dbName) => {
  return co(function * () {
    let dbList = yield r.dbList()
    return dbList.indexOf(dbName) === -1 ? false : true
  })
}

let isTableExists = (dbName, tableName) => {
  return co(function * () {
    let tableList = yield r.db(dbName).tableList()
    return tableList.indexOf(tableName) === -1 ? false : true
  })
}
