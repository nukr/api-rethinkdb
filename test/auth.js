import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import co from 'co'
import app from '../'
import uuid from 'node-uuid'

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
      done()
    }().catch(done)
  })
})

describe('/classes', () => {
  it('getAll', (done) => {
    async () => {
      let result = await chai.request(app.listen()).get('/classes').set('X-Meepcloud-Application-Id', serviceId)
      console.log(result.error)
      done()
    }().catch(done)
  })
})

describe('/objects', () => {
  it('test', (done) => {
    async () => {
      done()
    }().catch(done)
  })
})

describe('/users', () => {
  it('delete', (done) => {
    async () => {
      let result =
        await chai
          .request(app.listen())
          .del(`/users/${userId}`)
      done()
    }().catch(done)
  })
})
