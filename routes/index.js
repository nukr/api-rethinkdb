import compose from 'koa-compose';
import bills from './bills';
import root from './root';
import auth from './auth';
import objects from './objects';
import classes from './classes';
import indexes from './indexes'

export default compose([root, bills, auth, objects, classes, indexes]);
