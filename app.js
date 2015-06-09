import koa from 'koa';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
let app = koa();

import config from './config';
import routes from './routes';
import cors from 'koa-cors';
import hooks from './hooks';
import handleResults from './handle-results';

app.use(logger());
app.use(responseTime());
app.use(cors());
app.use(routes);
app.use(hooks);
app.use(handleResults);

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

app.listen(config.koa.port);
console.log(`koa server start at ${config.koa.port}`);
