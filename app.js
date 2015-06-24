import koa from 'koa';
import Debug from 'debug'
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import config from './config';
import routes from './routes';
import cors from 'koa-cors';
import verifyToken from './utils/verifyToken'

let debug = Debug('meepcloud:app')
let app = koa();


app.use(logger())
app.use(verifyToken)
app.use(responseTime())
app.use(cors())
app.use(routes)

app.on('error', (err, ctx) => {
  debug('server error', err);
});

app.listen(config.koa.port);
console.log(`koa server start at ${config.koa.port}`);

