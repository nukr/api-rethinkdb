import querystring from 'querystring';
export default function * (next) {
  let index = this.request.url.indexOf('?') + 1;
  this.qs = querystring.parse(this.request.url.substr(index));
  yield next;
}
