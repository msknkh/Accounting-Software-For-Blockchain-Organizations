/* eslint-disable */

const pad = (d) => {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const preRun = (data) => {
    let earliestDate = new Date();
    let coins = new Set();

    Object.entries(data).map(([txHash, txObj], pi) => {
        const txDate = new Date(txObj.txTimestamp * 1000)
        if (txDate.getTime() < earliestDate.getTime()) {earliestDate = txDate}
        for (let i in txObj.tags){
            if(!(txObj.tags[i].includes('Ignore'))){
                if(txObj.tokenSymbol[i].search('NFT') === -1){
                    coins.add(txObj.tokenSymbol[i].toUpperCase())
                }
            }
        }
    })
    coins = Array.from(coins)

    let summaryData = {}

    let earliestMonth = earliestDate.getMonth() + 1
    let earliestYear = earliestDate.getFullYear()

    let currentMonth = new Date().getMonth() + 1
    let currentYear = new Date().getFullYear()

    for(let c of coins){
        summaryData[c] = {}
        let tempMonth = earliestMonth
        let tempYear = earliestYear
        while(tempMonth < currentMonth || tempYear < currentYear){
            let date = tempYear + '-' + pad(tempMonth)
            summaryData[c][date] = {
                income: {amount: 0, usdAmount: 0}, 
                expense: {amount: 0, usdAmount: 0},
            }

            tempMonth+=1
            if (tempMonth > 12){
                tempMonth = 1
                tempYear+=1
            }
        }
    }
    
    return summaryData
}

export const aggregateInOut = (data, address) => {
    const result = preRun(data)

    Object.entries(data).map(([txHash, txObj], pi) => {
        let d = new Date(txObj.txTimestamp * 1000)
        let month = d.getMonth()+1
        let year = d.getFullYear()
        let date = year + '-' + pad(month)
        
        for (let i in txObj.tags){
            if(!(txObj.tags[i].includes('Ignore'))){
                if(txObj.tokenSymbol[i].search('NFT') === -1){
                    const coin = txObj.tokenSymbol[i].toUpperCase()
                    if(txObj.from[i].toUpperCase() === address.toUpperCase()) {
                        result[coin][date].expense.amount += txObj.tokenTransfers[i]
                        result[coin][date].expense.usdAmount += txObj.usdTransfer[i]
                    } else {
                        result[coin][date].income.amount += txObj.tokenTransfers[i]
                        result[coin][date].income.usdAmount += txObj.usdTransfer[i]
                    }
                }
            }
        }
    })

    return result
}

export const getQuarterlyData = (monthlyData) => {
    const monthToQuarterMap = {
        '01': 'Q1',
        '02': 'Q1',
        '03': 'Q1',
        '04': 'Q2',
        '05': 'Q2',
        '06': 'Q2',
        '07': 'Q3',
        '08': 'Q3',
        '09': 'Q3',
        '10': 'Q4',
        '11': 'Q4',
        '12': 'Q4',
    }

    let result = {}

    Object.entries(monthlyData).map(([coin, coinObj]) => {
        result[coin] = {}
        Object.entries(coinObj).map(([date, statObj]) => {
            const quarter = date.split('-')[0] + '-' + monthToQuarterMap[date.split('-')[1]]
            if (!(quarter in result[coin])) {
                result[coin][quarter] = {
                    income: {amount: 0, usdAmount: 0}, 
                    expense: {amount: 0, usdAmount: 0},
                }
            }
            result[coin][quarter].income.amount += statObj.income.amount
            result[coin][quarter].income.usdAmount += statObj.income.usdAmount
            result[coin][quarter].expense.amount += statObj.expense.amount
            result[coin][quarter].expense.usdAmount += statObj.expense.usdAmount
        })
    })

    return result
}

export const getYearlyData = (monthlyData) => {
    let result = {}

    Object.entries(monthlyData).map(([coin, coinObj]) => {
        result[coin] = {}
        Object.entries(coinObj).map(([date, statObj]) => {
            const year = date.split('-')[0]
            if (!(year in result[coin])) {
                result[coin][year] = {
                    income: {amount: 0, usdAmount: 0}, 
                    expense: {amount: 0, usdAmount: 0},
                }
            }
            result[coin][year].income.amount += statObj.income.amount
            result[coin][year].income.usdAmount += statObj.income.usdAmount
            result[coin][year].expense.amount += statObj.expense.amount
            result[coin][year].expense.usdAmount += statObj.expense.usdAmount
        })
    })

    return result
}

const getColor = (name) => {
    let colors = ['#28456c', '#89632a', '#69314c', '#373737', '#603b2c', '#854c1d', '#492f64', '#2b593f', '#6e3630', '#5a5a5a'];
    let x = 0;
    for (let c of name) 
        x += (c.charCodeAt(0));

    return colors[x%colors.length];
}

export const getFormattedIncomeUSDData = (coins, data) => {
    let result = {
        labels: [],
        datasets: [],
    }

    console.log(data);
    for (let coin of coins){
        coin = coin.toUpperCase()
        console.log(coin);
        if (result.labels.length === 0) result.labels = Object.keys(data[coin])

        let datasetObject = {
            label: coin,
            backgroundColor: getColor(coin),
            data: [],
        }

        for (let date of Object.keys(data[coin]).sort()){
            datasetObject.data.push(data[coin][date].income.usdAmount.toFixed(2))
        }
        result.datasets.push(datasetObject)
    }
    return result
}

export const getFormattedExpenseUSDData = (coins, data) => {
    let result = {
        labels: [],
        datasets: [],
    }
    for (let coin of coins){
        coin = coin.toUpperCase()
        if (result.labels.length === 0) result.labels = Object.keys(data[coin])

        let datasetObject = {
            label: coin,
            backgroundColor: getColor(coin),
            data: [],
        }

        for (let date of Object.keys(data[coin]).sort()){
            datasetObject.data.push(data[coin][date].expense.usdAmount.toFixed(2))
        }
        result.datasets.push(datasetObject)
    }
    return result
}

export const getFormattedIncomeUSDDataLivePrices = (coins, data, livePrices) => {
    let result = {
        labels: [],
        datasets: [],
    }
    for (let coin of coins){
        coin = coin.toUpperCase()
        if (result.labels.length === 0) result.labels = Object.keys(data[coin])

        let datasetObject = {
            label: coin,
            backgroundColor: getColor(coin),
            data: [],
        }

        for (let date of Object.keys(data[coin]).sort()){
            datasetObject.data.push((data[coin][date].income.amount * livePrices[coin]).toFixed(2))
        }
        result.datasets.push(datasetObject)
    }
    return result
}

export const getFormattedExpenseUSDDataLivePrices = (coins, data, livePrices) => {
    let result = {
        labels: [],
        datasets: [],
    }
    for (let coin of coins){
        coin = coin.toUpperCase()
        if (result.labels.length === 0) result.labels = Object.keys(data[coin])

        let datasetObject = {
            label: coin,
            backgroundColor: getColor(coin),
            data: [],
        }

        for (let date of Object.keys(data[coin]).sort()){
            datasetObject.data.push((data[coin][date].expense.amount * livePrices[coin]).toFixed(2))
        }
        result.datasets.push(datasetObject)
    }
    return result
}

export const mergeDatasets = (data) => {
    let datasets = data.datasets

    let aggregatedDataset = {}
    for(let dataset of datasets) {
        if(Object.keys(aggregatedDataset).length === 0){
            aggregatedDataset = dataset
        } else {
            aggregatedDataset.label += ('+' + dataset.label)
            aggregatedDataset.backgroundColor = getColor(aggregatedDataset.label)
            for(let i in aggregatedDataset.data){
                aggregatedDataset.data[i] += dataset.data[i]
            }
        }
    }
}

// const data = require('src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json');
// const monthlyData = aggregateInOut(data, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')
// console.log(getFormattedIncomeUSDData(['ETH'], monthlyData).datasets[0].data)
