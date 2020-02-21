import StockInfo from 'stock-info'

class StockInfoClient {
  static async getStockInformation (symbol) {
    return new Promise((resolve, reject) => {
      StockInfo.getSingleStockInfo(symbol).then(resolve).catch(reject)
    })
  }
}

module.exports = async (req, res) => {
  const { symbol } = req.body
  try {
    const data = await StockInfoClient.getStockInformation(symbol)
    res.status(200)
    res.json(data)
  } catch (ex) {
    res.status(501)
    res.json({ error: ex })
  }
}
