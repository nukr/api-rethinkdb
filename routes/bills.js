import r from 'rethinkdb';
import Router from 'koa-router';
import moment from 'moment';
import parse from 'co-body';
import http from 'http';

let router = Router();
router.get('/bills', get);
router.post('/bills', create);

function * get (next) {
  console.log('hihi');
  yield this.rethinkdb.ensureIndex('bills', 'createdAt');
  try {
    let cursor = yield buildQuery.call(this);
    this.body = yield cursor.toArray();
  } catch (e) {
    errorHandle.call(this, e);
  }
  yield next;
}

function * create (next) {
  let body = yield parse.json(this);
  console.log(body);
  this._results = body;
  yield next;
}

function * buildQuery () {
  let {start, end} = getEpochTime.call(this);
  var cursor = yield r
    .table('bills')
    .orderBy({index: r.desc('createdAt')})
    .between(r.epochTime(start), r.epochTime(end), {index: 'createdAt'})
    .limit(100)
    .run(this._rdbConn);
  return cursor;
}

function errorHandle (e) {
  console.log(e);
  this.error = {};
  this.error.state = 500;
  this.error.message = e.message || http.STATUS_CODES[this.status];
}

function getEpochTime () {
  let mDate = moment(this.query.date, 'YYYY-MM-DD');
  let start = mDate.valueOf() / 1000;
  let end = mDate.add(1, 'days').valueOf() / 1000;
  return {start, end};
}

export default router.middleware();

