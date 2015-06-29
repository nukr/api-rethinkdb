import rdb from './rdb'

export default class Ensure {
  static db(name) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
    })
  }
}
