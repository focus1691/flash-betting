import React from 'react'

export default ({marketInfo}) => {
    const marketStartTime = marketInfo !== undefined ? new Date(marketInfo.marketStartTime).toLocaleTimeString() : "Loading... "
    const createdAt = new Date(Date.now()).toLocaleString('en-GB', {timeZone: 'UTC'})
    
    return (
        <div style={{width: '100%', height: '30%'}}>
            <div className = {"marketstats-title"}>
                Sports Trading App Market Settlement
            </div>
            <div className={"marketstats-info-container"}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p className={"marketstats-info-marketName"}>{marketStartTime + " " + marketInfo.marketName}</p>
                    <em className={"marketstats-info-created-at"}>Created {createdAt} (commission not included)</em>
                </div>
                
                <a href={`${window.location.origin}/dashboard`} className = {"marketstats-info-back-button"}>
                    Back To Dashboard →
                </a>
            </div>
        </div>
    )
}