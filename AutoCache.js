import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Constants
const AUTOCACHE_PATH = join(__dirname, 'alphavantage.cache')

// Cache to circumvent AlphaVantage API restrictions
export default class AutoCache {
  static tryInit () {
    if (
      Object.keys(AutoCache.cache).length === 0 &&
        existsSync(AUTOCACHE_PATH)
    ) {
      AutoCache.cache = JSON.parse(readFileSync(AUTOCACHE_PATH))
    }
  }

  static verifyArgs (args1, args2) {
    let valid = args1.length === args2.length
    if (!valid) console.log('[Cache] Parameter count mismatch')
    for (const i of args1.keys()) {
      if (!valid) break
      valid &= args1[i] === args2[i]
    }
    if (!valid) console.log('[Cache] Detected invalid args')
    return valid
  }

  static retrieve (key, args) {
    console.log(`[Cache::FetchDry] ${key}`)
    AutoCache.tryInit()
    return key in AutoCache.cache &&
        AutoCache.verifyArgs(args, AutoCache.cache[key].args)
      ? AutoCache.cache[key].data
      : null
  }

  static store (key, args, data) {
    console.log(`[Cache::Store] ${key}`)
    AutoCache.cache[key] = { args, data }
    writeFileSync(AUTOCACHE_PATH, JSON.stringify(AutoCache.cache))
    return data
  }

  static async _call (key, fn, ...args) {
    console.log(`[Cache::FetchWet] ${key}`)
    return fn(...args)
  }

  static async call (key, fn, ...args) {
    const newKey = `${key}<${JSON.stringify(args)}>`
    return (
      AutoCache.retrieve(newKey, args) ||
        AutoCache.store(newKey, args, await AutoCache._call(newKey, fn, ...args))
    )
  }
}

AutoCache.cache = {}
