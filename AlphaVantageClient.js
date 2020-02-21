import AlphaVantage from 'alphavantage'
import AutoCache from './AutoCache'

// Initialize AlphaVantage API Client
export const alpha = AlphaVantage({ key: process.env.ALPHAVANTAGE })
