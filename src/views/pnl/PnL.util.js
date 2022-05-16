/* eslint-disable */

export const mergeCoinsData = (data) => {
  const coins = Object.keys(data)
  
  let result = {}
  for(let coin of coins){
    if (Object.keys(result).length === 0){
        result = data[coin]
    } else {
        Object.entries(data[coin]).map(([timeStr, statObj]) => {
            result[timeStr].income.amount += statObj.income.amount
            result[timeStr].income.usdAmount += statObj.income.usdAmount
            result[timeStr].expense.amount += statObj.expense.amount
            result[timeStr].expense.usdAmount += statObj.expense.usdAmount
        })
    }
  }
  return result
}