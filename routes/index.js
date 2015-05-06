import compose from 'koa-compose';
import users from './users';
import bills from './bills';
import meals from './meals';
import favicon from './favicon';

import Router from 'koa-router';

let router = Router();
router.get('/', get);

function * get (next) {
  this.error = {};
  this.error.message = '這不是你該來的地方!';
  yield next;
}

let root = router.middleware();

export default compose([root, users, bills, meals, favicon]);
