/* eslint-disable */
import { useState, useEffect, useDebugValue } from 'react'

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
  CFormInput
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import CreatableSelect from 'react-select/creatable';

import addEditorAddress from './hedera/EditorAddressAdd.js';
import checkEditorAddress from './hedera/EditorAddressCheck.js';

import BAT from 'src/assets/images/coins/BAT.png'
import DAI from 'src/assets/images/coins/DAI.png'
import ETH from 'src/assets/images/coins/ETH.png'
import HBAR from 'src/assets/images/coins/HBAR.png'
import MANA from 'src/assets/images/coins/MANA.png'
import UNI from 'src/assets/images/coins/UNI.png'
import USDC from 'src/assets/images/coins/USDC.png'
import USDT from 'src/assets/images/coins/USDT.png'
import WBTC from 'src/assets/images/coins/WBTC.png'

const TxTable = (props) => {
    const propsData = props.data;
    const aggregateData = {};
    const fields = props.fields;
    const userAddress = props.userAddress;
    const [usdAmountFor, setUsdAmountFor] = useState("Now")
    const [data, setData] = useState(propsData);
    
    useEffect(() => {
      setData(propsData);
    });
    
    //Tag suggestion
    const tagsMapping = {};

    
    //Logic for tag addition on edit 

    const [tag, setTag] = useState("Expense");

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setTag(value);
    }

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

    const usdAmountForToggle = () => {
        setUsdAmountFor((usdAmountFor==="Now") ? ("Then") : ("Now"));
    }

    const handleTagAddition = (parentTxHash, cIndex) => {
        const obj = data;
        obj[parentTxHash].tags[cIndex].push(tag);
        setData(obj);
        setData({ ...data });

    }

    const handleAddTag = async (fromAddress, toAddress, tags) => {

        if(userAddress !== ""){
            const isEditor = await checkEditorAddress('polywrap', userAddress);
            
            if(isEditor) {
                const suggestedTags = tagsMapping[fromAddress + '_' + toAddress];
                for (let tag of tags){
                    suggestedTags.delete(tag);
                }
                console.log(suggestedTags);
                alert(`You have tag suggestions:  ${Array.from(suggestedTags).toString()}`);
                
            }
            else {alert("Edit is not allowed for this user address.");}

        } else {
            alert("Please connect with your metamask account");
        }

    }

    const util = {
        txHashShorten: (txHash) => {
            return txHash.substring(0,7) + '...' + txHash.substring(txHash.length-5)
        },
        addressShorten: (address) => {
            return address.substring(0,6) + '...' + address.substring(address.length-4)
        },
        aggregateTxData: (txData) => {
            let result = {
                froms: 0,
                tos: 0,
                coins: [],
                coinAmount: 0,
                usdAmountThen: 0,
                tags: []
            }
            let senders = new Set()
            let receivers = new Set()
            let coins = new Set()
            let coinAddresses = {}
            let token = {
                symbol: '',
                address: '',
            }
            let txTypes = new Set()
            for(let i = 0; i < txData.from.length; i++){
                if (!(txData.tags[i].includes('Ignore'))){
                    senders.add(txData.from[i])
                    receivers.add(txData.to[i])
                    coins.add(txData.tokenSymbol[i])
                    coinAddresses[txData.tokenSymbol[i]] = txData.tokenAddress[i]
                    if (coins.size === 1) {
                        result.coinAmount += txData.tokenTransfers[i]
                    } else {
                        result.coinAmount = '---------'
                    }
                    result.usdAmountThen += txData.usdTransfer[i]
                    for (let tag of txData.tags[i]){
                        if (!(result.tags.includes(tag))){
                            result.tags.push(tag)
                            let key = `${txData.from[i]}_${txData.to[i]}`;
                            if(!tagsMapping[key]){
                                tagsMapping[key] = new Set();
                                tagsMapping[key] = tagsMapping[key].add(tag);
                            } else {
                                tagsMapping[key] = tagsMapping[key].add(tag);
                            }
                        }
                    }
                }
            }
            result.froms = senders.size
            result.tos = receivers.size

            for(let coinName of coins) {
                result.coins.push({
                    name: coinName.toUpperCase(),
                    address: coinAddresses[coinName]
                })
            }

            // result.usdAmountThen = result.coinAmount
            if (txData.txType.toUpperCase() === 'Untagged'.toUpperCase()) result.tags.push(txData.txType)

            return result
        },
        getTagColor: (name) => {
            let colors = ['#28456c', '#89632a', '#69314c', '#373737', '#603b2c', '#854c1d', '#492f64', '#2b593f', '#6e3630', '#5a5a5a'];
            let x = 0;
            for (let c of name) 
                x += (c.charCodeAt(0));
            
            // while (x%10 == 0) {x = Math.floor(x/10);}

            return colors[x%10];
        }
    }

    return (
        <>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                    <CTableHeaderCell className="lorge-col" scope="col">Transaction Hash</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col" scope="col">From</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col" scope="col">To</CTableHeaderCell>
                    <CTableHeaderCell className="lorge-col" scope="col">Coins</CTableHeaderCell>
                    <CTableHeaderCell className="smol-col" scope="col">Coin Amount</CTableHeaderCell>
                    <CTableHeaderCell className="lorge-col" scope="col">
                        {  
                            <div className='text-with-button'>
                                <div className='text-with-button'><p>Amount In USD</p></div>
                                <button onClick={usdAmountForToggle}>{usdAmountFor}</button>
                            </div>
                        }
                    </CTableHeaderCell>
                    <CTableHeaderCell className="tags-col" scope="col">Tags</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                    {
                        Object.entries(data).map(([parentTxHash, parentTxObj], pIndex) => {
                            const aggregateData = util.aggregateTxData(parentTxObj)
                            return (
                                <>
                                    <CTableRow v-for="item in tableItems" key={pIndex}>
                                        <CTableDataCell className="lorge-col">
                                            <a 
                                                className='etherscan-link' 
                                                href={parentTxObj.explorerURLTx + parentTxHash}
                                                target='_blank'
                                            >
                                                {util.txHashShorten(parentTxHash)}
                                            </a>
                                        </CTableDataCell>
                                        <CTableDataCell className="smol-col">
                                            <p>{aggregateData.froms} unique addr.</p>
                                        </CTableDataCell>
                                        <CTableDataCell className="smol-col">
                                            <p>{aggregateData.tos} unique addr.</p>
                                        </CTableDataCell>
                                        <CTableDataCell className="lorge-col">
                                            {aggregateData.coins.map((coinObj, index) => (
                                                <a 
                                                    href={(coinObj.address !== '')?(parentTxObj.explorerURLAddress + coinObj.address):(props.address)} 
                                                    target="_blank"
                                                >
                                                    <img className="tx-coin-img" src={coinImages[coinObj.name]} alt={coinObj.name} />
                                                </a>
                                            ))}
                                        </CTableDataCell>
                                        <CTableDataCell className="smol-col">
                                            <p>{aggregateData.coinAmount}</p>
                                        </CTableDataCell>
                                        <CTableDataCell className="lorge-col">
                                            <p>{aggregateData.usdAmountThen}</p>
                                        </CTableDataCell>
                                        <CTableDataCell className="tags-col">
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                {aggregateData.tags.map((tag, index) => {
                                                    let tagColor = util.getTagColor(tag)
                                                    return (
                                                        <div 
                                                            className='tag-in-table'
                                                            style={{backgroundColor: tagColor}}
                                                        >
                                                            {tag}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell colSpan="12">
                                            <CTable>
                                                <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">From</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">To</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Token</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">USD Amount</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Tags</CTableHeaderCell>
                                                </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                                    {parentTxObj.from.map((fromAddress, cIndex) => {
                                                        //console.log(parentTxObj);
                                                        //console.log(pIndex, cIndex);
                                                        let toAddress = parentTxObj.to[cIndex]
                                                        let tokenSymbol = parentTxObj.tokenSymbol[cIndex].toUpperCase()
                                                        let tokenAddress = parentTxObj.tokenAddress[cIndex]
                                                        let tokenAmount = parentTxObj.tokenTransfers[cIndex]
                                                        let usdAmount = parentTxObj.usdTransfer[cIndex]
                                                        let tags = parentTxObj.tags[cIndex]
                                                        if (tags[0] === "Ignore") return (<></>)
                                                        return (
                                                            <CTableRow>
                                                                <CTableHeaderCell className="lorge-col">
                                                                    <a 
                                                                        className='etherscan-link' 
                                                                        href={parentTxObj.explorerURLAddress + fromAddress}
                                                                        target='_blank'
                                                                    >
                                                                        {util.addressShorten(fromAddress)}
                                                                    </a>
                                                                </CTableHeaderCell>
                                                                <CTableHeaderCell className="lorge-col">
                                                                    <a 
                                                                        className='etherscan-link' 
                                                                        href={parentTxObj.explorerURLAddress + toAddress}
                                                                        target='_blank'
                                                                    >
                                                                        {util.addressShorten(toAddress)}
                                                                    </a>
                                                                </CTableHeaderCell>
                                                                <CTableHeaderCell scope="row">
                                                                    <a 
                                                                        href={(tokenAddress !== '')?(parentTxObj.explorerURLAddress + tokenAddress):(props.address)} 
                                                                        target="_blank"
                                                                    >
                                                                        <img className="tx-coin-img" src={coinImages[tokenSymbol]} alt={tokenSymbol} />
                                                                    </a>
                                                                </CTableHeaderCell>
                                                                <CTableDataCell>{tokenAmount}</CTableDataCell>
                                                                <CTableDataCell>{usdAmount}</CTableDataCell>
                                                                <CTableDataCell>
                                                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                                                        {tags.map((tag, index) => {
                                                                            let tagColor = util.getTagColor(tag)
                                                                            return (
                                                                                <div 
                                                                                    className='tag-in-table'
                                                                                    style={{backgroundColor: tagColor}}
                                                                                >
                                                                                    {tag}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    
                                                                        <CButton color="info" onClick={() => handleAddTag(fromAddress, toAddress, tags)}>Add Tag</CButton>
                                                                        <CFormSelect 
                                                                            aria-label="Select Tag"
                                                                            options={['Expense', 'Income', 'Grants', 'NFT Sale Income']}
                                                                            onChange={handleChange}
                                                                            />
                                                                        <CButton color="info" onClick={() => handleTagAddition(parentTxHash, cIndex)}>Add Tag to object</CButton>

                                                                    </div>
                                                                </CTableDataCell>
                                                            </CTableRow>
                                                        )}
                                                    )}
                                                </CTableBody>
                                            </CTable>
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </>
                            );}
                        )
                    }
                </CTableBody>
            </CTable>
        </>
    )
}

export default TxTable
