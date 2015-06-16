import Router from 'koa-router';

let router = Router();

router.get('/bills', get);

export default router.middleware();
