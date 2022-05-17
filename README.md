# DAO Books - DAO Accounting Tool

- DaoBooks empowers the DAO users to:
- See decoded transactions and tag them
- Its intelligent auto-tagging feature makes it such that the accountant would only have to add a few tags for 100s of transactions
- It allows them to build a fully customisable income, expense and P&L statement
- It gives them an overview of the treasury and the cash flow 
- The report can be publicly viewed by anyone but tags can only be edited by wallets nominated by the DAO
- Gnosis safe tx cost the last signee gas fees, DAOs can now track and repay their contributors their gas fees in only a three clicks
- Gnosis safe’s CSV airdrop app is widely used for making bulk transactions but it has a very poor UI, DaoBooks’ UI will blow it out of the water
- [Not yet implemented - on frontend] Facility to create and analyse Projections and checkout the taxes that the DAO owes to the state


![DAO Books Main Page](/home/muskan/coreui-free-react-admin-template/src/assets/images/mainpage.png)

![Profit And Loss Statement](/home/muskan/coreui-free-react-admin-template/src/assets/images/pnl.png)

![Treasury](/home/muskan/coreui-free-react-admin-template/src/assets/images/treasury.png)

![Dashboard](/home/muskan/coreui-free-react-admin-template/src/assets/images/summary2.png)

![Gas Fees](/home/muskan/coreui-free-react-admin-template/src/assets/images/gas.png)

![Multisend CSV](/home/muskan/coreui-free-react-admin-template/src/assets/images/make-multi.png)


## Installation

DAO Books frontend is made using React.js and backend is written in flask and python. It makes call to the hedera smart contract service written in javascript - [Github repo for hedera smart contracts](https://github.com/msknkh/hedera-backend) 

To run DAO Books frontend :- 

Install the dependencies and devDependencies and start the server. Note - Provide a secretKeys.js file as mentioned below. 

```sh
yarn install
yarn start
```

You will have to provide a secretKeys.js file in the source directory providing the hedera test net credentials in the following format -

```
// HEDERA TESTNET CREDENTIALS
 const operator = {
 	id: "...",
 	pvkey: ".."
 };
 export default operator;
```
