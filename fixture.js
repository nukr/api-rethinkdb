import r from 'rethinkdb';
import config from './config';
import co from 'co';

(async function () {
  let products = [
  {
    title: 'pork',
    price: 500,
    createdAt: await r.now()
  },
  {
    title: 'beef',
    price: 900,
    createdAt: await r.now()
  },
  {
    title: 'fish',
    price: 1900,
    createdAt: await r.now()
  }
  ];
  let conn = await r.connect(config.rethinkdb);
  await r.tableCreate('products').run(conn);
  try {
    let result = await r.table('products').insert(products).run(conn);
  } catch (e) {
    console.log(e);
  }
})();

