import r from 'rethinkdb';
import Router from 'koa-router';

let router = Router();
router.get('/favicon.ico', get);

function * get () {
  this.error = {};
  this.error.state = 200;
  this.error.message = 'no favicon';
}

export default router.middleware();


