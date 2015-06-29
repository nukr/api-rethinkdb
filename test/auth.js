import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import co from 'co'
import app from '../'
import uuid from 'node-uuid'
import r from 'rethinkdb'

let accessToken = null
let serviceId = null
let username = uuid.v4()
let userId = null

chai.use(chaiHttp)

describe('/', () => {
  it('should ok', (done) => {
    async () => {
      let result = await chai.request(app.listen()).get('/')
      expect(result.ok).to.be.true
      expect(result.text).to.be.equal('OK')
      done()
    }().catch(done)
  })
});

describe('auth', () => {
  it('/signup', (done) => {
    async () => {
      let result =
        await chai
          .request(app.listen())
          .post('/signup')
          .send({username: username, password: "password1", service: "meepshop"})
      userId = result.body.userId
      serviceId = result.body.serviceId
      expect(result.ok).to.be.true
      expect(result.body.userId).to.be.match(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)
      done()
    }().catch(done)
  })
  it('/signin', (done) => {
    async () => {
      let result =
        await chai
          .request(app.listen())
          .post('/signin')
          .send({username: username, password: "password1", service: "meepshop"})
      expect(result.ok).to.be.true
      expect(result.body).to.contain.all.keys('user', 'services')
      done()
    }().catch(done)
  })
})

describe('/classes', () => {
  it('create', (done) => {
    async () => {
      let result = await chai
      .request(app.listen())
      .post('/classes')
      .set('X-Meepcloud-Service-Id', serviceId)
      .send({name: 'test'})
      done()
    }().catch(done)
  })

  it('getAll', (done) => {
    async () => {
      let result = await chai.request(app.listen()).get('/classes').set('X-Meepcloud-Service-Id', serviceId)
      expect(result.body).to.be.eql(['test'])
      done()
    }().catch(done)
  })
})


describe('/objects', () => {
  it('create', (done) => {
    async () => {
      let result = await chai
      .request(app.listen())
      .post('/objects/test')
      .send({name: 'gg'})
      .set('X-Meepcloud-Service-Id', serviceId)
      done()
    }().catch(done)
  })
  it('getAll', (done) => {
    async () => {
      let result = await chai.request(app.listen()).get('/objects/test').set('X-Meepcloud-Service-Id', serviceId)
      done()
    }().catch(done)
  })
})

describe('/query', () => {
  it('post', (done) => {
    async () => {
      let reql = r.table('test').build()
      let result = await chai
      .request(app.listen())
      .post('/objects/query')
      .get('X-Meepcloud-Service-Id', serviceId)
      .send({reql: reql})
      done()
    }().catch(done)
  })
})

describe('cleanup', () => {
  it('delete class', (done) => {
    async () => {
      let result = await chai.request(app.listen()).del('/classes/test').set('X-Meepcloud-Service-Id', serviceId)
      done()
    }().catch(done)
  })
  it('delete object', (done) => {
    async () => {
      done()
    }().catch(done)
  })
  it('delete user', (done) => {
    async () => {
      let result = await chai.request(app.listen()).del(`/users/${userId}`)
      done()
    }().catch(done)
  })
})
