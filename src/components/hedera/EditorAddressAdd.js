/* eslint-disable */
import { Client, AccountId, PrivateKey, ContractFunctionParameters, ContractExecuteTransaction, ContractCallQuery, Hbar } from "@hashgraph/sdk";
import operator from "../../secretKeys.js";

async function addEditorAddress(daoName, address) {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = AccountId.fromString(operator.id);
    const myPrivateKey = PrivateKey.fromString(operator.pvkey);

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const newContractId = '0.0.34746452';
    
    //Create the transaction to add another editor address
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(newContractId)
    .setGas(100000)
    .setFunction("setEditor", new ContractFunctionParameters().addString(daoName).addAddress(address));
    const submitExecTx = await contractExecTx.execute(client);
    const receipt2 = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt2.status.toString());

    return receipt2.status.toString();

}

export default addEditorAddress;
