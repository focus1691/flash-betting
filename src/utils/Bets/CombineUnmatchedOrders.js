export const combineUnmatchedOrders = (backList, layList, stopEntryList, tickOffsetList, stopLossList, unmatchedList) => {

    let allOrders = {}; // selectionId: {rfs(parameter): [orders]}
    allOrders = selectionKeyCombinations(backList, allOrders);
    allOrders = selectionKeyCombinations(layList, allOrders);
    allOrders = selectionKeyCombinations(stopEntryList, allOrders);
    allOrders = nonSelectionKeyCombinations(tickOffsetList, allOrders);
    allOrders = nonSelectionKeyCombinations(stopLossList, allOrders);
    allOrders = nonSelectionKeyCombinations(unmatchedList, allOrders);
    
    return allOrders;
}

// the ones with {selectionId(parameter): [orders]}
const selectionKeyCombinations = (list, allOrders) => {
    const newAllOrders = Object.assign({}, allOrders)
    Object.keys(list).map(selectionId => {
        const objectsToAdd = {};
        
        list[selectionId].map(order => {
            objectsToAdd[order.rfs] = objectsToAdd[order.rfs] === undefined ? [order] : objectsToAdd[order.rfs].concat(order);
        })

        newAllOrders[selectionId] = {...allOrders[selectionId], ...objectsToAdd}
    })

    return newAllOrders;
}

const nonSelectionKeyCombinations = (list, allOrders) => {
    const newAllOrders = Object.assign({}, allOrders)
    Object.values(list).map(order => {
      // find selection Id
      const selectionInAllOrders = newAllOrders[order.selectionId] === undefined ? {} : newAllOrders[order.selectionId];
      
      // find and add to rfs 
      if (selectionInAllOrders[order.rfs] === undefined) {
        selectionInAllOrders[order.rfs] = [order]
      } else {
        selectionInAllOrders[order.rfs] = selectionInAllOrders[order.rfs].concat(order)
      }
      
      newAllOrders[order.selectionId] = selectionInAllOrders
    })
    return newAllOrders
}