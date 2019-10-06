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

const checkTimeListAfter = async (list, selectionId, marketStartTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets) => {

  const newSelectionArray = list;
  let ordersToRemove = []
  let indexesToRemove = []
  
  newSelectionArray.map((order, index) => {

    // it can be abs because we know the market already started
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

  return newSelectionArray.filter((item, index) => indexesToRemove.indexOf(index) === -1)

}

export { checkTimeListsBefore, checkTimeListAfter };