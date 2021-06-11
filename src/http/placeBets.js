



export const executeReduceSize = async (bet) => {
    const cancelOrder = await postData('/api/cancel-order', bet);
    return cancelOrder && cancelOrder.status === 'SUCCESS';
  };