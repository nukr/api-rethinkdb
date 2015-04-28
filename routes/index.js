import compose from 'koa-compose';
import products from './products';
import users from './users';

export default compose([products, users]);
