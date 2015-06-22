import jwt from 'jsonwebtoken'
import Redis from 'ioredis'
import Debug from 'debug'
import config from '../config'

let debug = Debug('meepcloud:verifyToken')

const redis = new Redis(config.redis.port, config.redis.host)

export default function * (next) {
  let token = this.header['x-meepcloud-access-token']
  let result = yield redis.get(token)
  yield next
}
