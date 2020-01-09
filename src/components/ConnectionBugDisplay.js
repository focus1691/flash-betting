import React from 'react';

const ConnectionBugDisplay = ({connectionError, socket, marketId, initialClk, clk, setClk, setInitialClk}) => {
    

    const resubscribe = (marketId, initialClk, clk) => {
        if (marketId && initialClk && clk) {
            socket.emit("market-resubscription", {marketId, initialClk, clk});
            // setClk(null)
            // setInitialClk(null);
        }
    }
    
    return (
        <div className = "connectionbug-container" style = {{visibility: connectionError !== "" ? 'visible' : 'hidden'}}>
            <p className = "connectionbug-text">{connectionError}</p>
            <button onClick = {() => resubscribe(marketId, initialClk, clk)}>Resubscribe</button>
        </div>
    )
    
} 

export default ConnectionBugDisplay;

