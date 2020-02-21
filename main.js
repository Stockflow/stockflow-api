#!/usr/bin/env node

'use strict'

// Import libraries
import StockInfo from 'stock-info'

class StockInfoClient {
  static async getStockInformation (symbol) {
    return new Promise((resolve, reject) => {
      StockInfo.getSingleStockInfo(symbol).then(resolve).catch(reject)
    })
  }
}

const ApiPaths = {
  Debug: {
    ping: 'ping'
  },
  Data: {
    Dividends: 'get_data_dividends',
    StockInfo: 'get_stock_info'
  }
}

// Define JSON-RPC Server
const server = jayson.Server({
  //
  // Debug
  //

  [ApiPaths.Debug.ping]: function ping (args, cb) {
    cb(null, 'pong')
  },

  [ApiPaths.Data.StockInfo]: function getStockInfo (args, cb) {
    const error = { code: 1, message: 'Unable to fetch stock information.' }
    StockInfoClient.getStockInformation(args.symbol).then(res => cb(null, res)).catch(() => cb(error))
  }
})
