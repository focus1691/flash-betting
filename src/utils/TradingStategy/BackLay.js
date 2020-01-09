const checkTimeListsBefore = async (list, marketStartTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets) => {

    const newList = Object.assign({}, list)
    let ordersToRemove = []

    Object.keys(list).map(selectionId => {
      const newSelectionArray = newList[selectionId];
      let indexesToRemove = []
       // this is for the remove orders
      list[selectionId].map((order, index) => {
        const remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000) 
        
        const isReady = order.executionTime === "Before" && remainingTime - order.timeOffset <= 0;

        if (isReady) {
          onPlaceOrder({
            marketId: marketId,
            selectionId: parseInt(selectionId),
            side: side,
            size: order.size,
            price: order.price,
            matchedBets: matchedBets,
            unmatchedBets: unmatchedBets
          })

          
          indexesToRemove = indexesToRemove.concat(index)
          ordersToRemove = ordersToRemove.concat(order)
        }
      })
  
      newList[selectionId] = newSelectionArray.filter((item, index) => indexesToRemove.indexOf(index) === -1)
      if (newList[selectionId].length === 0) {
        delete newList[selectionId]
      }
  
    })

    if (ordersToRemove.length > 0) {
      await fetch('/api/remove-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ordersToRemove)
      })
    }
  
    return newList
}

const checkTimeListsAfter = async (list, marketStartTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets) => {

  const newList = Object.assign({}, list)
  let ordersToRemove = []

    Object.keys(list).map(selectionId => {
      const newSelectionArray = newList[selectionId];
      let indexesToRemove = []
       // this is for the remove orders
      list[selectionId].map((order, index) => {
        const timePassed = Math.abs((new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000))
        const isReady = order.executionTime === "After" && timePassed >= order.timeOffset;

        if (isReady) {
          onPlaceOrder({
            marketId: marketId,
            selectionId: parseInt(selectionId),
            side: side,
            size: order.size,
            price: order.price,
            matchedBets: matchedBets,
            unmatchedBets: unmatchedBets
          })

          
          indexesToRemove = indexesToRemove.concat(index)
          ordersToRemove = ordersToRemove.concat(order)
        }
      })
  
      newList[selectionId] = newSelectionArray.filter((item, index) => indexesToRemove.indexOf(index) === -1);
      if (newList[selectionId].length === 0) {
        delete newList[selectionId]
      }
  
    })

    if (ordersToRemove.length > 0) {
      await fetch('/api/remove-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ordersToRemove)
      })
    }
    return newList;
}

const getTimeToDisplay = (order, marketStartTime) => {
  const remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000) 

  if (order.executionTime === "After") {
    return secToMin(remainingTime + order.timeOffset)
  } else {
    const remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000)
    return secToMin(remainingTime - order.timeOffset)
  }

}

function secToMin(seconds) {
  let sec = Math.ceil(seconds % 60);
  const min = parseInt(seconds / 60);
  if(sec.toString().length === 1) { // padding
      sec = "0" + sec;
  }
  return min + ":" + sec;
}

export { checkTimeListsBefore, checkTimeListsAfter, getTimeToDisplay };