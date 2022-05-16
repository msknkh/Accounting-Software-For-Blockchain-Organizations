import json
import asyncio
from raw_josn_gen import get_transactions

async def list_transactions_eth(address):
    # f = open('./' + address + '.json')
    rawData = get_transactions(address)
    
    txs = {}
    
    for txHash in rawData.keys():
        txTemp = {
            'lastSignee': rawData[txHash]['senderAddress'],
            'txHash': txHash,
            'txType': '',
            'txBlock': rawData[txHash]['block'],
            'txTimestamp': rawData[txHash]['timestampUTC'],
            'txCost': rawData[txHash]['txCostInEth'],
            'txCostInUSD': rawData[txHash]['txCostInUSD'],
            'chain': 'eth',
            'explorerURL': 'https://etherscan.io/',
            'atomicTransactions': []
        }

        for transfer in rawData[txHash]['tokenTransfers']:
            tempAtomicTx = {
                'txType': '',
                'from': '',
                'to': '',
                'amountTransfer': '',
                'tokenSymbol': '',
                'tokenAddress': '',
                'tokenType': '',
                'tags': []
            }

            sender = transfer['sender']
            if type(sender) == dict:
                sender = sender['senderAddress']
            tempAtomicTx['from'] = sender
            
            receiver = transfer['receiver']
            if type(receiver) == dict:
                receiver = receiver['receiverAddress']
            tempAtomicTx['to'] = receiver
            
            if sender == address :
                tempAtomicTx['txType'] = 'Expense'
            elif receiver == address:
                tempAtomicTx['txType'] = 'Income'
            else:
                tempAtomicTx['txType'] = 'Miscellaneous'

            tempAtomicTx['amountTransfer'] = transfer['amount']

            token = transfer['token']
            tokenSymbol = ''
            tokenAddress = ''
            tokenType = ''
            if (token == 'ETH'):
                tokenSymbol = 'eth'
                tokenAddress = ''
                tokenType = 'native'
            else: 
                tokenSymbol = token['tokenSymbol']
                tokenAddress = token['tokenEthScan'].split('/')[-1]
                if token['tokenEthScan'].endswith('inventory'):
                    tokenType = 'NFT'
                else:
                    tokenType = 'ERC20'
                
            tempAtomicTx['tokenSymbol'] = tokenSymbol
            tempAtomicTx['tokenAddress'] = tokenAddress
            tempAtomicTx['tokenType'] = tokenType

            tags = [tempAtomicTx['txType'], tokenType]
            if sender == '0x0000000000000000000000000000000000000000': 
                tags.append('Mint')
                if receiver != address:
                    tags = ['Ignore']
            elif receiver == '0x0000000000000000000000000000000000000000':
                tags.append('Burn')
                if sender != address:
                    tags = ['Ignore']
            
            if sender != address and receiver != address:
                tags = ["Ignore"]

            tempAtomicTx['tags'] = tags

            txTemp['atomicTransactions'].append(tempAtomicTx)
        
        txs[txHash] = txTemp

    return txs


if __name__ == "__main__":
    address = '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb'
    processed_data = list_transactions_eth(address)
    with open('processed-' + address + '.json', 'w') as outfile:
        json.dump(processed_data, outfile, indent = 4)