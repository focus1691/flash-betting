import React, { useCallback } from 'react';

const ConnectionStatus = ({connectionError, setConnectionError, socket, marketId, initialClk, clk}) => {
    const resubscribe = useCallback(() => {
        if (marketId && initialClk && clk) {
            socket.emit("market-resubscription", {marketId, initialClk, clk});
            setConnectionError("");
        }
    }, [clk, initialClk, marketId, setConnectionError, socket]);
    
    return (
        <div className = "connectionbug-container" style = {{visibility: connectionError !== "" ? 'visible' : 'hidden'}}>
            <p className = "connectionbug-text">{connectionError}</p>
            <button onClick = {resubscribe}>Resubscribe</button>
        </div>
    );
} 

export default ConnectionStatus;