import program from 'commander'
import api from '../'

program
  .option('-h --host <host>', 'specify the host [0.0.0.0]', '0.0.0.0')
  .option('-p, --port <port>', 'specify the port [12345]', '12345')
  .parse(process.argv)

api.listen(program.port)
console.log('Listening on %s:%s', program.host, program.port)
