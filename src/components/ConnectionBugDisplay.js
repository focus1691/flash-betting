import React, { useEffect, useState } from 'react'
import GetSubscriptionErrorType from '../utils/ErrorMessages/GetSubscriptionErrorType';

const ConnectionBugDisplay = ({socket, marketId, initialClk, clk, setClk, setInitialClk}) => {
    const [connectionError, setConnectionError] = useState("")

    useEffect(() => {
        socket.on("subscription-error", async data => {
            socket.off("subscription-error");
            if (data.statusCode === "FAILURE") {
                if (GetSubscriptionErrorType(data.errorCode) === "Authentication") {
                    window.location.href = window.location.origin + `/?error=${data.errorCode}`;
                } else {
                    setConnectionError(data.errorMessage)
                }
            } else {
                setConnectionError("")
            }
        })
    })

    const resubscribe = (marketId, initialClk, clk) => {
        console.log('resubscribing...');
        if (marketId && initialClk && clk) {
            setClk(null)
            setInitialClk(null);
            socket.emit("market-resubscription", {marketId, initialClk, clk});
        }
            
    }
    

    return (
        <div className = "connectionbug-container" style = {{visibility: connectionError !== "" ? 'visible' : 'hidden'}}>
            <p className = "connectionbug-text">{connectionError}</p>
            <button onClick = {() => resubscribe(marketId, initialClk, clk)}>Resubscribe</button>
        </div>
    )
    
} 

export default ConnectionBugDisplay

