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

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'

import { useMoralisWeb3Api } from "react-moralis";
import { AddressBookQuery } from '@hashgraph/sdk';


const Treasury = (props) => {
  const Web3Api = useMoralisWeb3Api();

  const [addresses, setAddresses] = useState([])
  const [data, setData] = useState([])

  const getTokenBalances = async (address) => {
    const options = {
      chain: 'eth',
      address: address
    }
    const balances = await Web3Api.getAllERC20(options);
    setData((prevData) => [...prevData, balances]);
  }

  useEffect(() => {
    setAddresses([
      ...addresses,
      '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb'
    ])
    for (let address of addresses){
      getTokenBalances(address);
    }
    console.log(data);
  }, [])

  return (<div></div>);
}

export default Treasury