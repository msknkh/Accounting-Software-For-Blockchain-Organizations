/* eslint-disable */
import { useEffect, useState } from 'react'

import CreatableSelect from 'react-select/creatable';

import CIcon from '@coreui/icons-react'

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CButtonGroup } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

import {
  cilCloudDownload,
  cilUserFemale,
} from '@coreui/icons'

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

const Summary = () => {
  const random = () => Math.round(Math.random() * 100)

  console.log(aggregateInOut(processedData, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb'))
  console.log(getFormattedIncomeUSDData(['ETH'], aggregateInOut(processedData, '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')).datasets[0].data)

  return (

    <CRow>
      <CCol xs={12}>
        <DocsCallout
          name="Chart"
          href="components/chart"
          content="React wrapper component for Chart.js 3.0, the most popular charting library."
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
                      Traffic
                    </h4>
                    <div className="small text-medium-emphasis">January - July 2021</div>
                  </CCol>
                  <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end">
                      <CIcon icon={cilCloudDownload} />
                    </CButton>
                    <CButtonGroup className="float-end me-3">
                      {['Day', 'Month', 'Year'].map((value) => (
                        <CButton
                          color="outline-secondary"
                          key={value}
                          className="mx-0"
                          active={value === 'Month'}
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
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: '1 m',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                      },
                      {
                        label: '',
                        backgroundColor: '#f879a9',
                        data: [1, 2, 13, 49, 1, 20, 39, 80, 40],
                      },
                      {
                        label: 'GitHub Commits',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                      },
                    ],
                  }}
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
                    Traffic
                  </h4>
                  <div className="small text-medium-emphasis">January - July 2021</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                  <CButtonGroup className="float-end me-3">
                    {['Day', 'Month', 'Year'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === 'Month'}
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
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: '1 m',
                      backgroundColor: '#f87979',
                      data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                    },
                    {
                      label: '',
                      backgroundColor: '#f879a9',
                      data: [1, 2, 13, 49, 1, 20, 39, 80, 40],
                    },
                    {
                      label: 'GitHub Commits',
                      backgroundColor: '#f87979',
                      data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
        </CRow>


    </CCol>


      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10],
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