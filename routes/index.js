import compose from 'koa-compose';
import users from './users';
import bills from './bills';
import meals from './meals';
import root from './root';

export default compose([root, users, bills, meals]);
