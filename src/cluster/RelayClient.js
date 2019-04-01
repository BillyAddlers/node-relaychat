/* eslint-disable no-sequences */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable standard/computed-property-even-spacing */
const chalk = require('chalk')
console.info = (info) => console.log(`${chalk.bgBlue('[INFO]')} ${chalk.blue(info)}`)
const config = require('../../config.json')
const packagemeta = require('../../package.json')
const ChatCore = require('./ChatCore')
const url = `http://${config.url}:${config.port}`

process.stdin.resume()

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
  `  Starting a Relay Client...           `,
  `  version ${packagemeta.version}       `,
  `  Running a subset of Relay Task...    `,
  `                                       `]
array.forEach((i) => { console.info(i) })

/**
 * Establish a connection to the relay and listen to incoming message
 * @requires socket.io-client
 */
const socket = require('socket.io-client').connect(url)
const client = new ChatCore(socket)
/**
 * Message listener goes here
 */
socket.on('messageReceived', (username, response) => {
  client.printChat(`${username} > ${response}`)
})

var state = null
var username = null

/**
 * Detect if someone joined and leave
 */
socket.on('userLeave', (response) => {
  if (response !== username) console.log(`${response} is disconnected from Relay`)
})
socket.on('userJoin', (response) => {
  if (response !== username) console.info(`${response} is connected to the Relay`)
})

/**
 * Listen to console
 */
process.stdin.on('data', (data) => {
  process.stdout.write('> ')
  client.emit(state, data.toString().trim())
})

client.on(':start', (name, prompt) => {
  state = name
  console.info(prompt)
})

client.on(':end', () => {
  console.info('\n', `You're disconnected from the Relay.`)
  socket.emit('disconnected', username)
  process.stdin.pause()
})

client.emit(':start', 'login', 'Type your username')

client.on('login', (response) => {
  username = response
  state = 'messenger'
  client.emit(':start', 'messenger', `You're connected as ${username}`)
  socket.emit('login', username)
})

client.on('messenger', (response) => {
  if (response !== 'disconnect') {
    socket.emit('messageSend', username, response)
  } else {
    client.emit(':end')
  }
})
