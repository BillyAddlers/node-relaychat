// Core library
const crypto = require('crypto')
// Also core library, for checking value
const _ = require('lodash')

// Private methods
const _check = Symbol('check')

/**
 * @module Crypt
 * @author Hazmi35
 */
class Crypt {
  /**
   * @constructor
   * @param {*} algorithm
   * @param {*} key
   * @param {*} encoding
   * @param {*} finalEncoding
   */
  constructor (algorithm, key, encoding, finalEncoding) {
    this.crypto = crypto

    const encodings = ['base64', 'hex', 'utf8']

    if (encoding === undefined) encoding = 'base64'
    else if (!encodings.includes(encoding)) throw new Error('Bad encoding')
    if (finalEncoding === undefined) finalEncoding = 'utf8'
    else if (!encodings.includes(finalEncoding)) throw new Error('Bad finalEncoding')

    /**
     * @method encrypt
     * @return {encrypted}
     */
    this.encrypt = (text) => {
      var cipher = crypto.createCipheriv(algorithm, key)
      var encrypted = cipher.update(text, 'utf8', encoding)
      encrypted += cipher.final(encoding)
      return encrypted
    }
    /**
     * @method decrypt
     * @returns {decrypted}
     */
    this.decrypt = (text) => {
      var decipher = crypto.createDecipheriv(algorithm, key)
      var decrypted = decipher.update(text, encoding, 'utf8')
      decrypted += decipher.final(finalEncoding)
      return decrypted
    }

    this.algorithm = algorithm
  }

    /**
   * @typedef DesiredValue
   * - array
   * - string
   * - integer
   * - not a number
   * - regexp
   */
  /**
   * To check wheter a value is a proper `DesiredValue`.
   * @private
   * @method _check
   * @param {*} data
   * @param {DesiredValue} desired
   */
  [_check] (data, desired) {
    switch (desired) {
      case 'array':
        return _.isArray(data)
      case 'string':
        return _.isString(data)
      case 'integer':
        return _.isInteger(data)
      case 'not a number':
        return _.isNaN(data)
      case 'regexp':
        return _.isRegExp(data)
      default:
        break
    }
  }
}

module.exports = Crypt
