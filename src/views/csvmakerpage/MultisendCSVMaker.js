/* eslint-disable */
import { useEffect, useState } from 'react'

import {
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell
} from '@coreui/react'

import Select from 'react-select/creatable';

import { dummyTreasuryData } from 'src/treasury-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.js'

import BAT from 'src/assets/images/coins/BAT.png'
import DAI from 'src/assets/images/coins/DAI.png'
import ETH from 'src/assets/images/coins/ETH.png'
import HBAR from 'src/assets/images/coins/HBAR.png'
import MANA from 'src/assets/images/coins/MANA.png'
import UNI from 'src/assets/images/coins/UNI.png'
import USDC from 'src/assets/images/coins/USDC.png'
import USDT from 'src/assets/images/coins/USDT.png'
import WBTC from 'src/assets/images/coins/WBTC.png'

import crossIcon from 'src/assets/navBarIcons/untagged-tx-black.png'

const MultisendCSVMaker = (props) => {
  
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

  const [treasury, setTreasury] = useState([])
  const [coins, setCoins] = useState([])
  let coinToAddressMapping = {}
  let coinToPriceMapping = {}
  const [jsonData, setJsonData] = useState(('json' in props)?(props.json):([]))
  const [csv, setCsv] = useState([])

  const [newPaymentCoin, setNewPaymentCoin] = useState('')
  const [newPaymentAddress, setNewPaymentAddress] = useState('')
  const [newPaymentCoinAmount, setNewPaymentCoinAmount] = useState(0)
  const [newPaymentUSDAmount, setNewPaymentUSDAmount] = useState(0)
  
  const [amount, setAmount] = useState({newPaymentCoinAmount: 0, newPaymentUSDAmount: 0})

  for (let coin of dummyTreasuryData){
    coinToAddressMapping[coin.name] = coin.contractAddress
    coinToPriceMapping[coin.name] = coin.currentPrice
  }

  const jsonToCSV = () => {
    setCsv([])
    for (let payment of jsonData){
      const token = (coinToAddressMapping[payment.coin] === '') ? 'native' : 'erc20'
      const tokenAddress = coinToAddressMapping[payment.coin]
      const receiver = payment.receiver
      const amount = payment.amount

      setCsv(prevCsv => [...prevCsv, [token, tokenAddress, receiver, amount, ''].join(',')])
    }
  }

  useEffect(() => {
    setTreasury(dummyTreasuryData)

    for (let coin of dummyTreasuryData){
      setCoins(prevCoins => [...prevCoins, coin.name])
    }
  }, [])

  useEffect(() => {
    jsonToCSV()
  }, [jsonData])

  const handleNewPaymentCoin = (e) => {
    const value = e.value
    setNewPaymentCoin(value)
  }
  const handleNewPaymentAddress = (e) => {
    const value = e.target.value
    setNewPaymentAddress(value)
  }
  const handleNewPaymentCoinAmount = (e) => {
    const value = parseInt(e.target.value)
    const amount = (value * coinToPriceMapping[newPaymentCoin]).toFixed(2)
    setAmount({...amount, newPaymentCoinAmount: value, newPaymentUSDAmount: amount})
  }
  
  const handleNewPaymentUSDAmount = (e) => {
    const value = parseInt(e.target.value)
    const amount = (value / coinToPriceMapping[newPaymentCoin]).toFixed(4)
    setAmount({...amount, newPaymentCoinAmount: amount, newPaymentUSDAmount: value})
  }
  
  const handleNewRowSubmit = () => {
    setJsonData(prevData => [...prevData, {
      coin: newPaymentCoin,
      receiver: newPaymentAddress,
      amount: amount.newPaymentCoinAmount,
      usdAmount: amount.newPaymentUSDAmount,
    }])
  }

  const deleteCurrentRow = (index) => {
    const newJsonData = jsonData
    newJsonData.splice(index, 1)
    setJsonData(newJsonData)
    setJsonData([...jsonData])
  }

  const addressShorten = (address) => {
    return address.substring(0,6) + '...' + address.substring(address.length-4)
  }

  const copyToClipboard = () => {
    let str = ''
    for (let payment of jsonData){
      const token = (coinToAddressMapping[payment.coin] === '') ? 'native' : 'erc20'
      const tokenAddress = coinToAddressMapping[payment.coin]
      const receiver = payment.receiver
      const amount = payment.amount

      str += ([token, tokenAddress, receiver, amount, ''].join(',') + '\n')
    }

    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject('The Clipboard API is not available.');
  };
  
  return (
    <div style={{display: 'flex', flexFlow:'column'}}>
      <div style={{display: 'flex', flexFlow:'row'}}>
        <div style={{alignContent: 'center', width: '700px'}}>
          <CContainer>
            <CRow sm="1">
              <CCol>
                <button style={{borderColor: 'transparent'}} onClick={handleNewRowSubmit}>
                  <div>
                    <img className='tx-coin-img tilt-45' src={crossIcon} alt={'Add'} />
                    Add
                  </div>
                </button>
              </CCol>

              <CCol sm="3">
                <Select
                  placeholder="Select Coin"
                  aria-label="Default select example"
                  options={[
                    { value: 'ETH', label: <div><img className='tx-coin-img' src={coinImages['ETH']} alt={'ETH'} /> Ethereum</div> },
                    { value: 'USDC', label: <div><img className='tx-coin-img' src={coinImages['USDC']} alt={'USDC'} /> USDC</div> },
                    { value: 'USDT', label: <div><img className='tx-coin-img' src={coinImages['USDT']} alt={'USDT'} /> USDT</div> },
                    { value: 'DAI', label: <div><img className='tx-coin-img' src={coinImages['DAI']} alt={'DAI'} /> DAI</div> },
                    { value: 'UNI', label: <div><img className='tx-coin-img' src={coinImages['UNI']} alt={'UNI'} /> UNI</div> },
                    { value: 'MANA', label: <div><img className='tx-coin-img' src={coinImages['MANA']} alt={'MANA'} /> MANA</div> },
                  ]}
                  name="NewCoinTransfer"
                  required
                  onChange={handleNewPaymentCoin}
                />
              </CCol>
              <CCol sm="3">
                <CFormInput 
                  type="text" 
                  placeholder="Enter address" 
                  aria-label="default input example"
                  name="NewAddress"
                  required
                  onChange={handleNewPaymentAddress}
                />
              </CCol>

              <CCol sm="2">
                <CFormInput 
                  type="text" 
                  placeholder="Coin Amount" 
                  aria-label="Enter Coin Amount"
                  name="coinAmount"
                  onChange={handleNewPaymentCoinAmount}
                />
              </CCol>

              <CCol sm="2">
                <CFormInput 
                  type="text" 
                  placeholder="USD Amount" 
                  aria-label="Enter USD Amount"
                  name="usdAmount"
                  onChange={handleNewPaymentUSDAmount}
                />
              </CCol>
            </CRow>
          </CContainer>
        </div>
        <div>
          <button className='csv-file-button' onClick={copyToClipboard}>Copy CSV</button>
          <button className='csv-file-button'>Download CSV</button>
        </div>
      </div>
      <div style={{width:'800px', marginTop: '20px'}}>
        {(jsonData.length > 0) &&
          <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead>
              <CTableHeaderCell className="smol-col">Remove?</CTableHeaderCell>
              <CTableHeaderCell className="smol-col" scope="col">Coin</CTableHeaderCell>
              <CTableHeaderCell className="smol-col" scope="col">Recipient</CTableHeaderCell>
              <CTableHeaderCell className="smol-col" scope="col">Coin Amount</CTableHeaderCell>
              <CTableHeaderCell className="smol-col" scope="col">USD Amount</CTableHeaderCell>
          </CTableHead>
          <CTableBody>
            {jsonData.map((json, i) => {
              return (
                <CTableRow v-for="item in tableItems" key={i}>
                  <CTableDataCell className="smol-col">
                    <button style={{borderColor: 'transparent'}} onClick={() => deleteCurrentRow(i)}>
                      <div>
                        <img className='tx-coin-img' src={crossIcon} alt={'Add'} />
                      </div>
                    </button>
                  </CTableDataCell>
                  <CTableDataCell className="smol-col">
                    <a 
                        href={'https://etherscan.io/address/' + coinToAddressMapping[json.coin]}
                        target="_blank"
                    >
                        <img className="tx-coin-img" src={coinImages[json.coin]} alt={json.coin} /> {json.coin}
                    </a>
                  </CTableDataCell>
                  <CTableDataCell className="smol-col">
                    <a 
                        className='etherscan-link' 
                        href={'https://etherscan.io/address/' + json.receiver}
                        target='_blank'
                    >
                        {addressShorten(json.receiver)}
                    </a>
                  </CTableDataCell>
                  <CTableDataCell className="smol-col">{json.amount}</CTableDataCell>
                  <CTableDataCell className="smol-col">{Math.round(json.amount * coinToPriceMapping[json.coin], 2)}</CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
          </CTable>
        }
      </div>
      <div className='csv-maker'>
        {csv.map((line) => {
          return(<>{line}<br/></>)
        })}
      </div>
    </div>
  );
}

export default MultisendCSVMaker