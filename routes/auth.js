import Router from 'koa-router';
import parse from 'co-body'

let router = Router();

router.post('/login', login);

function * login () {
  let {username, password} = yield parse.json(this)
  this.body = `${username} - ${password}`
}

export default router.middleware();
