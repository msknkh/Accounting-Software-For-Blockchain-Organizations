import crypto
import ccxt
import json
import time
import requests


def get_all_required_calls(data):
    blocks = set()
    tempResults = {}

    for txHash, txData in data.items():
        blocks.add(txData['txTimestamp'])
        for i in range(len(txData['tags'])):
            if 'ERC20' in txData['tags'][i]:
                if txData['tokenAddress'][i] not in tempResults:
                    tempResults[txData['tokenAddress'][i]] = set()
                tempResults[txData['tokenAddress'][i]].add(txData['txBlock'])
    
    results = {
        'ETH': list(blocks)
    }

    for address, blockSet in tempResults.items():
        results[address] = list(blockSet)
    
    return results

def execute_get_prices_calls(calls):
    result = {'ETH': get_past_eth_prices(calls['ETH'])}
    
    for address, blockList in calls.items():
        if address == 'ETH': continue
        result[address] = get_past_erc20_prices(blockList, address)
        
    return result

def get_past_eth_prices(timestamps):
    result = {}

    startingPoint = (int(min(timestamps)) - 10*3600) * 1000
    endPoint= min(int(max(timestamps) + (10*3600)), time.time()) * 1000

    ethPrices = get_eth_prices_from_ccxt(startingPoint, endPoint)

    for ts in timestamps:
        ts = int(ts)
        tsRounded = round(ts/3600) * 3600

        result[ts] = ethPrices[tsRounded]
    
    return result



def get_eth_prices_from_ccxt(startingPoint, endPoint):
    exchange = ccxt.binance()

    result = {}

    while startingPoint < endPoint:
        resp = exchange.fetch_ohlcv(symbol='ETH/USDT', timeframe='1h', since=startingPoint)

        for d in resp:
            result[int(d[0]/1000)] = d[4]
        
        startingPoint = max(result.keys())*1000

        time.sleep (exchange.rateLimit / 1000)
    
    return result

def get_past_erc20_prices(blockList, tokenAddress):
    apiTokens = ['d1Rbr4dswHNvrj9FScCEHvXuFt94Nt6DW8GkIlY8leZxkXoTPuzC1p8xMd7n6tGF', 'hdr6pUpdPSG0gs82hyD4vygQzpvEdV7SU4ZQjtI5LL1KPm9IrVa8exP54gV7wmZf', 'qifZn2SdNcndBrF0sy8loE2vSDxbbpXditplp2ctFVqvqGzJVn2U12zqfO8SIvVg', 'TgoiX4K24TcoqmbPCI1RbobH6jFmLqmf4d2lL3feW7rpOEzSKhfaWUDY4QQYCul6']

    result = {}
    i = 0

    for block in blockList:
        result[block] = moralis_erc20_past_price(apiTokens[i%len(apiTokens)], block, tokenAddress)
        i+=1
        time.sleep(0.01)
    
    return result


        
def moralis_erc20_past_price(apiToken, block, tokenAddress):
    url = 'https://deep-index.moralis.io/api/v2/erc20/%s/price?chain=eth&to_block=%s' % (tokenAddress, block)

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": apiToken
    }

    statusResponse = requests.request("GET", url, headers=headers)
    data = statusResponse.json()
    return data['usdPrice']

def reprocess_for_prices(data, pastPrices):
    result = {}
    for txHash, txData in data.items():
        result[txHash] = txData
        result[txHash]['txTimestamp'] = int(txData['txTimestamp'])
        result[txHash]['EthPriceAtTx']= pastPrices['ETH'][txData['txTimestamp']]
        result[txHash]['txCostInUSD'] = round(txData['txCost'] * result[txHash]['EthPriceAtTx'], 4)
        
        result[txHash]['tokenPriceAtTx'] = []
        result[txHash]['usdTransfer'] = []
        for i in range(len(txData['tokenAddress'])):
            tokenPrice, usdTransferred = -1, -1
            if 'ERC20' in txData['tags'][i] or 'native' in txData['tags'][i]:
                if txData['tokenAddress'][i] == '':
                    tokenPrice = pastPrices['ETH'][txData['txTimestamp']]
                else:
                    tokenPrice = pastPrices[txData['tokenAddress'][i]][txData['txBlock']]
                
                usdTransferred = round(tokenPrice * txData['tokenTransfers'][i], 4)
            
            result[txHash]['tokenPriceAtTx'].append(tokenPrice)
            result[txHash]['usdTransfer'].append(usdTransferred)
    
    return result
        

def set_prices(data):
    # f = open(fileName)
    # data = json.load(f)
    # f.close()

    calls = get_all_required_calls(data)
    
    pastPrices = execute_get_prices_calls(calls)

    newData = reprocess_for_prices(data, pastPrices)

    return newData


def reprocess(data):
    # fileName = 'processed-%s.json' % (address)

    reprocessedData = set_prices(data)

    # with open('reprocessed-' + address + '.json', 'w') as outfile:
    #     json.dump(reprocessedData, outfile, indent = 2)
    return reprocessedData



# reprocess('0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb')