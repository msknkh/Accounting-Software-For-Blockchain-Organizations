/* eslint-disable */
import { useState, useEffect } from 'react'

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
  CFormInput,
  CContainer,
  CRow,
  CCol
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

import { MultiSelect } from "react-multi-select-component";
import CreatableSelect from 'react-select/creatable';

const tableExample1 = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'Yiorgos Avraamu',
      new: true,
      registered: 'Jan 1, 2021',
    },
    country: { name: 'USA', flag: cifUs },
    usage: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
    payment: { name: 'Mastercard', icon: cibCcMastercard },
    activity: '10 sec ago',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }],
  },
  {
    avatar: { src: avatar2, status: 'danger' },
    user: {
      name: 'Avram Tarasios',
      new: false,
      registered: 'Jan 1, 2021',
    },
    country: { name: 'Brazil', flag: cifBr },
    usage: {
      value: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'info',
    },
    payment: { name: 'Visa', icon: cibCcVisa },
    activity: '5 minutes ago',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }],
  },
  {
    avatar: { src: avatar3, status: 'warning' },
    user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
    country: { name: 'India', flag: cifIn },
    usage: {
      value: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'warning',
    },
    payment: { name: 'Stripe', icon: cibCcStripe },
    activity: '1 hour ago',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }],
  },
  {
    avatar: { src: avatar4, status: 'secondary' },
    user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
    country: { name: 'France', flag: cifFr },
    usage: {
      value: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'danger',
    },
    payment: { name: 'PayPal', icon: cibCcPaypal },
    activity: 'Last month',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }],
  },
  {
    avatar: { src: avatar5, status: 'success' },
    user: {
      name: 'Agapetus Tadeáš',
      new: true,
      registered: 'Jan 1, 2021',
    },
    country: { name: 'Spain', flag: cifEs },
    usage: {
      value: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'primary',
    },
    payment: { name: 'Google Wallet', icon: cibCcApplePay },
    activity: 'Last week',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }],
  },
  {
    avatar: { src: avatar6, status: 'danger' },
    user: {
      name: 'Friderik Dávid',
      new: true,
      registered: 'Jan 1, 2021',
    },
    country: { name: 'Poland', flag: cifPl },
    usage: {
      value: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
    payment: { name: 'Amex', icon: cibCcAmex },
    activity: 'Last week',
    tags: [{ tag: 'Grant' }, { tag: 'Income' }, {tag: 'Payment'}],
  },
]

const Mainpage = () => {

  const [tableExample, setTableExample] = useState(tableExample1);

  //The filter states
  const [walletAddresses, setWalletAddresses] = useState([])
  const [newWalletAddress, setNewWalletAddress] = useState({NewAddressChain: "Hedera"});
  const [tags, setTags] = useState([]);
  const [coins, setCoins] = useState([])
  const [senderAddresses, setSenderAddresses] = useState([]);
  const [reciepientAddresses, setReciepientAddresses] = useState([]);

  //Tag addition states
  const [tag, setTag] = useState()

  useEffect(() => {

  }, [tableExample])
  

  console.log(tags);
  console.log(coins);
  console.log(senderAddresses);
  console.log(reciepientAddresses);
  console.log(newWalletAddress);
  console.log(walletAddresses);

  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    setNewWalletAddress((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setWalletAddresses(walletAddresses => [...walletAddresses, newWalletAddress]);
  }

  //Tag Addition Logic
  const handleTagChange = (e) => {
    const value = e.target.value
    setTag(value);
  }

  const handleTagAddition = (e) => {
    e.preventDefault();
    if (tag) {
      const index = e.target.id;
      console.log(index)
      tableExample[index].tags.push({tag: tag})
      console.log(tableExample[index].tags);
    }
  }

  console.log(tag)

  return (
    <>
      <CContainer>
        <CRow>
          <CCol sm="auto">{walletAddresses[0] ? walletAddresses[0].NewAddressChain : "Chain"}</CCol>
          <CCol sm="auto">{walletAddresses[0] ? walletAddresses[0].NewAddress : "Address"}</CCol>
          <CCol sm="auto">Add Address</CCol>
          <CCol sm="auto">
            <CFormSelect
              placeholder="Select Chain"
              aria-label="Default select example"
              options={['Hedera', 'Ethereum',]}
              name="NewAddressChain"
              onChange={handleChange}
            />
          </CCol>
          <CCol sm="auto">
            <CFormInput 
              type="text" 
              placeholder="Enter address" 
              aria-label="default input example"
              name="NewAddress"
              onChange={handleChange}
            />
          </CCol>
          <CCol>
            <CButton color="info" onClick={handleAddressSubmit}>Add Address</CButton>
          </CCol>
        </CRow>
      </CContainer>

      <CContainer>
        <CRow>
          <CCol sm="auto">Filter:</CCol>
          <CCol sm="auto">
          <CreatableSelect
            isMulti
            onChange={setTags}
            options={[]}
            placeholder="Add tags" 
          />
          </CCol>
          <CCol sm="auto">
          <CreatableSelect
            isMulti
            onChange={setCoins}
            options={[]}
            placeholder="Add coins" 
          />
          </CCol>
          <CCol sm="auto">
          <CreatableSelect
            isMulti
            onChange={setSenderAddresses}
            options={[]}
            placeholder="Add sender addresses" 
          />
          </CCol>
          <CCol sm="auto">
          <CreatableSelect
            isMulti
            onChange={setReciepientAddresses}
            options={[]}
            placeholder="Add receiver addresses" 
          />
          </CCol>     
        </CRow>
      </CContainer>

      <CContainer>
        <CRow>
          <CCol sm="auto">All Transactions</CCol>
        </CRow>
      </CContainer>



      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            {/* <CTableHeaderCell className="text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell> */}
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
                {item.tags[2] && <CButton color="primary" disabled>
                  {item.tags[2].tag}
                </CButton>}
                {item.tags[3] && <CButton color="primary" disabled>
                  {item.tags[3].tag}
                </CButton>}
                <CFormInput 
                  type="text" 
                  placeholder="Enter Tag" 
                  aria-label="default input example"
                  name="NewTag"
                  onChange={handleTagChange}
                />
                <CButton id={index} color="info" onClick={handleTagAddition}>Add New Tag</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Mainpage
