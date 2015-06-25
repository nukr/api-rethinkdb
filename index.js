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
let env = process.env.NODE_ENV || 'development'

if (env === 'development') app.use(logger())
app.use(verifyToken)
app.use(responseTime())
app.use(cors())
app.use(routes)

app.on('error', (err, ctx) => {
  console.log(err)
});

export default app
