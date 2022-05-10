/* eslint-disable */
import { useState } from 'react'

import {
  CAvatar,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CFormSelect,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import BAT from 'src/assets/images/coins/BAT.png'
import DAI from 'src/assets/images/coins/DAI.png'
import ETH from 'src/assets/images/coins/ETH.png'
import HBAR from 'src/assets/images/coins/HBAR.png'
import MANA from 'src/assets/images/coins/MANA.png'
import UNI from 'src/assets/images/coins/UNI.png'
import USDC from 'src/assets/images/coins/USDC.png'
import USDT from 'src/assets/images/coins/USDT.png'
import WBTC from 'src/assets/images/coins/WBTC.png'

const TxTable = (props) => {
    const data = props.data;
    const aggregateData = {};
    const fields = props.fields;
    const [usdAmountFor, setUsdAmountFor] = useState("Now")

    const coinImages = {
        "BAT": BAT,
        "DAI": DAI,
        "ETH": ETH,
        "HBAR": HBAR,
        "MANA": MANA,
        "UNI": UNI,
        "USDC": USDC,
        "USDT": USDT,
        "WBTC": WBTC,
    }

    const usdAmountForToggle = () => {
        setUsdAmountFor((usdAmountFor==="Now") ? ("Then") : ("Now"));
    }

    const util = {
        txHashShorten: (txHash) => {
            return txHash.substring(0,7) + '...' + txHash.substring(txHash.length-5)
        },
        addressShorten: (address) => {
            return address.substring(0,6) + '...' + address.substring(address.length-4)
        },
        aggregateTxData: (txData) => {
            let result = {
                froms: 0,
                tos: 0,
                coins: [],
                coinAmount: 0,
                usdAmountThen: 0,
                tags: []
            }
            let senders = new Set()
            let receivers = new Set()
            let coins = new Set()
            let coinAddresses = {}
            let token = {
                symbol: '',
                address: '',
            }
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
                    result.usdAmountFor += txData.tokenTransfers[i]
                    for (let tag of txData.tags[i]){
                        if (!(result.tags.includes(tag))){
                            result.tags.push(tag)
                        }
                    }
                }
            }
            result.froms = senders.size
            result.tos = receivers.size

            for(let coinName of coins) {
                result.coins.push({
                    name: coinName.toUpperCase(),
                    address: coinAddresses[coinName]
                })
            }

            result.usdAmountThen = result.coinAmount

            return result
        }
    }

    return (
        <>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                    <CTableRow>
                    <CTableHeaderCell className="lorge-col">Transaction Hash</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col">From</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col">To</CTableHeaderCell>
                    <CTableHeaderCell className="lorge-col">Coins</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col">Coin Amount</CTableHeaderCell>
                    <CTableHeaderCell className="lorge-col">
                        {  
                            <div className='text-with-button'>
                                <div className='text-with-button'><p>Amount In USD</p></div>
                                <button onClick={usdAmountForToggle}>{usdAmountFor}</button>
                            </div>
                        }
                    </CTableHeaderCell>
                    <CTableHeaderCell className="tags-col">Tags</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        Object.entries(data).map(([parentTxHash, parentTxObj], pIndex) => {
                            const aggregateData = util.aggregateTxData(parentTxObj)
                            return (
                                <CTableRow v-for="item in tableItems" key={pIndex}>
                                    <CTableDataCell className="lorge-col">
                                        <a 
                                            className='etherscan-link' 
                                            href={parentTxObj.explorerURLTx + parentTxHash}
                                            target='_blank'
                                        >
                                            {util.txHashShorten(parentTxHash)}
                                        </a>
                                    </CTableDataCell>
                                    <CTableDataCell className="smol-col">
                                        <p>{aggregateData.froms} unique addr.</p>
                                    </CTableDataCell>
                                    <CTableDataCell className="smol-col">
                                        <p>{aggregateData.tos} unique addr.</p>
                                    </CTableDataCell>
                                    <CTableDataCell className="lorge-col">
                                        {aggregateData.coins.map((coinObj, index) => (
                                            <a 
                                                href={(coinObj.address !== '')?(parentTxObj.explorerURLAddress + coinObj.address):(props.address)} 
                                                target="_blank"
                                            >
                                                <img className="tx-coin-img" src={coinImages[coinObj.name]} alt={coinObj.name} />
                                            </a>
                                        ))}
                                    </CTableDataCell>
                                    <CTableDataCell className="smol-col">
                                        <p>{aggregateData.coinAmount}</p>
                                    </CTableDataCell>
                                    <CTableDataCell className="lorge-col">
                                        <p>{aggregateData.usdAmountThen}</p>
                                    </CTableDataCell>
                                    <CTableDataCell className="tags-col">
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            {aggregateData.tags.map((tag, index) => (
                                                <div className='tag-in-table'>{tag}</div>
                                            ))}
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            );}
                        )
                    }
                </CTableBody>
            </CTable>
        </>
    )
}

export default TxTable


/*


<>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                    <CTableRow>
                    <CTableHeaderCell className="text-center">Transaction Hash</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">From</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">To</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Coin(s)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Coin Amount</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">USD Amount (Then)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Tags</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                        </CTableDataCell>
                        <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                            <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                            {item.user.registered}
                        </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                        </CTableDataCell>
                        <CTableDataCell>
                        <div className="clearfix">
                            <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                            </div>
                            <div className="float-end">
                            <small className="text-medium-emphasis">{item.usage.period}</small>
                            </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                        </CTableDataCell>
                        <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div>
                        <strong>{item.activity}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                        <CButton color="primary" disabled>
                            {item.tags[0].tag}
                        </CButton>
                        {item.tags[1] && <CButton color="primary" disabled>
                            {item.tags[1].tag}
                        </CButton>}
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </>


*/