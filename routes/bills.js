import rethinkdbdash from 'rethinkdbdash';
import Router from 'koa-router';
import moment from 'moment';
import parse from 'co-body';
import http from 'http';

let r = rethinkdbdash({host: '192.168.100.5'})

let router = Router();
router.get('/bills', get);
router.post('/bills', create);

function * get (next) {
  this.body = yield steakStatisticsByName(this.query.start, this.query.end)
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
  return r.table('bills')
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

