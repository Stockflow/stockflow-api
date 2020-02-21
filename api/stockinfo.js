import StockInfo from 'stock-info'

class StockInfoClient {
  static async getStockInformation (symbol) {
    return new Promise((resolve, reject) => {
      StockInfo.getSingleStockInfo(symbol).then(resolve).catch(reject)
    })
  }
}

module.exports = (req, res) => {
  const { symbol } = JSON.parse(req.body)
  StockInfoClient.getStockInformation(symbol).then(data => {
    res.json(data)
  })
}
