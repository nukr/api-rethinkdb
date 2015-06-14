import rethinkdbdash from 'rethinkdbdash';
import Router from 'koa-router';
import moment from 'moment';
import parse from 'co-body';
import http from 'http';
import co from 'co'
import config from '../config'

let r = rethinkdbdash(config.rethinkdb)

let router = Router();
router.get('/bills', get);
router.post('/bills', create);
router.del('/bills/:id', del)
router.put('/bills', update)
router.get('/statistics', statistics)

function * get (next) {
  let {start, end} = this.query
  start = start || moment().utc().hours(0).minute(0).second(0).millisecond(0).toISOString()
  end = end || moment(start).add(1, 'd').toISOString()
  this.body = yield r.db('taipei_steak').table('bills')
  .between(r.ISO8601(start), r.ISO8601(end), {index: 'createdAt'})
  .orderBy({index: 'createdAt'})
  .run()
  yield next;
}

function * statistics(next) {
  let {start, end} = this.query
  if (!start) this.throw(403, 'start date is required')
  end = end || moment(start).add(1, 'd').toISOString()
  this.body = yield steakStatisticsByName(start, end)
  yield next;
}

function * create (next) {
  let body = parse.json(this)
  this.body = body
}


/**
 * 客數統計表
 * @param {string} start - ISO8801
 * @param {string} end - ISO8601
 *
 */
function steakStatisticsByName (start, end) {
  return r.db('taipei_steak').table('bills')
  .between(r.ISO8601(start), r.ISO8601(end), {index: 'createdAt'})
  .concatMap((bill) => {
    return bill('dishes')
  })
  .group('name')
  .ungroup()
  .map(groupedByName => {
    return groupedByName('reduction').reduce((left, right) => {
      return {
        name: left('name'),
        price: left('price').add(right('price')),
        quantity: left('quantity').add(right('quantity'))
      }
    })
  }).run()
}

export default router.middleware();

