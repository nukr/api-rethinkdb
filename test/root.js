import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import app from '../'

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

