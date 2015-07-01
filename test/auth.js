import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import app from '../'
import uuid from 'node-uuid'
import r from 'rethinkdb'

let accessToken = null
let serviceId = null
let username = uuid.v4()
let userId = null
let objectId = null

chai.use(chaiHttp)

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
        .send({qq: 88})
        .set('X-Meepcloud-Service-Id', serviceId)
      objectId = result.body.generated_keys[0]
      expect(result.body.inserted).to.be.equal(1)
      done()
    }().catch(done)
  })
  it('getAll', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
})

describe('where', () => {
  it('lt', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"lt": 100}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
  it('gt', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"gt": 22}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
  it('eq', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"eq": 88}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
  it('ge', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"ge": 88}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
  it('le', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"le": 88}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
  it('ne', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .get('/objects/test')
        .set('X-Meepcloud-Service-Id', serviceId)
        .query({where: '{"qq": {"ne": 22}}'})
      expect(result.body[0].qq).to.be.equal(88)
      done()
    }().catch(done)
  })
})

describe('query', () => {
  it('reql', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .post('/query')
        .set('X-Meepcloud-Service-Id', serviceId)
        .send(r.db('taipei_steak').table('test').build())
      done()
      expect(result.body).to.be.an('array')
    }().catch(done)
  })

  it('unknown term', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .post('/query')
        .set('X-Meepcloud-Service-Id', serviceId)
        .send(r.dbCreate('test').build())
      done()
    }().catch(done)
  })
})

describe('cleanup', () => {
  it('delete object', (done) => {
    async () => {
      let result = await chai
        .request(app.listen())
        .del(`/objects/test/${objectId}`)
        .set('X-Meepcloud-Service-Id', serviceId)
      expect(result.body.deleted).to.be.equal(1)
      done()
    }().catch(done)
  })
  it('delete class', (done) => {
    async () => {
      let result = await chai.request(app.listen()).del('/classes/test').set('X-Meepcloud-Service-Id', serviceId)
      expect(result.body.tables_dropped).to.be.equal(1)
      done()
    }().catch(done)
  })
  it('delete user', (done) => {
    async () => {
      let result = await chai.request(app.listen()).del(`/users/${userId}`)
      expect(result.body.deleted).to.be.equal(1)
      done()
    }().catch(done)
  })
})
