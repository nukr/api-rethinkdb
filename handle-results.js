export default function * (next) {
  //if (this.error) {
    //this.body = this.error;
  //} else {
    //this.body = {
      //code: 200,
      //status: 'success',
      //rows: this._results.length,
      //body: this._results
    //};
  //}
  yield next;
}
