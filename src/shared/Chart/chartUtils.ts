import { CountByDate } from 'core/client/stats/statsTypes'

export const chartColors = {
  darkred: '#d00',
  darkblue: '#00a',
  darkgreen: '#080',
  orangegold: '#c80',
  darkgray: '#777',
}

export const toPercentage = (
  numerator: CountByDate[],
  denominator: CountByDate[],
): CountByDate[] => {
  return numerator.map<CountByDate>((k, i) => ({
    date: k.date,
    count:
      denominator[i] && denominator[i].count > 0
        ? Math.min(Math.round((k.count / denominator[i].count) * 100), 100)
        : 0,
  }))
}
