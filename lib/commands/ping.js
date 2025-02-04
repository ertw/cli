const { redact } = require('@npmcli/redact')
const { log, output } = require('proc-log')
const pingUtil = require('../utils/ping.js')
const BaseCommand = require('../base-command.js')

class Ping extends BaseCommand {
  static description = 'Ping npm registry'
  static params = ['registry']
  static name = 'ping'

  async exec (args) {
    const cleanRegistry = redact(this.npm.config.get('registry'))
    log.notice('PING', cleanRegistry)
    const start = Date.now()
    const details = await pingUtil({ ...this.npm.flatOptions })
    const time = Date.now() - start
    log.notice('PONG', `${time}ms`)
    if (this.npm.config.get('json')) {
      output.standard(JSON.stringify({
        registry: cleanRegistry,
        time,
        details,
      }, null, 2))
    } else if (Object.keys(details).length) {
      log.notice('PONG', JSON.stringify(details, null, 2))
    }
  }
}
module.exports = Ping
