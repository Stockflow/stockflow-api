import StockInfo from 'stock-info'

class StockInfoClient {
  static async getStockInformation (symbol) {
    return new Promise((resolve, reject) => {
      StockInfo.getSingleStockInfo(symbol).then(resolve).catch(reject)
    })
  }
}

const withCors = res => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  return res
}

module.exports = async (req, res) => {
  const { symbol } = req.body
  try {
    const data = await StockInfoClient.getStockInformation(symbol)
    withCors(res).status(200).json(data)
  } catch (ex) {
    withCors(res).status(501).json({ error: ex })
  }
}
