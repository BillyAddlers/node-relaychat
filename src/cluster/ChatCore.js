const { EventEmitter } = require('events')
const chalk = require('chalk')
/**
 * @typedef ErrorType OPTIONS (...args)
 * - INVALID_OPTION (property, must)
 * - FILE_NOT_FOUND (file)
 * - MODULE_NOT_FOUND (module)
 * - SYNCJOB_ERROR (error)
 * - EMITTED (message)
 * - SCRIPT_ERROR (locate, error)
 * - FATAL_ERROR (error)
 */
/**
 * An Extended instance of native error
 * @constructor
 * @param {ErrorType}
 * @returns {Error}
 */
const { Error, TypeError, RangeError } = require('../localization')

/**
 * @module ChatCore
 * @extends {EventEmitter}
 */
class ChatCore extends EventEmitter {
  /**
   * ChatCore client
   * @constructor
   * @param {*} socket An instance of socket.io
   */
  constructor (socket) {
    super()

    var modules = module.exports.Chat = {
      chat: (info) => console.log(`${chalk.green(info)}`),
      private: (info) => console.log(`${chalk.magenta(info)}`)
    }
    /**
     * Exporting object
     */
    Object.keys(module.exports.Chat).forEach(i => { console[i] = modules[i] })

    this.socket = socket

    /**
     * Method to print message
     * @method
     */
    this.printChat = (content) => {
      console.chat(content)
    }
    this.printPrivate = (content) => {
      console.private(content)
    }
  }

  /**
   * Get current running socket
   * @method getSocket
   * @returns {socket}
   */
  getSocket () {
    return this.socket
  }
}

module.exports = ChatCore
