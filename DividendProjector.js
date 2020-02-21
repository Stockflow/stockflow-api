import AutoCache from './AutoCache'
import { alpha } from './AlphaVantageClient'

export async function getDividendStatistics (symbol) {
  const data = await getDividendPayments(symbol)
  const yearlyAverageDividendYield = DividendProjector.getYearlyAverageDividendYield(
    data.history
  )
  const yearlyAverageDividendYieldPercentage =
      100 * (yearlyAverageDividendYield - 1.0)
  const totalDividendAmount12m = DividendProjector.getTotalDividendAmount(
    data.history,
    12
  )
  const totalDividendAmount24m = DividendProjector.getTotalDividendAmount(
    data.history,
    24
  )
  return {
    symbol: data.symbol,
    updated: data.updated,
    zone: data.zone,
    yearlyAverageDividendYield,
    yearlyAverageDividendYieldPercentage,
    totalDividendAmount12m,
    totalDividendAmount24m
  }
}

export async function getDividendPayments (symbol) {
  const res = await AutoCache.call(
    'monthly_adjusted',
    alpha.data.monthly_adjusted,
    symbol
  )
  return {
    ...res.meta,
    history: Object.entries(res.data).map(([time, { dividend }]) => ({
      time,
      dividend: parseFloat(dividend)
    }))
  }
}

export default class DividendProjector {
  static getTotalDividendAmount (data, timeframeInMonths) {
    return data
      .slice(1, timeframeInMonths + 1)
      .reduce((acc, { dividend }) => acc + dividend, 0.0)
  }

  static getYearlyAverageDividendYield (data) {
    const validPeriods = data.slice(1).slice(0, 12 * 5) // five year averages
    const indexOfFirstPaidPeriod = validPeriods.findIndex(
      p => p.dividend > 0
    )
    const indexOfLastPaidPeriod =
        validPeriods.length -
        1 -
        [...validPeriods].reverse().findIndex(p => p.dividend > 0)
    const validPeriodsAfterFirstPaid = validPeriods.slice(
      indexOfFirstPaidPeriod,
      indexOfLastPaidPeriod
    )
    const periodRate =
        validPeriodsAfterFirstPaid[0].dividend /
        validPeriodsAfterFirstPaid[validPeriodsAfterFirstPaid.length - 1]
          .dividend
    const averageDividendGrowthPerYear =
        periodRate ** (1.0 / (validPeriodsAfterFirstPaid.length / 12.0))
    return averageDividendGrowthPerYear
  }
}
