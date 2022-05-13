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

import processedData from 'src/processed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

const Mainpage = () => {
  //States for the table
  const [data, setData] = useState([])
  const [daoAddress, setDaoAddress] = useState('0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')
  
  const [fields, setFields] = useState([])
  
  //The filter states
  const [walletAddresses, setWalletAddresses] = useState([])
  const [newWalletAddress, setNewWalletAddress] = useState({NewAddressChain: "Hedera"});
  const [tags, setTags] = useState([]);
  const [coins, setCoins] = useState([])
  const [senderAddresses, setSenderAddresses] = useState([]);
  const [reciepientAddresses, setReciepientAddresses] = useState([]);

  
  console.log(coins);
  console.log(senderAddresses);
  console.log(reciepientAddresses);
  console.log(newWalletAddress);
  console.log(walletAddresses);
  console.log(tags);

  //State variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = useState("");

  //Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    setNewWalletAddress((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setWalletAddresses(walletAddresses => [...walletAddresses, newWalletAddress]);
  }

  useEffect(() => {
    setData(processedData);
    setFields(['TxHash', 'Sender', 'Recipient', 'Coins', 'Coin Amount', 'USD Amount', 'Tags'])
  }, [])

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
        {!currentAccount && (
        <CRow>
          <CCol sm="auto">
            <CButton color="info" onClick={connectWallet}>Connect wallet to edit tags</CButton>
          </CCol>
        </CRow>
        )}
      </CContainer>

      <TxTable fields={fields} data={data} address={daoAddress} userAddress={currentAccount}/>
    </>
  )
}

export default Mainpage
