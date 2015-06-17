import compose from 'koa-compose';
import users from './users';
import bills from './bills';
import meals from './meals';
import root from './root';
import auth from './auth';

export default compose([root, users, bills, meals, auth]);
