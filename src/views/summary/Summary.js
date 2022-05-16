/* eslint-disable */
import { useEffect, useState, useContext } from 'react'
import AddressContext from 'src/context';

import Select from 'react-select/creatable';

import CIcon from '@coreui/icons-react'

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CButtonGroup } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

import { 
  aggregateInOut,
  getQuarterlyData,
  getYearlyData,
  getFormattedIncomeUSDData,
  getFormattedExpenseUSDData,
  getFormattedIncomeUSDDataLivePrices,
  getFormattedExpenseUSDDataLivePrices,
  mergeDatasets,
} from './Summary.util.js'

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


const Summary = () => {

  const {address, setAddress} = useContext(AddressContext);
  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [coinsArray, setCoinsArray] = useState(['USDC']);
  const [incomeButtonSelected, setIncomeButtonSelected] = useState("Monthly");
  const [expenseButtonSelected, setExpenseButtonSelected] = useState("Monthly");
  const [treasuryData, setTreasuryData] = useState([])

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

  const handleCoinsArrayChange = async (e) => {
    console.log(e.value)
    if(e.value == 'All'){
      setCoinsArray(['USDC', 'USDT', 'ETH', 'UNI', 'DAI', 'BAT', 'MANA', 'WBTC']);
    } else {
    setCoinsArray([e.value]);
    }
  }


  useEffect(() => {
    const monthlyData = aggregateInOut(processedData, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb');
    const quarterlyData = getQuarterlyData(monthlyData);
    const yearlyData = getYearlyData(monthlyData); 

    let inData = {};

    if(incomeButtonSelected == "Monthly"){
      inData = getFormattedIncomeUSDData(coinsArray, monthlyData);
    } else if (incomeButtonSelected == "Quarterly"){
      inData = getFormattedIncomeUSDData(coinsArray, quarterlyData);
    } else if (incomeButtonSelected == "Yearly"){
      inData = getFormattedIncomeUSDData(coinsArray, yearlyData);
    }

    setIncomeData(inData);

    let expData = {};

    if(expenseButtonSelected == "Monthly"){
      expData = getFormattedExpenseUSDData(coinsArray, monthlyData);
    } else if (expenseButtonSelected == "Quarterly"){
      expData = getFormattedExpenseUSDData(coinsArray, quarterlyData);
    } else if (expenseButtonSelected == "Yearly"){
      expData = getFormattedExpenseUSDData(coinsArray, yearlyData);
    }

    setExpenseData(expData);

  }, [coinsArray])

  const handleIncomeButtonClick = (e) => {
    const text = e.target.innerText;
    const monthlyData = aggregateInOut(processedData, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb');
    const quarterlyData = getQuarterlyData(monthlyData);
    const yearlyData = getYearlyData(monthlyData); 
    
    let inData = {};

    if(text == "Monthly"){
      inData = getFormattedIncomeUSDData(coinsArray, monthlyData);
    } else if (text == "Quarterly"){
      inData = getFormattedIncomeUSDData(coinsArray, quarterlyData);
    } else if (text == "Yearly"){
      inData = getFormattedIncomeUSDData(coinsArray, yearlyData);
    }
    setIncomeButtonSelected(text);
    setIncomeData(inData);
  }

  const handleExpenseButtonClick = (e) => {
    const text = e.target.innerText;
    const monthlyData = aggregateInOut(processedData, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb');
    const quarterlyData = getQuarterlyData(monthlyData);
    const yearlyData = getYearlyData(monthlyData); 

    let expData = {};

    if(text == "Monthly"){
      expData = getFormattedExpenseUSDData(coinsArray, monthlyData);
    } else if (text == "Quarterly"){
      expData = getFormattedExpenseUSDData(coinsArray, quarterlyData);
    } else if (text == "Yearly"){
      expData = getFormattedExpenseUSDData(coinsArray, yearlyData);
    }

    setExpenseButtonSelected(text);
    setExpenseData(expData);
    console.log(text);
  }

  return (

    <CRow>

      <div style={{display: 'flex', flexDirection: 'row'}}>
        <a 
          href={'https://etherscan.io/address/' + address}
          target="_blank"
        >
          <img className="tx-coin-img" src={coinImages['ETH']} alt={'ETH'} />
        </a>
        <p style={{marginLeft: '10px', marginTop: '2px'}}>{address}</p>
      </div>

      <CCol xs={8}>
      <Select
        defaultValue={[{ value: 'USDC', label: <div><img className='tx-coin-img' src={coinImages['USDC']} alt={'USDC'} /> USDC</div> }]}
        //isMulti
        onChange={handleCoinsArrayChange}
        name="coins"
        options={[
          {value: 'All', label: <div>All</div>},
          { value: 'ETH', label: <div><img className='tx-coin-img' src={coinImages['ETH']} alt={'ETH'} /> Ethereum</div> },
          { value: 'USDC', label: <div><img className='tx-coin-img' src={coinImages['USDC']} alt={'USDC'} /> USDC</div> },
          { value: 'USDT', label: <div><img className='tx-coin-img' src={coinImages['USDT']} alt={'USDT'} /> USDT</div> },
          { value: 'DAI', label: <div><img className='tx-coin-img' src={coinImages['DAI']} alt={'DAI'} /> DAI</div> },
          { value: 'UNI', label: <div><img className='tx-coin-img' src={coinImages['UNI']} alt={'UNI'} /> UNI</div> },
          { value: 'MANA', label: <div><img className='tx-coin-img' src={coinImages['MANA']} alt={'MANA'} /> MANA</div> },
        ]}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      </CCol>

      <CCol xs={8}>

        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <CRow>
                  <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                      Cash Inflows
                    </h4>
                    {/* <div className="small text-medium-emphasis">January - July 2021</div> */}
                  </CCol>
                  <CCol sm={7} className="d-none d-md-block">
                    <CButtonGroup className="float-end me-3">
                      {['Monthly', 'Quarterly', 'Yearly'].map((value) => (
                        <CButton
                          color="outline-secondary"
                          key={value}
                          className="mx-0"
                          onClick={handleIncomeButtonClick}
                          active={value === incomeButtonSelected}
                        >
                          {value}
                        </CButton>
                      ))}
                    </CButtonGroup>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CChartBar
                  data={incomeData}
                  labels="months"
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>


        <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Cash Outflows
                  </h4>
                  {/* <div className="small text-medium-emphasis">January - July 2021</div> */}
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButtonGroup className="float-end me-3">
                    {['Monthly', 'Quarterly', 'Yearly'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        onClick={handleExpenseButtonClick}
                        active={value === expenseButtonSelected}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={expenseData}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
        </CRow>


    </CCol>


      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>Treasury (In USD Amount) </CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['USDT', 'USDC', 'ETH', 'DAI', 'UNI'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#E1EEE1'],
                    data: [3660.59, 2787334.66, 11399.32, 0.98, 1458],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}


export default Summary;