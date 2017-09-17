/* eslint { "global-require": 0 } */
/* @flow */
'use strict'

import config from './config'
import logger from 'winston'
import path from 'path'

import type {
  UserWithCreds,
  User
} from './types'

export default class Utils {
  static requireFolder (folderPath: string, ignoreRegex: RegExp) {
    if (ignoreRegex && !(ignoreRegex instanceof RegExp)) {
      throw new Error(`$Argument ${ignoreRegex} was not a regular expression! Must be a regular expression that matches filenames to be ignored`)
    }
    const modules = {}

    const files = require('fs').readdirSync(path.join(config.appRoot, folderPath))
    if (files.includes('index.js') && ignoreRegex && !ignoreRegex.test('index.js')) {
      // logger.warn(`${path.join(config.appRoot, folderPath)} includes an index.js file that the passed ignoreRegex ${ignoreRegex} does not match. \nThis means it will be required along with other files. That may not be what you want.`)
    }

    if (!ignoreRegex) ignoreRegex = /(index)(\.js)/

    files.forEach(function (file) {
      /* Ignore matched files */
      if (file.match(ignoreRegex)) return
      /* Store module with its name (from filename) */
      modules[path.basename(file, '.js')] = require(path.join(config.appRoot, folderPath, file))
    })
    return modules
  }

  static stripCreds (
    fullUser: UserWithCreds
  ): User {
    return {
      email: fullUser.email || '',
      firstName: fullUser.firstName || '',
      lastName: fullUser.lastName || '',
      registrationDate: fullUser.registrationDate || '',
      birthday: fullUser.birthday || '',
      gender: fullUser.gender || ''
    }
  }
}
