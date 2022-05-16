/* eslint-disable */
import { useEffect, useState } from 'react'

import {
  CButton,
  CListGroup,
  CListGroupItem,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormInput,  
} from '@coreui/react'

import CreatableSelect from 'react-select/creatable';

import CIcon from '@coreui/icons-react'
import {
  cifUs,
  cilPeople,
} from '@coreui/icons'

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb-2.json'
import TxTable from 'src/components/TxTable'
import { utils } from '@hashgraph/hethers';

let summaryTimeSeriesData = {}

const util = {
  aggregateTxData: (txData) => {
    let result = {
        froms: 0,
        tos: 0,
        coins: [],
        coinAmount: 0,
        usdAmountThen: 0,
        tags: [],
        timeStamp: Date.now()
    }
    let senders = new Set()
    let receivers = new Set()
    let coins = new Set()
    let coinAddresses = {}
    let token = {
        symbol: '',
        address: '',
    }
    let txTypes = new Set()
    for(let i = 0; i < txData.from.length; i++){
        if (!(txData.tags[i].includes('Ignore'))){
            senders.add(txData.from[i])
            receivers.add(txData.to[i])
            coins.add(txData.tokenSymbol[i])
            coinAddresses[txData.tokenSymbol[i]] = txData.tokenAddress[i]
            if (coins.size === 1) {
                result.coinAmount += txData.tokenTransfers[i]
            } else {
                result.coinAmount = '---------'
            }
            result.usdAmountThen += txData.usdTransfer[i]
            for (let tag of txData.tags[i]){
                if (!(result.tags.includes(tag))){
                    result.tags.push(tag)
                }
            }
        }
    }
    result.froms = senders.size
    result.tos = receivers.size
    result.timeStamp = txData.txTimestamp

    for(let coinName of coins) {
        result.coins.push({
            name: coinName.toUpperCase(),
            address: coinAddresses[coinName]
        })
    }

    // result.usdAmountThen = result.coinAmount
    if (txData.txType.toUpperCase() === 'Untagged'.toUpperCase()) result.tags.push(txData.txType)

    return result
    },

    addCoinAmountToSummary: (aggredatedData,coinName,year,month) => {
        if (!summaryTimeSeriesData[coinName][year]) {
            summaryTimeSeriesData[coinName][year] = {};
            summaryTimeSeriesData[coinName][year][month] = {};
            summaryTimeSeriesData[coinName][year][month]['incoming'] = 0;
            summaryTimeSeriesData[coinName][year][month]['outgoing'] = 0;
        } 

        if (aggredatedData.tags.includes('Expense')) {
            if (typeof  aggredatedData.coinAmount !== 'string') {
                summaryTimeSeriesData[coinName][year][month]['outgoing'] = summaryTimeSeriesData[coinName][year][month]['outgoing'] + aggredatedData.coinAmount
            }
        }

        if (aggredatedData.tags.includes('Income')) {
            if (typeof  aggredatedData.coinAmount !== 'string') {
                summaryTimeSeriesData[coinName][year][month]['incoming'] = summaryTimeSeriesData[coinName][year][month]['incoming'] + aggredatedData.coinAmount
            }
        }
    }
}

const Summary = () => {
    
    return (
        <>
            {

                Object.entries(processedData).map(([parentTxHash, parentTxObj], pIndex) => {
                    let aggredatedData = util.aggregateTxData(parentTxObj);
                    aggredatedData.timeStamp = aggredatedData.timeStamp * 1000
                    const date = new Date(aggredatedData.timeStamp);
                    const year = date.getFullYear();
                    const month = date.getMonth();

                    // const monthName = date.toLocaleString('default', {
                    // month: 'long',
                    // });

                    if (!summaryTimeSeriesData[aggredatedData.coinName]) {
                        for(let coin of aggredatedData.coins) {
                            summaryTimeSeriesData[coin.name] = {}
                            summaryTimeSeriesData[coin.name]['address'] = coin.address
                            util.addCoinAmountToSummary(aggredatedData,coin.name,year,month);
                        }                        
                    } 
                })
            }
            {
                // Use the data generated as you want 
                console.log(summaryTimeSeriesData)
            }
         </>);
}

export default Summary