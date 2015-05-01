import koa from 'koa';
let app = koa();

import r from 'rethinkdb';

import config from './config';
import Database from './db';
import routes from './routes';
import router from 'koa-router';
import cors from 'koa-cors';
import qs from './qs';
import handleResults from './handle-results';

let db = new Database();

app.use(db.createConnection);
app.use(qs);
app.use(cors());
app.use(routes);
app.use(router().allowedMethods());
app.use(handleResults);
app.use(db.closeConnection);

app.listen(config.koa.port);
console.log(`koa server start at ${config.koa.port}`);

