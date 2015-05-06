import koa from 'koa';
let app = koa();

import r from 'rethinkdb';

import config from './config';
import rethinkdb from './db';
import routes from './routes';
import router from 'koa-router';
import cors from 'koa-cors';
import hooks from './hooks';
import handleResults from './handle-results';

app.use(rethinkdb(config));
app.use(cors());
app.use(routes);
app.use(router().allowedMethods());
app.use(hooks);
app.use(handleResults);

app.listen(config.koa.port);
console.log(`koa server start at ${config.koa.port}`);

