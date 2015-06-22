import compose from 'koa-compose';
import users from './users';
import bills from './bills';
import root from './root';
import auth from './auth';
import objects from './objects';
import classes from './classes';

export default compose([root, users, bills, auth, objects, classes]);
