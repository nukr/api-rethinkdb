import compose from 'koa-compose';
import products from './products';
import users from './users';
import bills from './bills';

export default compose([products, users, bills]);
