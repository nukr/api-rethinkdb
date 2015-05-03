import compose from 'koa-compose';
import users from './users';
import bills from './bills';
import meals from './meals';

export default compose([users, bills, meals]);
