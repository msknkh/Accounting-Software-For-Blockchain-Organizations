/* eslint-disable */
import { Client, AccountId, PrivateKey, ContractFunctionParameters, ContractCallQuery, Hbar } from "@hashgraph/sdk";
import operator from "../../secretKeys.js";

async function checkEditorAddress(daoName, address) {

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

    //Query the contract to check if an address is an editor for a dao
    const contractCallQuery = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100000)
    .setFunction("isEditor", new ContractFunctionParameters().addString(daoName).addAddress(address))
    .setQueryPayment(new Hbar(10));
    const contractUpdateResult = await contractCallQuery.execute(client);
    const isEditorAddress = contractUpdateResult.getBool(0);
    console.log("Bool for if the address is editor for the dao: " + isEditorAddress);

    return isEditorAddress;
}

export default checkEditorAddress;
