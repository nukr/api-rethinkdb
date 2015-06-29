import Router from 'koa-router';
import r from '../utils/rdb'
import config from '../config'
import parse from 'co-body'
import Debug from 'debug'

let debug = Debug('meepcloud:objects')
let router = Router();

router.get('/objects/:object/:id', get)
router.get('/objects/:object', getAll)
router.post('/objects/:object', create)
router.put('/objects/:object/:id', update)
router.del('/objects/:object/:id', del)

function * get (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-service-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).table(this.params.object).get(this.params.id).run()
  yield next;
}

function * getAll (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-service-id'].replace(/-/g, '_')
  let rdb = r.db(serviceId).table(this.params.object)
  if (this.query.where) {
    let where = JSON.parse(this.query.where)
    for (let field in where) {
      for (let fn in where[field]) {
        let result = yield rdb.filter((o) => {
          return o(field)[fn](where[field][fn])
        })
        this.body = result
      }
    }
  } else {
    this.body = yield rdb
  }
  yield next;
}

function * create (next) {
  let body = yield parse.json(this)
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-service-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).table(this.params.object).insert(body).run()
  yield next
}

function * update (next) {
  let body = yield parse.json(this)
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-service-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).table(this.params.object).get(this.params.id).update(body).run()
  yield next
}

function * del (next) {
  let token = this.header['x-meepcloud-access-token']
  let serviceId = this.header['x-meepcloud-service-id'].replace(/-/g, '_')
  this.body = yield r.db(serviceId).table(this.params.object).get(this.params.id).delete().run()
  yield next
}

export default router.middleware();
