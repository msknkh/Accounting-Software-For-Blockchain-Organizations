
# A very simple Flask Hello World app for you to get started with...

from lib2to3.pgen2 import token
from flask import Flask,jsonify,request
import asyncio
from processing import list_transactions_eth
import pandas as pd
#from price_fetcher import reprocess
import json
import requests

async def async_get_data():
    await asyncio.sleep(3)
    return 'Done!'

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello to DAOccounting server! Happy to serve you.'

@app.route("/data")
async def get_data():
  data = await async_get_data()
  return data

@app.route("/addressData", methods=['GET'])
async def get_address_data():
  args = request.args
  address = args.get("address")
  processed_data = await list_transactions_eth(address)
  reprocessed_data = processed_data#await reprocess(processed_data)
  return jsonify(reprocessed_data)

@app.route('/sampleData', methods = ['GET'])
def ReturnJSON():
  if(request.method == 'GET'):
    data = json.load(open('./processed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'))
    return jsonify(data)

@app.route('/sampleDataReprocessed', methods= ['GET'])
def ReturnReprocessed():
  if(request.method == 'GET'):
    data = json.load(open('./reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb-2.json'))
    return jsonify(data)

@app.route('/getWalletData',methods = ['GET'])
def WalletDataFetch():
  if(request.method == 'GET'):
    args = request.args
    address = args.get("address")
    native_balance = 'https://deep-index.moralis.io/api/v2/%s/balance'% (address)
    token_balance = 'https://deep-index.moralis.io/api/v2/%s/erc20'% (address)
    apiToken1 = 'TgoiX4K24TcoqmbPCI1RbobH6jFmLqmf4d2lL3feW7rpOEzSKhfaWUDY4QQYCul6'
    apiToken2 = 'd1Rbr4dswHNvrj9FScCEHvXuFt94Nt6DW8GkIlY8leZxkXoTPuzC1p8xMd7n6tGF'
    result = []
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": apiToken1
    }
    
    statusResponse = requests.request("GET", native_balance, headers=headers)
    data = statusResponse.json()

    url_ETH = 'https://min-api.cryptocompare.com/data/price'    
    
    parameters = {'fsym': 'ETH',
                  'tsyms': 'USD' }
    parameters['e'] = 'coinbase'
        
    # response comes as json
    response = requests.get(url_ETH, params=parameters)   
    price_of_eth = response.json()['USD']
    

    result.append({
      'name':'ETH',
      'balance':data['balance'],
      'contractAddress':'',
      'currentPrice': price_of_eth
    })
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": apiToken2
    }

    statusResponse = requests.request("GET", token_balance, headers=headers)
    dataERC20 = statusResponse.json()

    apiTokens = ['d1Rbr4dswHNvrj9FScCEHvXuFt94Nt6DW8GkIlY8leZxkXoTPuzC1p8xMd7n6tGF', 'hdr6pUpdPSG0gs82hyD4vygQzpvEdV7SU4ZQjtI5LL1KPm9IrVa8exP54gV7wmZf', 'qifZn2SdNcndBrF0sy8loE2vSDxbbpXditplp2ctFVqvqGzJVn2U12zqfO8SIvVg', 'TgoiX4K24TcoqmbPCI1RbobH6jFmLqmf4d2lL3feW7rpOEzSKhfaWUDY4QQYCul6']

    for i in range(len(dataERC20)):
      headers = {
        "Content-Type": "application/json",
        "X-API-Key": apiTokens[i%len(apiTokens)]
        }

      token_price = 'https://deep-index.moralis.io/api/v2/erc20/%s/price'% (dataERC20[i]['token_address'])

      statusResponse = requests.request("GET", token_price, headers=headers)
      dataTokenPrice = statusResponse.json()['usdPrice']
      result.append({
      'name': dataERC20[i]['symbol'],
      'balance':(int(dataERC20[i]['balance'])/pow(10,dataERC20[i]['decimals'])),
      'contractAddress':dataERC20[i]['token_address'],
      'currentPrice': dataTokenPrice
      })


    return jsonify(result)