import sys
import json
import time
import html
from bs4 import BeautifulSoup
from datetime import datetime
from requests import get
from joblib import Parallel, delayed

API_KEY = "FY1MFNM4U6YD6MMITCR2WT36XKCAMSJMMM"
BASE_URL = "https://api.etherscan.io/api"
ETHER_VALUE = 10 ** 18
txs = {}

def get_formatted_transaction_info(transaction_info):
  if not transaction_info or not transaction_info.find('span'):
    return {}

  arr = transaction_info.find_all('span')
  result = {
      'block': int(arr[0].text),
      'timestampUTC': time.mktime(datetime.strptime(arr[1].text, '%Y-%m-%d %H:%M:%S').timetuple()),
      'txCostInEth': float(arr[2].text),
      'txCostInUSD': float(arr[3].text.replace(',', ''))
  }
  return result

def get_formatted_token_transfers(token_transfers):
  if not token_transfers or not token_transfers.find('td'):
    return []

  arr = token_transfers.find_all('td')

  result = []

  for i in range(0, len(arr), 4):
    sender = arr[i]
    if sender.find('a'):
      sender = {
        'senderEthScan': arr[i].a['href'],
        'senderAddress': arr[i].a['href'].split('/')[-1]
      }
    else:
      sender = sender.text # e.g. for newly minted tokens i.e. sent from 0x00..00

    token = arr[i+1]
    if token.find('a'):
      token = {
          'tokenEthScan': token.a['href'],
          'tokenSymbol': token.a.text
      }
    else:
      token = token.text

    receiver = arr[i+3]
    if receiver.find('a'):
      receiver = {
        'receiverEthScan': arr[i+3].a['href'],
        'receiverAddress': arr[i+3].a['href'].split('/')[-1]
      }
    else:
      receiver = receiver.text # e.g. for burnt tokens i.e. sent to 0x00..00

    result.append({
      'sender': sender,
      'token': token,
      'amount': float(arr[i+2].text.replace(',','')),
      'receiver': receiver
    })

  return result

def get_formatted_execution_trace(execution_trace):
  if not execution_trace or not execution_trace.find('a'):
    return {}
  arr = execution_trace.find_all('a')
  sender = ''
  for r in arr:
    if 'sender' in r.text:
      sender = r
      break
  
  result = {
      'senderEthScan': sender['href'],
      'senderAddress': sender['href'].split('/')[-1]
  }
  
  return result

# assumption: will only be run for successful txs, with input data
def get_internal_transactions(txHash):
  print('FETCHING FOR', txHash)
  url = 'https://ethtx.info/mainnet/{0}/'.format(txHash)
  r = get(url=url, params={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'})

  soup = BeautifulSoup(r.text, 'html.parser')
  transaction_info = soup.find('div', class_='transaction-info')
  # emitted_events = soup.find('div', class_='events')
  # account_balances = soup.find('div', class_='account-balances')
  token_transfers = soup.find('div', class_='transfers')
  execution_trace = soup.find('div', class_='calls')

  transaction_info = get_formatted_transaction_info(transaction_info)
  token_transfers = get_formatted_token_transfers(token_transfers)
  execution_trace = get_formatted_execution_trace(execution_trace)

  result = transaction_info
  result.update(execution_trace)
  result['tokenTransfers'] = token_transfers
  txs[txHash] = result
  #return result


def make_api_url(module, action, address, **kwargs):
	url = BASE_URL + f"?module={module}&action={action}&address={address}&apikey={API_KEY}"

	for key, value in kwargs.items():
		url += f"&{key}={value}"

	return url

def get_account_balance(address):
	balance_url = make_api_url("account", "balance", address, tag="latest")
	response = get(balance_url)
	data = response.json()

	value = int(data["result"]) / ETHER_VALUE
	return value

def get_transactions(address):
  transactions_url = make_api_url("account", "txlist", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
  response = get(transactions_url)
  data = response.json()["result"]

  internal_tx_url = make_api_url("account", "txlistinternal", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
  response2 = get(internal_tx_url)
  data2 = response2.json()["result"]

  internal_tx_url = make_api_url("account", "tokentx", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
  response3 = get(internal_tx_url)
  data3 = response3.json()["result"]

  internal_tx_url = make_api_url("account", "tokennfttx", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
  response4 = get(internal_tx_url)
  data4 = response4.json()["result"]

  data.extend(data2)
  data.extend(data3)
  data.extend(data4)
  data.sort(key=lambda x: int(x['timeStamp']))

  tx_hashes = set()
  for x in data:
    tx_hashes.add(x['hash'])

  current_balance = 0
  balances = []
  times = []
  txs = {}
  # Parallel(n_jobs=4, require='sharedmem')(delayed(get_internal_transactions)(tx_hash) for tx_hash in tx_hashes)

  # for tx_hash in tx_hashes:
    
  #   txs[tx_hash] = get_internal_transactions(tx_hash)

  with Parallel(n_jobs=10) as parallel:
    parallel(delayed(get_internal_transactions)(tx_hash) for tx_hash in tx_hashes)

  txs2 = txs
  txs.clear()
  return txs2

# if __name__ == '__main__':
#   address = sys.argv[1]
#   #address = '0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb'
#   txs_data = get_transactions(address)

#   with open(address+'.json', 'w') as fp:
#       json.dump(txs_data, fp)