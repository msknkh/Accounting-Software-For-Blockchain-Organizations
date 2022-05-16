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

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

import ETH from 'src/assets/images/coins/ETH.png'


const ContributorGasPage = () => {

  const [signeeGasObj, setSigneeGasObj] = useState({});

  useEffect(() => {

    let signeeGas = {}

    for(let [txHash, txObj] of Object.entries(processedData)){
        if(txObj.txType === 'Expense'){
            if(txObj.lastSignee in signeeGas) {
                signeeGas[txObj.lastSignee].eth += txObj.txCost
                signeeGas[txObj.lastSignee].usd += txObj.txCostInUSD
                signeeGas[txObj.lastSignee].signed += 1
            } else {
                signeeGas[txObj.lastSignee] = {
                    eth: txObj.txCost,
                    usd: txObj.txCostInUSD,
                    signed: 1,
                }
            }
        }
    }

    setSigneeGasObj(signeeGas);

  }, [])

  //console.log(signeeGas);

    return (<div>
      <div style={{marginBottom:'20px'}}>
        <CContainer>
          <CRow>
            <CCol sm="auto">
              <a 
                href={'https://etherscan.io/address/0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb'}
                target="_blank"
              >
                <img className="tx-coin-img" src={ETH} alt={'ETH'} />
              </a>
            </CCol>
            <CCol sm="auto">0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb</CCol>
          </CRow>
        </CContainer>
      </div>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Address</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Gas Fees in Eth</CTableHeaderCell>
            <CTableHeaderCell scope="col">Gas Fees in USD</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Transactions Signed</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {Object.entries(signeeGasObj).map(([label, dataObj], index) => {
            return (<CTableRow>
            <CTableHeaderCell scope="row">{index}</CTableHeaderCell>
            <CTableDataCell><a target="_blank" href={'https://etherscan.io/address/'+label}>{label}</a></CTableDataCell>
            <CTableDataCell>{dataObj.eth.toFixed(4)}</CTableDataCell>
            <CTableDataCell>{dataObj.usd.toFixed(2)}</CTableDataCell>
            <CTableDataCell>{dataObj.signed}</CTableDataCell>
          </CTableRow>)
          })}
        </CTableBody>
      </CTable>
      <div style={{marginTop: '20px'}}>
        <button className='csv-file-button'>Download CSV</button>
      </div>
    </div>);
}

export default ContributorGasPage
