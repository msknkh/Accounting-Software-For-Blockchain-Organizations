/* eslint-disable */
import { useContext, useEffect, useState } from 'react'
import AddressContext from 'src/context';

import {
  CButton,
  CListGroup,
  CListGroupItem,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormInput, 
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody
} from '@coreui/react'

import CreatableSelect from 'react-select/creatable';

import CIcon from '@coreui/icons-react'
import {
  cifUs,
  cilPeople,
} from '@coreui/icons'

import BAT from 'src/assets/images/coins/BAT.png'
import DAI from 'src/assets/images/coins/DAI.png'
import ETH from 'src/assets/images/coins/ETH.png'
import HBAR from 'src/assets/images/coins/HBAR.png'
import MANA from 'src/assets/images/coins/MANA.png'
import UNI from 'src/assets/images/coins/UNI.png'
import USDC from 'src/assets/images/coins/USDC.png'
import USDT from 'src/assets/images/coins/USDT.png'
import WBTC from 'src/assets/images/coins/WBTC.png'

import { dummyTreasuryData } from 'src/treasury-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.js'

const Treasury = () => {
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

  const {address, setAddress} = useContext(AddressContext);
  const [addresses, setAddresses] = useState([])
  const [data, setData] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    setAddresses([
      ...addresses,
      address
    ])
    setData(dummyTreasuryData)
  }, [])

  useEffect(() => {
    let tv = 0;
    for (let obj of data){
      tv += obj.balance * obj.currentPrice
    }
    tv = tv.toFixed(2)
    setTotalValue(tv)
  }, [data])
  
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <a 
          href={'https://etherscan.io/address/' + address}
          target="_blank"
        >
          <img className="tx-coin-img" src={coinImages['ETH']} alt={'ETH'} />
        </a>
        <p style={{marginLeft: '10px', marginTop: '2px'}}>{address}</p>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div className='total-value' style={{marginLeft: '5px'}}>All Assets</div>
        <div>Total Value: <span className='total-value'>{numberWithCommas(totalValue)}</span></div>
      </div>
      <div>
        {(data.length > 0) &&
          <CTable hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell sm="3">Asset</CTableHeaderCell>
                <CTableHeaderCell sm="3">Price($)</CTableHeaderCell>
                <CTableHeaderCell sm="3">Amount</CTableHeaderCell>
                <CTableHeaderCell sm="3">USD Amount</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((coinObj, index) => {
                return (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      <a 
                        href={(coinObj.address !== '')?('https://etherscan.io/token/' + coinObj.contractAddress):('https://etherscan.io/token/' + address)} 
                        target="_blank"
                      >
                        <img className="tx-coin-img" src={coinImages[coinObj.name]} alt={coinObj.name} /> 
                      </a>{coinObj.name}
                    </CTableDataCell>
                    <CTableDataCell>{numberWithCommas(coinObj.currentPrice.toFixed(2))}</CTableDataCell>
                    <CTableDataCell>{coinObj.balance.toFixed(4)}</CTableDataCell>
                    <CTableDataCell>{numberWithCommas((coinObj.currentPrice * coinObj.balance).toFixed(2))}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        }
      </div>
    </div>
  );
}

export default Treasury