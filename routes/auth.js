import Router from 'koa-router';
import parse from 'co-body'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import rethinkdbdash from 'rethinkdbdash'
import co from 'co'
import Redis from 'ioredis'

const redis = new Redis(6379, '192.168.100.5')

const r = rethinkdbdash({
  host: '192.168.100.5'
})

let router = Router();

router.post('/signin', signin);
router.post('/signup', signup);

function * signin() {
  let {username, password} = yield parse.json(this)
  let foundUser = yield r.db('apiTest').table('accounts').filter({username: username, password: yield hasher(password)})
  if (foundUser.length > 1) {
    console.log('duplicate user found, need to elimination')
  } else if (foundUser.length === 1) {
    console.log('成功登入')
    let token = jwt.sign({test: 'success'}, 'shhhhh')
    redis.set(token, 1)
    redis.expire(token, 120)
    this.body = token
  } else if (foundUser.length === 0) {
    console.log('使用者不存在或帳號密碼錯誤')
  } else {
    console.log('出現奇怪東西了')
    console.log(foundUser)
  }
}

function * signup () {
  let {username, password} = yield parse.json(this)
  if (yield isUsernameExists(username)) {
    this.body = 'user exists'
  } else {
    yield r.db('apiTest').table('accounts').insert({username: username, password: yield hasher(password)})
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
    let result = yield r.db('apiTest').table('accounts').filter({username: username})
    return result.length === 0 ? false : true
  })
}

export default router.middleware();
