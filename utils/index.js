function * ensureIndex (table, indexName) {
  let indexList = yield r.table('bills').indexList().run(this._rdbConn);
  if (indexList.some(item => item === indexName)) {
    console.log(`${indexName} exists`);
  } else {
    console.log(`created ${indexName}`);
    yield r.table(table).indexCreate(indexName).run(this._rdbConn);
  }
}

