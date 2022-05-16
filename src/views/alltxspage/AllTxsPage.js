/* eslint-disable */
import { useEffect, useState } from 'react'

import {
  CButton,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormInput,  
} from '@coreui/react'

import CreatableSelect from 'react-select/creatable';
import Select from 'react-select/creatable';

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'
import { filter, filterByTxType } from './AllTxsPage.utils';

import BAT from 'src/assets/images/coins/BAT.png'
import DAI from 'src/assets/images/coins/DAI.png'
import ETH from 'src/assets/images/coins/ETH.png'
import HBAR from 'src/assets/images/coins/HBAR.png'
import MANA from 'src/assets/images/coins/MANA.png'
import UNI from 'src/assets/images/coins/UNI.png'
import USDC from 'src/assets/images/coins/USDC.png'
import USDT from 'src/assets/images/coins/USDT.png'
import WBTC from 'src/assets/images/coins/WBTC.png'

const AllTxsPage = (props) => {

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

  //States for the table
  const [data, setData] = useState([])
  const [daoAddress, setDaoAddress] = useState('0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')
  
  const [fields, setFields] = useState([])
  
  //The filter states
  const [walletAddresses, setWalletAddresses] = useState([['ETH', '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb']])
  const [newWalletAddressChain, setNewWalletAddressChain] = useState('ETH');
  const [newWalletAddress, setNewWalletAddress] = useState(['ETH', ""]);
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
    console.log("debug", newWalletAddressChain)
    const value = e.target.value
    const name = e.target.name

    setNewWalletAddress([newWalletAddressChain, value])
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setWalletAddresses(walletAddresses => [...walletAddresses, newWalletAddress]);
  }

  const handleNewWalletAddressChainChange = async (e) => {
    console.log(e.value)
    setNewWalletAddressChain(e.value);
  }

  useEffect(() => {
    setData(processedData);
    setFields(['TxHash', 'Sender', 'Recipient', 'Coins', 'Coin Amount', 'USD Amount', 'Tags'])
  
    if ('state' in props){
      console.log("l1", props, 'state' in props)
      setData(filterByTxType(props.state, processedData))
    }
  }, [])

  return (
    <>
      <CContainer>
        <CRow>
          <CCol sm="auto">{walletAddresses[0] ? (
            <a 
              href={'https://etherscan.io/address/' + walletAddresses[0][1]}
              target="_blank"
            >
              <img className="tx-coin-img" src={coinImages['ETH']} alt={'ETH'} />
            </a>
          ) : (
            <a 
              href='https://etherscan.io/address/0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb' 
              target="_blank"
            >
              <img className="tx-coin-img" src={coinImages['ETH']} alt={'ETH'} />
            </a>
          )}</CCol>
          <CCol sm="auto">{walletAddresses[0] ? walletAddresses[0][1] : "0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb"}</CCol>
          <CCol sm="auto">Add Address</CCol>
          <CCol sm="auto">
            <Select
              placeholder="Select Chain"
              aria-label="Select Chain"
              options={[
                { value: 'ETH', label: <div><img className='tx-coin-img' src={coinImages['ETH']} alt={'ETH'} /> Ethereum</div> },
                { value: 'HBAR', label: <div><img className='tx-coin-img' src={coinImages['HBAR']} alt={'HBAR'} /> Hedera</div> },
              ]}
              defaultValue={{ value: 'ETH', label: <div><img className='tx-coin-img' src={coinImages['ETH']} alt={'ETH'} /> Ethereum</div> }}
              name="NewAddressChain"
              onChange={handleNewWalletAddressChainChange}
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
            <CButton color="info" onClick={handleAddressSubmit}>Add</CButton>
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

      <TxTable fields={fields} data={filter(tags, coins, senderAddresses, reciepientAddresses, data)} address={daoAddress} userAddress={currentAccount}/>
    </>
  )
}

export default AllTxsPage
