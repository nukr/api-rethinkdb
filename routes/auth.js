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

router.post('/signin', signin);
router.post('/signup', signup);

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
      .pluck('services')
  if (foundUser.length > 1) {
    debug('duplicate user found, need to elimination')
  } else if (foundUser.length === 1) {
    debug('成功登入')
    let token = jwt.sign({test: 'success'}, 'shhhhh')
    redis.set(token, 1)
    redis.expire(token, 120)
    this.body = foundUser
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
    this.body = 'user exists'
  } else {
    let serviceUUID = uuid.v4()
    let serviceToken = uuid.v4()
    let insertedResult = yield r
    .db(config.rethinkdb.db)
    .table('accounts')
    .insert({
      username: username,
      password: yield hasher(password),
      services: [{
        name: service,
        dbName: serviceUUID,
        token: serviceToken
      }]
    })
    yield r.dbCreate(serviceUUID.replace(/-/g, '_'))
    this.body = 'user added'
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
