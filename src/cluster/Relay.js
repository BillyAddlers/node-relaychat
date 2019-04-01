const chalk = require('chalk')
console.info = (info) => console.log(`${chalk.bgBlue('[INFO]')} ${chalk.blue(info)}`)
const app = require('express')()
const packagemeta = require('../../package.json')
const port = require('../../config.json').port

/**
 * Prints annoying fancy logo
 */
const array =
[ `  OOOO     WW            WW     OOOO   `,
  `OO    OO   WW            WW   OO    OO `,
  `OO    OO    WW          WW    OO    OO `,
  `OO    OO     WW   WW   WW     OO    OO `,
  `OO    OO      WW W  W WW      OO    OO `,
  `  OOOO          W    W          OOOO   `,
  `                                       `,
  `  Starting a Relay Server...           `,
  `  version ${packagemeta.version}       `,
  `  Running a subset of Relay Task...    `,
  `                                       `]
array.forEach((i) => { console.info(i) })

/**
 * Listen to a port, as defined in config.json
 */
const server = app.listen(port, () => {
  console.info('Relay server is running on port ' + port)
})

/**
 * Send status to check whether socket relay is online
 */
app.get('/', (req, res) => {
  res.sendStatus(200)
})

const io = require('socket.io').listen(server)

io.on('connection', (socket) => {
  /**
   * Emit event if someone is connected to the relay.
   */
  socket.on('login', (response) => {
    console.info(response + ' is connected to the relay.')
    socket.broadcast.emit('userJoin', response)
  })

  /**
   * Emit event if someone is sending message through the relay.
   */
  socket.on('messageSend', (username, response) => {
    socket.broadcast.emit('messageReceived', username, response)
  })

  /**
   * Emit event if someone is disconnected from relay.
   */
  socket.on('disconnected', (response) => {
    console.info(response + ' is disconnected from relay.')
    socket.broadcast.emit('userLeave', response)
  })
})
