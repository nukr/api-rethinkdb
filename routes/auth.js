import Router from 'koa-router';
import parse from 'co-body'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import rethinkdbdash from 'rethinkdbdash'
import co from 'co'
import Redis from 'ioredis'
import uuid from 'node-uuid'
import config from '../config'
import Debug from 'debug'

const debug = Debug('meepcloud:auth')
const redis = new Redis(config.redis.port, config.redis.host)
const r = rethinkdbdash({host: config.rethinkdb.host})
let router = Router();

router.post('/signin', signin)
router.post('/signup', signup)

function * signin() {
  let {username, password} = yield parse.json(this)
  let foundUser =
    yield r
      .db(config.rethinkdb.db)
      .table('accounts')
      .filter({
        username: username,
        password: yield hasher(password)
      })
  if (foundUser.length > 1) {
    debug('duplicate user found, need to elimination')
  } else if (foundUser.length === 1) {
    debug('成功登入')
    let services = yield r.db(config.rethinkdb.db).table('services').filter({serviceOwner: foundUser.id})
    this.body = {
      foundUser,
      services
    }
  } else if (foundUser.length === 0) {
    debug('使用者不存在或帳號密碼錯誤')
  } else {
    debug('出現奇怪東西了')
    debug(foundUser)
  }
}

function * signup () {
  let {username, password, service} = yield parse.json(this)
  if (yield isUsernameExists(username)) {
    this.body = {status: "user exists"}
  } else {
    let serviceId = uuid.v4()
    let userResult = yield r
      .db(config.rethinkdb.db)
      .table('accounts')
      .insert({
        username: username,
        password: yield hasher(password)
      })
    yield r.dbCreate(serviceId.replace(/-/g, '_'))
    let serviceResult =
      yield r
        .db(config.rethinkdb.db)
        .table('services')
        .insert({
          name: service,
          serviceId: serviceId,
          serviceOwner: userResult.generated_keys[0]
        })
    let data = yield r.db(config.rethinkdb.db).table('services').get(serviceResult.generated_keys[0])
    this.body = data
  }
}

const hasher = (password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, 'salt', 10000, 512, 'sha256', (err, key) => {
      if (err) reject(err)
      resolve(key.toString('hex'))
    })
  })
}

const isUsernameExists = (username) => {
  return co(function * () {
    let result = yield r.db(config.rethinkdb.db).table('accounts').filter({username: username})
    return result.length === 0 ? false : true
  })
}

export default router.middleware();
