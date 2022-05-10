/* eslint-disable */
import { useEffect, useState } from 'react'

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
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilPeople,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import Multiselect from 'multiselect-react-dropdown'

import processedData from 'src/processed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

const Mainpage = () => {
  const [data, setData] = useState([])
  const [address, setAddress] = useState('0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')
  
  const [fields, setFields] = useState([])
  
  const [food, setFood] = useState(['Grant', 'Payout', 'Expense'])

  useEffect(() => {
    setData(processedData);
    setFields(['TxHash', 'Sender', 'Recipient', 'Coins', 'Coin Amount', 'USD Amount', 'Tags'])
  }, [])

  return (
    <>
      <CFormSelect
      aria-label="Default select example"
      options={[
        'Open this select menu',
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3', disabled: true }
      ]}
      />
      <Multiselect
        isObject={false}
        onRemove={(event) => {
          console.log(event);
        }}
        onSelect={(event) => {
          console.log(event);
        }}
        options={food}
        selectedValues={["Grant"]}
        showCheckbox
      />

      <TxTable fields={fields} data={data} address={address} />
    </>
  )
}

export default Mainpage
