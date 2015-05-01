import compose from 'koa-compose';
import users from './users';
import bills from './bills';

export default compose([users, bills]);
