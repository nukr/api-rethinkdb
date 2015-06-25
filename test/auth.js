import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import co from 'co'
import app from '../app'
import config from '../config'

let apiUrl = 'http://localhost:12345'
let accessToken = null
let serviceId = null

chai.use(chaiHttp)

describe('/', () => {
  it('should ok', (done) => {
    async () => {
      let result = await chai.request(app).get('/')
      expect(result.ok).to.be.true
      done()
    }().catch(done)
  })
})

describe('auth', () => {
  it('/signup', (done) => {
    async () => {
      let result =
        await chai
          .request(apiUrl)
          .post('/signup')
          .send({username: "user", password: "password1", service: "meepshop"})
      expect(result.ok).to.be.true
      done()
    }().catch(done)
  })
  it('/signin', (done) => {
    async () => {
      let result =
        await chai
          .request(apiUrl)
          .post('/signin')
          .send({username: "user", password: "password1", service: "meepshop"})
      expect(result.ok).to.be.true
      done()
    }().catch(done)
  })
})

describe('/classes', () => {
  it('getAll', (done) => {
    async () => {
      let result = await chai.request(apiUrl).get('/classes')
      done()
    }().catch(done)
  })
})

describe('/objects', () => {
})
