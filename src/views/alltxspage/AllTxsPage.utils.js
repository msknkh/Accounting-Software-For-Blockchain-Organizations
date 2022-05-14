/* eslint-disable */
export const filter = (tags, coins, senderAddresses, reciepientAddresses, data) => {
    let filteredData = data;
    console.log(tags);
    for (let tag of tags) {
        filteredData = filterByTag(tag.value, filteredData);
    }
    for (let coin of coins) {
        filteredData = filterByField(coin.value, 'tokenSymbol', filteredData);
    }
    for (let senderAddress of senderAddresses){
        filteredData = filterByField(senderAddress.value, 'from', filteredData);
    }
    for (let reciepientAddress of reciepientAddresses){
        filteredData = filterByField(reciepientAddress.value, 'to', filteredData);
    }
    return filteredData;
}

export const filterByTag = (tag, data) => {
    
    let result = {};
    Object.entries(data).map(([parentTxHash, parentTxObj]) => {
        let includeTx = false;
        for (let i = 0; i < parentTxObj.from.length; i++){
            if(parentTxObj.tags[i].map(x => x.toUpperCase()).includes(tag.toUpperCase())){
                includeTx = true;
                break;
            }
        }

        if (includeTx) {
            result[parentTxHash] = {};
            let arrFields = ['from', 'to', 'tokenTransfers', 'tokenSymbol', 'tokenAddress', 'tokenType', 'tags', 'tokenPriceAtTx', 'usdTransfer']
            for(let [key, value] of Object.entries(parentTxObj)) {
                if (!(key in arrFields)) {
                    result[parentTxHash][key] = value
                }
            }
            
            for(let key of arrFields) {
            result[parentTxHash][key] = []
            }
            
            for(let i = 0; i<parentTxObj.from.length; i++){
                if(parentTxObj.tags[i].map(x => x.toUpperCase()).includes(tag.toUpperCase())){
                    for(let key of arrFields) {
                        result[parentTxHash][key].push(parentTxObj[key][i])
                    }
                }
            }
        }
    })
    return result;
}
    
export const filterByField = (filterTerm, comparisionField, data) => {
        
    let result = {};
    Object.entries(data).map(([parentTxHash, parentTxObj]) => {
        let includeTx = false;
        for (let i = 0; i<parentTxObj.from.length; i++){
            if(filterTerm.toUpperCase() == parentTxObj[comparisionField][i].toUpperCase()){
                includeTx = true;
                break;
            }
        }
        
        if (includeTx) {
            result[parentTxHash] = {};
            let arrFields = ['from', 'to', 'tokenTransfers', 'tokenSymbol', 'tokenAddress', 'tokenType', 'tags', 'tokenPriceAtTx', 'usdTransfer']
            for(let [key, value] of Object.entries(parentTxObj)){
                if (!(key in arrFields)) {
                    result[parentTxHash][key] = value
                }
            }
            
            for(let key of arrFields) {
                result[parentTxHash][key] = []
            }
            
            for(let i = 0; i<parentTxObj.from.length; i++){
                if (filterTerm.toUpperCase() === parentTxObj[comparisionField][i].toUpperCase() ){
                    for(let key of arrFields) {
                        result[parentTxHash][key].push(parentTxObj[key][i])
                    }
                }
            }
        }
    })

    return result;
}

export const filterByTxType = (txType, data) => {
    let result = {};
    console.log("l1", txType, data)
    Object.entries(data).map(([parentTxHash, parentTxObj]) => {
        console.log("l1")
        if (txType.toUpperCase() === parentTxObj.txType.toUpperCase()){
            result[parentTxHash] = parentTxObj
        }
    })
    console.log("l3", result)
    return result;
}